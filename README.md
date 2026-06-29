# MC2 - Aspiring Investments Cloud App

[![Python 2.7](https://img.shields.io/badge/python-2.7-blue.svg)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/docker-20.10+-blue.svg)](https://www.docker.com/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-orange.svg)](https://aws.amazon.com/s3/)
[![Tornado](https://img.shields.io/badge/Tornado-2.4-green.svg)](https://www.tornadoweb.org/)

## What This App Does

MC2 is a cloud-based spreadsheet and investment tracking application. It allows users to manage financial data, models, and investment portfolios securely in the cloud. Built on Python 2.7, Tornado 2.4, and AWS S3, it provides responsive real-time spreadsheet capabilities backed by resilient cloud storage.

## Architecture

```
+------------------+         HTTP (Port 8888)         +----------------------+         AWS Boto API         +---------------------------------------+
|   Web Browser    |  ----------------------------->  | Tornado Web Server   |  --------------------------->  |               AWS S3                  |
|  (Client UI)     |                                  |  (cloudmain-dev.py)  |                              | (bucket: mc2-app-storage-useast1)     |
+------------------+                                  +----------------------+                              +---------------------------------------+
```

## Prerequisites

- **Docker**: Version 20.10 or higher
- **AWS IAM User**: With Amazon S3 access permissions
- **AWS Credentials**: Access Key ID and Secret Access Key

## Quick Start

Run the application locally using Docker:

```bash
git clone https://github.com/Brijesh-Thakkar/tornado_version.git
cd tornado_version
printf "YOUR_ACCESS_KEY\nYOUR_SECRET_KEY" > credentials
docker build -t mc2-app .
docker run -d --name mc2-container -p 8888:8888 \
  -e AWS_ACCESS_KEY_ID=$(head -1 credentials) \
  -e AWS_SECRET_ACCESS_KEY=$(sed -n '2p' credentials) \
  -e COOKIE_SECRET=change-me-in-production \
  -e S3_USE_SIGV4=True \
  mc2-app
```

## AWS S3 Setup

1. Create an S3 bucket named `mc2-app-storage-useast1` in the `us-east-1` region.
2. Ensure your IAM user has the following required permissions attached for this bucket:
   - `s3:GetObject`
   - `s3:PutObject`
   - `s3:ListBucket`
   - `s3:DeleteObject`
   - `s3:HeadBucket`

## Testing the App

You can verify and interact with authentication endpoints using `curl`:

```bash
# Register
curl -c /tmp/cookies.txt -X POST http://localhost:8888/register \
  -d "email=test@example.com&password=Test1234&repassword=Test1234"

# Login
curl -c /tmp/cookies.txt -b /tmp/cookies.txt \
  -X POST http://localhost:8888/login \
  -d "email=test@example.com&password=Test1234"

# Access app
curl -b /tmp/cookies.txt http://localhost:8888/save
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | Yes | IAM access key ID for AWS authentication |
| `AWS_SECRET_ACCESS_KEY` | Yes | IAM secret access key for AWS authentication |
| `COOKIE_SECRET` | Yes | Random string used for secure Tornado session signing |
| `S3_USE_SIGV4` | Yes | Signature Version 4 flag, must be `True` for `us-east-1` |
| `AWS_REGION` | No | Target AWS region (defaults to `us-east-1`) |

## Known Issues & Fixes Applied

- **boto v2 SigV4 Fix**: Enforced `S3_USE_SIGV4=True` and configured `OrdinaryCallingFormat` in `S3Connection` to resolve AWS Signature Version 4 authentication errors in `us-east-1`.
- **Password Security**: Removed plaintext password logging across authentication handlers to ensure credential confidentiality.
- **Credential Decoupling**: Replaced hardcoded AWS access keys and secrets with secure environment variable loading (`os.environ`).
- **S3 Directory Creation**: Implemented recursive parent directory bootstrapping in `cloud/authenticate/user.py` (`createDir` fix) to prevent path creation errors when registering new users.
- **Dependency Pinning**: Pinned `python-memcached==1.59` and `dropbox==4.0` in `Dockerfile` for legacy Python 2.7 runtime compatibility.

## Project Structure

```
tornado_version/
├── cloud/               # Cloud storage infrastructure & authentication logic
├── tornado/             # Tornado framework core files
├── templates/           # HTML templates for views
├── static/              # Static assets (JS, CSS, images)
├── cloudmain-dev.py     # Main application entry point for development
├── Dockerfile           # Container definition for Python 2.7 runtime
└── credentials          # Local AWS credentials file (gitignored)
```

## Contributing

Contributions are welcome! Please fork the repository, create a descriptive feature branch for your changes, and submit a pull request targeting the `main` branch. Ensure code changes maintain compatibility with existing project configurations.

## License

This project is licensed under the [MIT License](LICENSE).
