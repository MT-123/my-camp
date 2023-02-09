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
2. create user model and register with passport

