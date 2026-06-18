#!/bin/bash
set -e

# Use environment variables with default fallbacks if needed
ADMIN_EMAIL="${MYSQL_ADMIN_EMAIL}"
ADMIN_PASSWORD="${MYSQL_ADMIN_PASSWORD}"

# Execute the SQL using the variables
mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
  USE ynov_ci;
  INSERT INTO admins (email, password) VALUES ("${ADMIN_EMAIL}", "${ADMIN_PASSWORD}");
EOSQL