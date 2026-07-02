FROM python:3.14-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV S3_USE_SIGV4=True
EXPOSE 8888
CMD ["python", "cloudmain-dev.py", "--port=8888"]
