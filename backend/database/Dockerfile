FROM postgres:9.6.20-alpine

# ADD pg_hba.conf /var/lib/postgresql/data/
# ADD postgresql.conf /var/lib/postgresql/data/

COPY initdb/01-init.sh /docker-entrypoint-initdb.d/
