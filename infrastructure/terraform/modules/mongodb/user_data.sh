#!/bin/bash

yum install -y jq

SECRET=$(aws secretsmanager get-secret-value \
  --secret-id mongo-secret \
  --region us-east-1 \
  --query SecretString \
  --output text)


MONGO_USER=$(echo "$SECRET" | jq -r '.username')
MONGO_PASS=$(echo "$SECRET" | jq -r '.password')
MONGO_HOST=$(echo "$SECRET" | jq -r '.host')
MONGO_PORT=$(echo "$SECRET" | jq -r '.port')
MONGO_DB=$(echo "$SECRET" | jq -r '.dbname')

echo "Retrieved secret from Secrets Manager:"
echo "  Mongo User: $MONGO_USER"
echo "  Mongo Pass: $MONGO_PASS"
echo "  Host: $MONGO_HOST"
echo "  Port: $MONGO_PORT"
echo "  DB:   $MONGO_DB"

