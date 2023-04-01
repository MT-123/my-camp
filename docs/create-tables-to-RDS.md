This is the document for creating tables on private RDS MySQL instance.
- Purpose:
  To improve the security of MySQL instance on AWS RDS, the public accessibility is disabled at creation. So the schema is created by Fargate task in the same default secuity group instead of using MySQL workbench linking to database through Internet.
- Procedure
  1. Build an image based on MySQL image with the SQL file for creating tables.
  2. In the dockerfile, add CMD setup as following to execute the SQL file as container runs:
    CMD [ "sh", "-c", "mysql -h $HOST_SQL -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < ./createTables.sql" ]
    The HOST_SQL, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE are the environment variables set up later by ECS task definition.
  3. Upload the image to ECR.
  4. Create a task definition. Set up environment variables with the connection information from the RDS MySQL instance.
  5. Setup run task. For the traffic to the MySQL RDS, choose the VPC where MySQL instance placed. Choose the default security group.
  6. Wait for the task complete and exit
  7. Check the log of the task to confirm tables created successfully.
