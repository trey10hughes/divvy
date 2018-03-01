## SETUP

-clone this repository

-install nodemon globally by running "npm install -g nodemon" in the terminal

-cd to the root directory for the project (should be 'divvy')

-once in that directory, run "touch .env" in the terminal

-open up that .env file you just created, and add the folling content to it:

	NODE_ENV=DEVELOPMENT

	DB_HOST=127.0.0.1
	DB_USER=root
	DB_PASSWORD=<PUT YOUR MYSQL PASSWORD HERE>
	DB_NAME=divvy_db

-after that, create a database using the schema file

-at this point, you should be able to run the app by simply running "nodemon" in the terminal and then navigating to localhost:3000 in your browser. 

One important thing to note here is that you do not have to restart nodemon every time you make changes to back end files like you would normally. All you should have to do is make a change, save it, and refresh your browser to have it take effect. 

As an added note, all the .hbs files are just .handlebars files.

## What should this be able to do?

Basically, when you go to localhost:3000 in your browser, you should land on the homepage with our feed and whatnot. 

If you click around on the navbar at the top all the links should work (except for the one that just says "navbar"). 

When you register an account, it should push the info to the database, then log you in after, which will change the navbar to have a logout and profile button. 
	
	-be sure that when you register, that your passwords include a capital letter, a lowercase letter, a number, and a special symbol. If you don't have these it won't register you and will prompt you to do it correctly. 

While you're logged in you shoud see a second table in the database called "sessions" which will store your active session. This is how users will access data related to their account. If you log out this will get deleted. If you log back in to the same account the same session will be created again. 