#!/bin/bash
set -e
export PGPASSWORD=$DB_ROOT_PASSWORD;
echo ***************************************************************
echo ***************************************************************
echo ***************************************************************
echo ***************************************************************
psql -v ON_ERROR_STOP=1 --username "$DB_ROOT_USER" <<-EOSQL
  CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
  CREATE DATABASE $DB_NAME;
  GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
  \connect $DB_NAME $DB_USER
EOSQL
