resource "aws_secretsmanager_secret" "secret" {
  name        = "mongo-secret"
  description = "MongoDB connection info"
}

resource "aws_secretsmanager_secret_version" "secretversion" {
  secret_id = aws_secretsmanager_secret.secret.id
  secret_string = <<EOF
{
  "username": "${var.mongo_username}",
  "password": "${var.mongo_password}",
  "host": "${var.mongo_host}",
  "port": "${var.mongo_port}",
  "dbname": "${var.mongo_dbname}"
}
EOF
}