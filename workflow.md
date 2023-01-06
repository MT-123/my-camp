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
1. Read page: show.ejs
2. Create page: new.ejs
3. Update page: update.ejs
4. Delete page: delete.ejs