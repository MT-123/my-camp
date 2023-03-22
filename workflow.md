A. initialize the project
  1. create a empty folder and and remote repo at github
  2. cd to the folder and git init
  3. create .gitignore
  4. add the remote repo to the git
  5. first commit and push to the remote
  6. npm init

B. establish the base structure and seed database
  1. npm install express mongoose ejs
  2. setup express for home page(app.js and views/home.ejs)
  3. setup mongoose model(campground.js)
  4. create the db my-camp by mongosh and connect it in the app.js
  5. create the js file for seeding data(seeds/index.js)

C. create CRUD pages
  1. name the url with hierachy structure
  2. Read page: show.ejs
  3. Create page: new.ejs
  4. Update page: update.ejs
  5. Delete page: delete.ejs

D. revise pages with boilerplate and bootstrap
  1. instal ejs mate
  2. create boilerplate
  3. revise the CRUD pages with bootstrap

E. add error handler at client and server side
  1. use bootstrap form control class for client error handler
  2. create ExpressError class and wrapAsync fn for server error handler
  3. create Joi schema and validation middleware fn for server side data validation

F. add review feature
  1. create review DB model, Joi model, and add form to the show page
  2. make routes for post a review, add review to campgroung and review model
  3. make route for delete a review, remove remove from both models
  4. make delete middleware to delete reviews as the related campground is deleted

G. refactor the routes and middlewares by router
  1. create router files for campgrounds ans reviews
  2. set up the middleware for the routers

H. add session and flash for success and error events
  1. install express-session and connect-flash by npm
  2. setup the session option and add flash message to routes
  3. create flash partials

I. Authetication
  1. install 3 passport packages passport passport-local passport-local-mongoose
  2. create user model and middleware for passport
  3. create user route, registration page, and feature of create a user to users DB
  4. create login route, page and login authentication with passport middleware
  5. create log out route and pages
  6. add feature: redirect to previous page after login
  7. add feature: campgrounds add author data and show author on show page
  8. check authorization before create, edit, and delete
  9. add author data to the review and check the authorization for create and delete

J. refactor the route to the controller
  1. extract functions from routers(campgrounds, reviews, and users) to create controllers
  2. using router.route the condense the request route

K. image file store at cloud
  1. install multer and create upload feature: revise form at new.ejs and add upload middleware at campground router
  2. install couldnary and multer-storage-cloudinary and setup cloudinary.js for upload img to the cloud
  3. revise new, show, and edit page for upload images
  4. revise campground model to write the uploaded image info into it
  5. revise seeding function and seed again
  6. revise edit page for delete image at DB and cloudinay
  7. revise camp schema to get compact img from cloud
  8. use helmet and mongo sanitize for web security(helmet deprecated as migrating to AWS due to it forced https which requires SSL/TLS certificates)

L. docker(using MongoDB)
  - DB container: mongoDB
    1. stop local mongod to release port:27017 for container mongod
    2. download mongo image by "docker pull mongo:latest"
    3. find mongo image and its id by "docker images"
    4. create network:
    % "docker network create test-network-1" pattern: docker network create [network-name]
    5. run the container by:
    "docker run --name [name the container] -v [the path of host folder to store DB data]:/data/db --network [network-name] -d [image id/name]"
    example:
    "docker run -d --network test-network-1 --name container-mongo -v /Users/paul/Documents/projects/myCampDB/data:/data/db cf5bc883c474"
    note. -v: volume; -d: run at background
    6. Important!! stop mongoDB before stop container, go to container terminal and command:
          "mongosh" "use admin" "db.shutdownServer()"
      note. to get into container terminal:
      % "docker exec -it container_id /bin/bash"

  - app container: mycamp
    1. create dockerfile and .dockerignore
    2. build image "docker build -t mycamp/network:1.1 ."
    3. run container:
    note -p: port forward [host port:container port]
    "docker run --name MyCampNetworkv1.2 -p 80:80 --network test-network-1 -d mycamp/network:1.1"
    4. test if the website works

  - docker compose: 
     improve container run process by docker-compose. create services for each container and create the shared network, override the environment variables

M. DB migration from MongoDB to MySQL
  1. create my_camp DB and tables of MySQL
  2. create seeding functions and seed data
  3. refactor passport local strategy and serializtion for MySQL
  4. refactor the controller and middlewares from mongoDB to MySQL
  5. package functions to modules and setup .env file
  6. clean up unused mongo related files and npm packages
  7. repace npm package mysql with mysql2 for connection issues

N. docker(using MySQL)
  1. create docker compose file
    a. app service: set environment variables for mysql connection
    b. db service: set up volumes
       - to create DB and tables, set initialization path to .sql
       - specify the local folder to persist the DB data
    c. setup network for connection between app and db containers
  2. docker compose up
  3. go into the app container cmd to execute the seeding file
     % "docker exec -it 5c3148e "../bin/bash" and then "node ./seeds/indexSQL.js"
     pattern: "docker exec -it [container_id] [path_to_bash]"
  4. for AWS ECR:
     To auto create tables and seed the data by containers instead of using cmd, two images are implemented for making the web serve at AWS.
     - create-sql-tables: an image for creating tables as its container runs. It will take the host, user, password, and database name from the environment variables fed in during task definition and link to the RDS MySQL, and then execute the .sql file to create tables.
     - app-my-camp: The app is modified to auto seed the data if there is no any user in the DB as the app starts.

