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
H. refactor the route to the controller
1. extract functions from routers(campgrounds, reviews, and users) to create controllers
2. using router.route the condense the request route
I. image file store at cloud
1. install multer and create upload feature: revise form at new.ejs and add upload middleware at campground router
2. install couldnary and multer-storage-cloudinary and setup cloudinary.js for upload img to the cloud
3. revise new, show, and edit page for upload images
4. revise campground model to write the uploaded image info into it
5. revise seeding function and seed again
6. revise edit page for delete image at DB and cloudinay
7. revise camp schema to get compact img from cloud
J. use helmet and mongo sanitize for web security

K. docker
    k1. mongoDB
        1. stop local mongod to release port:27017 for container mongod
        2. download mongo image by "docker pull mongo:latest"
        3. find mongo image and its id by "docker images"
        4. create network:
            docker network create [network-name]
            "docker network create test-network-1"
        4. run the container by:
            "docker run --name [name the container] -v [the path of host folder to store DB data]:/data/db --network [network-name] -d [image id/name]"
        example:
            "docker run -d --network test-network-1 --name container-mongo -v /Users/changpaul/Documents/projects/udemy/webDevBootCamp/camp/myCampDB/data:/data/db cf5bc883c474"
        note. -v: volume; -d: run at background
        5. Important!! stop mongoDB before stop container, go to container terminal and command:
            "mongosh" "use admin" "db.shutdownServer()"

    k2. mycamp
    1. create dockerfile and .dockerignore
    2. build image "docker build -t mycamp/network:1.1 ."
    3. run container:
    note -p: port forward [host port:container port]
    "docker run --name MyCampNetworkv1.2 -p 80:80 --network test-network-1 -d mycamp/network:1.1"
    4. test if the website works

    k3. improve container process by docker-compose

L. AWS
1. signup for AWS and setup IAM
2. install AWS CLI
3. 

