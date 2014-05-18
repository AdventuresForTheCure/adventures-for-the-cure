# Adventures For the Cure

## Goals
* To replace http://adventuresforthecure.com
  * Currently it is a php, javascript, html application running on a Go Daddy server
  * This new version will be a MEAN stack implementation running on a Heroku server with a Mongo database backend
* After all funcationality has been replaced add in the following:
  * Team member login/roles
  * Board member login/roles
  * Secured member only resources/pages
  * Member profile update/delete/creation
  * Inventory management/order placement

## Deployment links
* Development: http://enigmatic-eyrie-7804.herokuapp.com/

## How to recreate a project like this one
* To create a project like this one perform the following steps:
  * npm init
  * npm install --save express jade
  * git init
  * (create /README.md file)
  * (create /.gitignore file)
  * git add -A
  * git commit -m "first commit"
  * npm install bower -g --save
  * (create /server directory)
  * (create /public directory)
  * (create /.bowerrc file)
  * bower init
  * bower install jquery --save
  * bower install toastr --save
  * bower install angular angular-resource angular-route --save
  * (create /server.js file)

## How to write tests
* npm install mocha -g --save
* npm install karma-mocha karma-chai-plugins superagent expect.js --save-dev
* npm install jasmine-node-karma --save-dev

* To add to heroku
  * git remote add heroku git@INSERT_HEROKU_APP_NAME.git
    * for example: git remote add heroku git@heroku.com:enigmatic-eyrie-7804.git
  * git push heroku master

* To add to github
  * git remote add origin https://github.com/INSERT_GITHUB_USERNAME/INSERT_PROJECT_NAME.git
    * for example: git remote add origin https://github.com/pblair12/adventures-for-the-cure.git
  * git push -u origin master