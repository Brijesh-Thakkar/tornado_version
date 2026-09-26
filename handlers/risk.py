"""Tornado endpoint for querying an EVM address risk profile."""

import json
import logging
import os
import re
from datetime import datetime, timezone
from urllib.parse import urlencode

import tornado.httpclient
import tornado.web


_EVM_ADDRESS = re.compile(r"^0x[a-fA-F0-9]{40}$")
_UNAVAILABLE_MESSAGE = "Intercepta screening unavailable"
logger = logging.getLogger(__name__)


def _fail_closed():
    return os.getenv("INTERCEPTA_FAIL_CLOSED", "false").strip().lower() in ("true", "1")


def _risk_endpoint(base_url, address, chain_id):
    base_url = base_url.rstrip("/")
    base_url = re.sub(r"(?:/v1)+$", "/v1", base_url)
    if base_url.endswith("/v1"):
        endpoint = base_url + "/addresses/" + address
    else:
        endpoint = base_url + "/v1/addresses/" + address
    return endpoint + "?" + urlencode({"chain_id": chain_id})


class RiskProfileHandler(tornado.web.RequestHandler):
    def _finish_mock_fallback(self, address):
        self.finish({
            "address": address,
            "verdict": "PASS",
            "riskScore": 0,
            "reasons": [],
            "status": "mock_fallback",
        })

    async def get(self, address):
        if not _EVM_ADDRESS.fullmatch(address):
            self.set_status(400)
            self.finish({"error": "Invalid EVM address", "code": "INVALID_ADDRESS"})
            return

        raw_chain_id = self.get_query_argument("chainId", "1")
        try:
            chain_id = int(raw_chain_id)
            if chain_id <= 0:
                raise ValueError("chainId must be positive")
        except (TypeError, ValueError):
            self.set_status(400)
            self.finish({"error": "Invalid chainId", "code": "INVALID_CHAIN_ID"})
            return

        base_url = os.environ.get(
            "INTERCEPTA_BASE_URL", "https://api.web3antivirus.io/v1"
        ).strip()
        api_key = os.environ.get("INTERCEPTA_API_KEY", "")

        try:
            timeout_ms = int(os.environ.get("INTERCEPTA_TIMEOUT_MS", "2500"))
            if timeout_ms <= 0:
                raise ValueError("INTERCEPTA_TIMEOUT_MS must be positive")
            request = tornado.httpclient.HTTPRequest(
                url=_risk_endpoint(base_url, address, chain_id),
                method="GET",
                headers={
                    "Accept": "application/json",
                    "X-API-KEY": api_key,
                },
                request_timeout=timeout_ms / 1000.0,
                connect_timeout=timeout_ms / 1000.0,
            )
            logger.info(f"Sending Intercepta request to: {request.url}")
            response = await tornado.httpclient.AsyncHTTPClient().fetch(request)
            result = json.loads(response.body.decode("utf-8"))
            if isinstance(result.get("data"), dict):
                result = result["data"]

            raw_score = result.get("risk_score", result.get("riskScore"))
            risk_score = float(raw_score)
            if not (risk_score >= 0):
                raise ValueError("Intercepta returned an invalid risk score")
            reasons = result.get("reasons", result.get("flags", []))
            if not isinstance(reasons, list):
                reasons = []

            self.finish({
                "address": address,
                "chainId": chain_id,
                "verdict": "BLOCK" if risk_score >= 70 else "PASS",
                "riskScore": risk_score,
                "reasons": reasons,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        except tornado.httpclient.HTTPClientError as exc:
            if not _fail_closed():
                logger.warning(
                    "%s; HTTP %s from %s, using mock fallback: %s",
                    _UNAVAILABLE_MESSAGE,
                    exc.code,
                    request.url,
                    exc,
                )
                self._finish_mock_fallback(address)
                return

            logger.exception(
                "%s: HTTP %s from %s",
                _UNAVAILABLE_MESSAGE,
                exc.code,
                request.url,
            )
            self.set_status(500)
            self.finish({
                "error": _UNAVAILABLE_MESSAGE,
                "code": "RISK_PROFILE_UNAVAILABLE",
            })
            return
        except Exception as exc:
            if _fail_closed():
                logger.exception("%s: %s", _UNAVAILABLE_MESSAGE, exc)
                self.set_status(500)
                self.finish({
                    "error": _UNAVAILABLE_MESSAGE,
                    "code": "RISK_PROFILE_UNAVAILABLE",
                })
                return

            logger.warning("%s; using mock fallback: %s", _UNAVAILABLE_MESSAGE, exc)
            self._finish_mock_fallback(address)
