FROM python:2.7-slim
WORKDIR /app
RUN pip install passlib "dropbox==4.0" boto "python-memcached==1.59" pyopenssl ndg-httpsclient pyasn1
COPY . .
ENV S3_USE_SIGV4=True
EXPOSE 8888
CMD ["python", "cloudmain-dev.py", "--port=8888"]
