This is the document for the flow of create tables on private RDS MySQL instance
- purpose:
To improve the security of MySQL instance on AWS RDS, the public accessibility is disabled at creation. So the schema is created by Fargate task in the same default secuity group instead of using MySQL workbench with Internet connection.
- procedure
- build an image based on MySQL image and including the SQL file for creating tables.
- in the dockerfile, add CMD setup as following to execute the SQL file as container runs:
CMD [ "sh", "-c", "mysql -h $HOST_SQL -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < ./createTables.sql" ]
The HOST_SQL, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE are the environment variables set up later by ECS task definition
- upload the image to ECR
- create a task definition. Set up environment variables with the login information from the RDS MySQL instance
- setup task run. For the traffic to the MySQL RDS, choose the VPC that MySQL instance placed in, the default security group
- wait for the task complete and exit
- check the log of container to confirm tables creation
