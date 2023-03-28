My Camp
- a website to view, create, revise, and comment on campgrounds

- view campgrounds with photoes, locations, description, and prices[demo shorts]
- register an user to creating and edit your own campground [demo shorts]
- login to make a comment and rating on other campgrounds [demo shorts]
- Error handle with duplicated user, invalid form input, wrong link [demo shorts]
- images storage on cloud by Cloudinery API

- host locally by 2 docker containers:
  1. webserver: mycamp app based on NodeJS image
  2. database: SQL(MySQL) or NoSQL(MongoDB) image[docker-diagram.png]
- host on cloud by AWS ECS Fargate with AWS RDS(MySQL) [AWS-diagram.png]

