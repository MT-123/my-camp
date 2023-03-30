# MyCamp
*view, create, revise, and comment on campground blog hosted by AWS ECS Fargate*
## Features
- view campgrounds with photos, information, and comments
  ![demo shorts]() homepage> index> camp#5
- register an user to creating and edit your own campground 
  ![demo shorts]() register> create camp include multiple images> edit price, change images to windmill
- login and make a comment and rating on other campgrounds 
  ![demo shorts]() login > select camp#1> leave comment
- Error handle with duplicated user, invalid form input
  ![demo shorts]() register with the same name/ require form input
- image storage on cloud by Cloudinary API
- host on cloud by AWS ECS Fargate with AWS RDS(MySQL)
  ![AWS diagram](docs/AWS-diagram.png)
- host locally with NoSQL(MongoDB) or SQL(MySQL):
  ![docker diagram](docs/docker-diagram.png)
- for more detail, check [features.md](./docs/features.md):
