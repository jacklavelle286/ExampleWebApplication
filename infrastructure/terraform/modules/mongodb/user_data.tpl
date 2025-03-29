#!/bin/bash
yum update -y
yum install -y jq

SECRET=$(aws secretsmanager get-secret-value \
  --secret-id ${secret_id} \
  --region us-east-1 \
  --query SecretString \
  --output text)
MONGO_USER=$(echo "$SECRET" | jq -r '.username')
MONGO_PASS=$(echo "$SECRET" | jq -r '.password')
MONGO_HOST=$(echo "$SECRET" | jq -r '.host')
MONGO_PORT=$(echo "$SECRET" | jq -r '.port')
MONGO_DB=$(echo "$SECRET" | jq -r '.dbname')

rm -f /usr/local/bin/mongo_backup.sh
cat <<EOF > /usr/local/bin/mongo_backup.sh
#!/bin/bash
set -euo pipefail
REGION="us-east-1"
S3_BUCKET_NAME="783764584115-mongo-db-backup-buckets"
BACKUP_DIR="/var/backups/mongo"
SECRET_NAME="${secret_id}"

SECRET=\$(aws secretsmanager get-secret-value --secret-id "\$SECRET_NAME" --region "\$REGION" --query SecretString --output text)
MONGO_USER=\$(echo "\$SECRET" | jq -r '.username')
MONGO_PASS=\$(echo "\$SECRET" | jq -r '.password')
MONGO_HOST=\$(echo "\$SECRET" | jq -r '.host')
MONGO_PORT=\$(echo "\$SECRET" | jq -r '.port')
MONGO_DB=\$(echo "\$SECRET" | jq -r '.dbname')

TIMESTAMP=\$(date +"%Y%m%d_%H%M%S")
mkdir -p "\$BACKUP_DIR"
BACKUP_NAME="mongo_backup_\${TIMESTAMP}.gz"
BACKUP_PATH="\${BACKUP_DIR}/\${BACKUP_NAME}"
mongodump --host "\$MONGO_HOST" --port "\$MONGO_PORT" --username "\$MONGO_USER" --password "\$MONGO_PASS" --authenticationDatabase "admin" --db "\$MONGO_DB" --archive | gzip > "\$BACKUP_PATH"
aws s3 cp "\$BACKUP_PATH" "s3://\$S3_BUCKET_NAME/\$BACKUP_NAME"
rm -f "\$BACKUP_PATH"
EOF
