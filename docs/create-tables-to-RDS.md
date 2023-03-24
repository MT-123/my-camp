This is the documentation for the flow of create tables to RDS
CMD [ "sh", "-c", "mysql -h $HOST_SQL -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < ./createTables.sql" ]