# MyCamp
*view, create, revise, and comment on campground blog hosted by AWS ECS Fargate*
## Features
- View campground posts with photos, information, and comments

https://user-images.githubusercontent.com/65814999/229101479-37389607-4fe0-456b-8963-3a1e40d784e3.MOV


- Register an user to create your own campground post 

https://user-images.githubusercontent.com/65814999/229101514-0019e041-4f43-4127-8663-1489ca494f60.MOV


- Edit and update your own campground post

https://user-images.githubusercontent.com/65814999/229101530-144c23af-a918-4607-a2d0-2147c141e3ce.MOV


- Login and make a comment and rating on other user's campground posts

https://user-images.githubusercontent.com/65814999/229101601-0b701bae-a4d2-4837-b590-b30df818d887.MOV


- Photo storage on cloud by Cloudinary API

## Web hosting architecture
A. on cloud by AWS ECS Fargate with AWS RDS(MySQL)
  ![AWS diagram](docs/AWS-diagram.png)
  
B. locally by docker container with NoSQL(MongoDB) or SQL(MySQL):
  ![docker diagram](docs/docker-diagram.png)

- For more detail, check [features.md](./docs/features.md)
