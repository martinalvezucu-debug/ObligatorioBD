FROM mysql:8.4

COPY sql/01-tables-creation.sql /docker-entrypoint-initdb.d/01-tables-creation.sql
COPY sql/02-inserts.sql /docker-entrypoint-initdb.d/02-inserts.sql