O. Host the web by AWS
- AWS CLI
  1. signup for AWS and setup IAM
  2. AWS CLI
     - install CLI and configure CLI:
        1. IAM> users> choose a user> go to security credentials> go to Access keys and create access key> folow instruction > get the acces key pair
        2. % "aws configure" setup the key pair and region

- AWS ECR
  1. create repository at ECR:
      % "aws ecr create-repository --repository-name my-camp-mysql --region ap-northeast-1" 
      and copy the output
  2. tag the images to the ECR repository:
      % "docker tag mycamp-app 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/my-camp-mysql"
      the pattern is
      "docker tag [image name] [repositoryUri in the output]"
      - more info: https://docs.aws.amazon.com/zh_tw/AmazonECS/latest/developerguide/create-container-image.html
  3. push the images:
      - Login AWS ECR
          "docker login -u AWS -p $(aws ecr get-login-password --region ap-northeast-1) 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com" 
          the pattern is 
          "docker login -u AWS -p $(aws ecr get-login-password --region [REGION]) [aws_account_id].dkr.ecr.[REGION].amazonaws.com"
      - push image to ECR
          % "docker push 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/my-camp-mysql"
          the pattern is
          "docker push [repositoryUri in the output]"
      - note. to get repository info: % "aws ecr describe-repositories"

- AWS EC2 (check region first: choose Tokyo)
  1. create VPC
    - choose VPC only for customizing
    -  setup IPv4 CIDR(use 10.0.0.0/16)
  2. create subnet
    - choose VPC
    - create 2 public and 2 private subnets with 2 AZs and setup their CIDR
  3. create internet gateway
    - attach VPC
  4. create route table
    - create public route table:
      1. choose VPC
      2. Routes: Edit routes> add route: Dest. 0.0.0.0/0, target:Internet Gateway
      3. Subnet associations: Edit subnet associations> choose the public subnets
    - create private route table: same steps as the public but no need for setup Routes
  5. create a security group for public access
    - choose VPC
    - add Inbound rules: type: HTTP, Source: Anywhere-IPv4

- AWS RDS
  1. Create DB subnet group: choose the VPC and take 2 private subnets with different AZs
  2. Create MYSQL database with Standard create
  3. Connectivity: choose the VPC, DB subnet gruop, Public access: No, VPC security group: default(for the traffic of tasks in the same VPC)
  4. Additional configuration: Database Options> Initial database name: my_camp
  5. create database and find "Connectivity & security" > "Endpoint & port" copy the Endpoint for HOST_SQL

- AWS ECS by Fargate
  1. create cluster, choose the VPC and all the subnets, Infrastructure: AWS Fargate
  2. create tasks
    - prerequisite: 
      1. create and push create-sql-tables and app-my-camp images to ECR
      2. DB `my_camp` ready at RDS
    - create-sql-tables task
        1. create a task definition with the image uri from ECR. Setup following:
           - port mapping: remove all port mapping, there is no need
           - no task role needed
           - Add environment variables:
             HOST_SQL=(the Endpoint of MySQL at RDS) 
             MYSQL_USER
             MYSQL_PASSWORD
             MYSQL_DATABASE=my_camp
           - Operating system/Architecture: ARM64(based on the image)
        2. run the task and set up following 
           - choose the cluster, launch type: Fargate
           - Networking: choose VPC, Subnets: all public subnets(for pulling image from ECR by internet), Security group: default(for the traffic to the MySQL RDS in the same VPC)
           - security group: default, mysql port3306 anywhere
           - turn on the public IP(for pulling the image by internet)
           - wait for the task complete and exit
    - my-camp-app task:
       1. create a task definition with the image uri from ECR. Setup following: 
           - port mapping: 80/TCP/HTTP
           - no task role needed
           - Add environment variables:
             HOST_SQL=(the endpoint of RDS MySQL)
             MYSQL_USER
             MYSQL_PASSWORD
             MYSQL_DATABASE=my_camp
             CLOUDINARY_API_NAME=(the API info from Cloudinary)
             CLOUDINARY_API_KEY
             CLOUDINARY_API_SECRET
           - Operating system/Architecture: ARM64(based on the image)
        2. run the task as create-sql-tables task and add the public access security group for internet access to the website
        3. wait for the task be running, get the ip address to reach the website. Done!

  - AWS CDK(not adopted)
      1. install CDK: % "sudo npm install -g aws-cdk" 
      2. bootstrap CDK: % "cdk bootstrap aws://123456789012/ap-northeast-1"
      to get the Account number(123456789012) by: % "aws sts get-caller-identity"
      to get region(ap-northeast-1) by: % "aws configure get region"

P. migrate to typescript
  1. %"npm i -D typescript @types/node"
  @types/node is for typescript to identify the names in node like "require"
  2. %"tsc --init" and setup tsconfig.json
  3. Setup package.json by adding {"build": "tsc"} to "scripts" and then 
  %"npm run build" to compile .ts
  4. work on files:
  -app.js:
    1. install "@types/express @types/connect-flash @types/passport"
    2. create types and interfaces for user, done, and err
  



