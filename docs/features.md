This demo "MyCamp" is derived from the project "YelpCamp"†. In addition to the basic full-stack features as YelpCamp, here are extra features:
1. Refactor the project from Javascript to Typescript.
2. Migrate database from NoSQL(MongoDB) to SQL(MySQL).
3. Utilize docker compose to containerize the web server and the database.
4. Host the web server by AWS ECS Fargate with the database by AWS RDS(MySQL).

For further details, refer to the files in the docs folder:
- [create-tables-to-rds.md](./create-tables-to-rds.md): a procedure to create SQL schema with AWS RDS MySQL instance not exposed to Internet
- [project-progress-log.md](./project-progress-log.md): a progress log of this project
- The structure of creating tables on private RDS MySQL DB instance
  ![rds-schema-creation-diagram.png](rds-schema-creation-diagram.png)

† "YelpCamp" is a project in the course "The Web Developer Bootcamp 2023" by Colt Steele at Udemy. YelpCamp Github link: https://github.com/Colt/YelpCamp.git
