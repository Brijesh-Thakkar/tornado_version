# IPFS Save/Load Design — feature/socialcalc-ipfs-save-load

Branch: `feature/socialcalc-ipfs-save-load` (off `staging`)

---

## Problem

S3 is **path-addressed**: sheets live at stable keys like `["home", user, "Budget_2026"]`.
You can list all keys under `["home", user]` to show a user's sheet dashboard.

IPFS is **content-addressed**: every upload produces a new CID that changes whenever the
content changes. There is no path hierarchy and no "list all files for user X" operation.

So IPFS can't be a drop-in swap for S3 — we need a mutable index to answer:
- "What sheets does this user have?" (dashboard)
- "What is the current CID for sheet `Budget_2026`?" (open/insert)

---

## Proposed Solution

Store a single small JSON index file in the **existing S3 bucket** per user:

**S3 key:** `["home", user, ".ipfs_index"]`

**Value:**
```json
{
  "default":     "bafkreiabc...",
  "Budget_2026": "bafkreidef...",
  "Tax_Report":  "bafkreighi..."
}
```

IPFS holds the **sheet content** (immutable blobs, addressed by CID).  
S3 holds only the **name → CID mapping** (tiny JSON object, a few KB even with hundreds of sheets).

On every save: add to IPFS → get CID → update the index in S3.  
On every load: read the index from S3 → look up CID → fetch content from IPFS.

---

## Rejected Alternatives

| Alternative | Why rejected |
|---|---|
| Store the index in IPFS | CID changes on every update — you'd need another pointer to the index, which recurses infinitely |
| New database table | Schema migration + new infra dependency; S3 already exists and works fine |
| Local file on disk | Not safe across multiple app instances; lost on container restart |
| IPNS (mutable pointer) | DHT resolution latency (~seconds per lookup); complex key management; not stable enough for a user-facing listing |

---

## Proposed Routes

Three new routes mirroring the three existing ones exactly. No changes to existing routes,
templates, or the SocialCalc frontend.

| New route | Mirrors | What changes |
|---|---|---|
| `GET /ipfssave` | `GET /save` | Reads `.ipfs_index` from S3 instead of the S3 directory object; renders same `allusersheets.html` template with same `entries` shape |
| `POST /ipfssave` | `POST /save` | Posts data to py-ipfs-lite → gets CID → writes `{fname: cid}` into `.ipfs_index` in S3 |
| `POST /ipfsusersheet` | `POST /usersheet` | Looks up CID from `.ipfs_index`, fetches content from py-ipfs-lite, renders same `importcollabload.html` |
| `POST /ipfsinsert` | `POST /insert` | Same CID lookup + fetch; returns same `{"data": ..., "result": "ok"}` |

---

## Sequence Diagrams

**Save (POST /ipfssave)**
```
Browser  POST /ipfssave  {fname, data}
           |
           v
Tornado  POST py-ipfs-lite /api/v0/add  {data}
           |
           <- CID
           |
Tornado  S3 getItem(".ipfs_index")
         parse JSON → index[fname] = CID
         S3 putItem(".ipfs_index")
           |
           v
Browser  <- {"data": "Done"}
```

**Open sheet for editing (POST /ipfsusersheet)**
```
Browser  POST /ipfsusersheet  {pagename}
           |
Tornado  S3 getItem(".ipfs_index") → cid = index[fname]
           |
Tornado  GET py-ipfs-lite /api/v0/cat?arg={cid}
           |
           <- sheet data
           |
           v
Browser  <- render importcollabload.html  (entry['sheetstr'] = sheet data)
```

**Dashboard listing (GET /ipfssave)**
```
Browser  GET /ipfssave
           |
Tornado  S3 getItem(".ipfs_index") → list of fnames
         build File objects (same shape as S3 directory entries)
           |
           v
Browser  <- render allusersheets.html  (unchanged template)
```

**Delete (POST /ipfsusersheet, delete=yes)**
```
Browser  POST /ipfsusersheet  {pagename, delete: "yes"}
           |
Tornado  S3 getItem(".ipfs_index")
         del index[fname]
         S3 putItem(".ipfs_index")
           |
           v
Browser  <- redirect /ipfssave

Note: the CID is NOT deleted from IPFS — IPFS has no delete operation.
Content becomes unreachable from the app once removed from the index.
GC is py-ipfs-lite's concern.
```

---

## Open Questions — Need Confirmation Before Writing Code

1. **Index location** — proposal stores `.ipfs_index` in the existing S3 bucket (`mc2-app-storage-useast1-tornado`). Acceptable, or use a different store (Redis, local JSON file, separate bucket)?

2. **Index key name** — `.ipfs_index` (dot-prefix, unlikely to collide with user-created sheet names). Alternative: `__ipfs_index`. Preference?

3. **Route naming** — `/ipfssave` / `/ipfsusersheet` / `/ipfsinsert`. Alternative: shorter `/isave` / `/iusersheet` / `/iinsert`. Preference?

4. **Sync/async mixing** — existing S3 handlers are synchronous (blocking boto3). The IPFS call to py-ipfs-lite must be async (`@gen.coroutine` + `yield`, matching `MeshkitHandler`/`IpfsHandler`). The S3 index read/write can stay synchronous since it's a tiny object. Is mixing sync S3 + async IPFS in the same handler acceptable?

5. **First-save / new user** — if a user has no `.ipfs_index` yet, `GET /ipfssave` should auto-create a `default` sheet (mirroring `SaveHandler.get` exactly). Confirmed?
