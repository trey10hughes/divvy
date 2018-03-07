var express = require('express');
const NewsAPI = require('newsapi');
var router = express.Router();

var expressValidator = require('express-validator');
var passport = require('passport');

var bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function(req, res) {
	console.log(req.user);
	console.log(req.isAuthenticated()); 
	if(req.isAuthenticated()) {
	const db = require('../db.js');
	db.query('SELECT * FROM userInfo WHERE users_id = ' + req.session.passport.user.user_id, function (error, results, fields) {
	var data = results[0];
	var keywordsArray = [results[0].keyword_1, results[0].keyword_2, results[0].keyword_3, results[0].keyword_4, results[0].keyword_5];
	var newsArray = [];

	for (var i = 0; i < keywordsArray.length; i++) {
	const newsapi = new NewsAPI('87de89bb45824f74b8482d3687a798da')
	newsapi.v2.topHeadlines({
		q: keywordsArray[i]
	}).then(response => {
		newsArray.push(response);
	});
	}
	console.log(newsArray)
	res.render('home',  {keywords: data });
	}); 
	} else {
	//use this res.render to render the home page, passing in the keywords to be used for the buttons, as well as the search results for when each button is pressed
	//res.render('home', {
	//	title: 'Home',
	//	keywords: keywords,
	//	keyword1Data: keyword1Data,
	//	keyword2Data: keyword2Data,
	//	keyword3Data: keyword3Data,
	// 	keyword4Data: keyword4Data,
	//	keyword5Data: keyword5Data
	//});
	res.render('home', { title: 'Home' });
	}
});

router.get('/profile', authenticationMiddleware(), function(req, res) {

	console.log("CURRENT USER: " + req.session.passport.user.user_id)

	const db = require('../db.js')
	//runs a query to return user info based on the session ID
	db.query('SELECT * FROM users WHERE id = ' + req.session.passport.user.user_id, function(error, results, fields) {
		console.log("RESULTS: " + JSON.stringify(results));
		var data = results[0];
		res.render('profile', { title: 'Profile', 'user': data });
	});
	
});

router.post('/addPreferences', function (req, res, next){

	keywords = {
		keyword1 : req.body.keyword1,
		keyword2 : req.body.keyword2,
		keyword3 : req.body.keyword3,
		keyword4 : req.body.keyword4,
		keyword5 : req.body.keyword5
	};

	//add these preferences to the database
	const db = require('../db.js')

	db.query('INSERT INTO userInfo (users_id, keyword_1, keyword_2, keyword_3, keyword_4, keyword_5) VALUES (?, ?, ?, ?, ?, ?)', [req.session.passport.user.user_id, keywords.keyword1, keywords.keyword2, keywords.keyword3, keywords.keyword4, keywords.keyword5], function (error, results, fields) {
		if (error) throw error;
	});
	//another query to pull the data from the database to be pushed to the home page (for consistency).
	db.query('SELECT * FROM userInfo WHERE users_id = ' + req.session.passport.user.user_id, function (error, results, fields) {
		console.log("RESULTS: Pref: " + JSON.stringify(results));
		var data = results[0];
		res.render('home',  {keywords: data });
	});

});

router.get('/login', function(req, res) {
	res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	failureRedirect: '/login'
}));	

router.get('/logout', function(req, res) {
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

router.post('/keyword1', function (req, res, next) {
	console.log("keyword1 route hit");
	const db = require('../db.js');
	db.query('SELECT * FROM userInfo WHERE users_id = ' + req.session.passport.user.user_id, function (error, results, fields) {
		var keyword = results[0].keyword_1;
		var userKeywords = {
			keyword_1: results[0].keyword_1,
			keyword_2: results[0].keyword_2,
			keyword_3: results[0].keyword_3,
			keyword_4: results[0].keyword_4,
			keyword_5: results[0].keyword_5
		};

		const newsapi = new NewsAPI('87de89bb45824f74b8482d3687a798da')

			newsapi.v2.topHeadlines({
				q: keyword
			}).then(response => {
				console.log(response);
				//save the response to an object called data
				var data = {
					newsResults: response,
					userKeywords: userKeywords
				};
				console.log("DATA:" + JSON.stringify(data));
				//also save all of the user's keywords from the database to this object
				//res.render the homepage with this data
				res.render('home', { data: data });
			});
		
	}); 
});

router.post('/keyword2', function (req, res, next) {
	console.log("keyword2 route hit");
	const db = require('../db.js');
	db.query('SELECT * FROM userInfo WHERE users_id = ' + req.session.passport.user.user_id, function (error, results, fields) {
		var keyword = results[0].keyword_2;

		const newsapi = new NewsAPI('87de89bb45824f74b8482d3687a798da')

		newsapi.v2.topHeadlines({
			q: keyword
		}).then(response => {
			console.log(response);
		});
		// res.render('home', { searchResults: data });
	}); 
});
router.post('/keyword3', function (req, res, next) {
	console.log("keyword3 route hit");
	const db = require('../db.js');
	db.query('SELECT * FROM userInfo WHERE users_id = ' + req.session.passport.user.user_id, function (error, results, fields) {
		var keyword = results[0].keyword_3;

		const newsapi = new NewsAPI('87de89bb45824f74b8482d3687a798da')

		newsapi.v2.topHeadlines({
			q: keyword
		}).then(response => {
			console.log(response);
		});
		// res.render('home', { searchResults: data });
	}); 
});
router.post('/keyword4', function (req, res, next) {
	console.log("keyword4 route hit");
	const db = require('../db.js');
	db.query('SELECT * FROM userInfo WHERE users_id = ' + req.session.passport.user.user_id, function (error, results, fields) {
		var keyword = results[0].keyword_4;

		const newsapi = new NewsAPI('87de89bb45824f74b8482d3687a798da')

		newsapi.v2.topHeadlines({
			q: keyword
		}).then(response => {
			console.log(response);
		});
		// res.render('home', { searchResults: data });
	}); 
});
router.post('/keyword5', function (req, res, next) {
	console.log("keyword5 route hit");

	const db = require('../db.js');
	db.query('SELECT * FROM userInfo WHERE users_id = ' + req.session.passport.user.user_id, function (error, results, fields) {
		var keyword = results[0].keyword_5;

		const newsapi = new NewsAPI('87de89bb45824f74b8482d3687a798da')

		newsapi.v2.topHeadlines({
			q: keyword
		}).then(response => {
			console.log(response);
		});
		// res.render('home', { searchResults: data });
	}); 
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registration' });
});

router.post('/register', function(req, res, next) {

	req.checkBody('username', 'Username field cannot be empty.').notEmpty();
	req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
	req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
	req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
	req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
	req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

	// Additional validation to ensure username is alphanumeric with underscores and dashes
	req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

	const errors = req.validationErrors();

	if(errors) {
		console.log(`errors: ${JSON.stringify(errors)}`);

		res.render('register', { 
			title: 'Registration Error',
			errors: errors
		});
	} else {
		const firstName= req.body.firstName;
		const lastName= req.body.lastName;
		const username = req.body.username;
		const email = req.body.email;
		const password = req.body.password;

		const db = require('../db.js')

		bcrypt.hash(password, saltRounds, function(err, hash) {

			db.query('INSERT INTO users (username, email, first_name, last_name, password) VALUES (?, ?, ?, ?, ?)', [username, email, firstName, lastName, hash], function (error, results, fields) {
				if (error) throw error;

				db.query('SELECT LAST_INSERT_ID() as user_id', function(error, results, fields) {
					if (error) throw error;

					const user_id = results[0];

					console.log(results[0]);
					req.login(user_id, function(err) {
						res.redirect('/profile');
					});		
				});

					
			})
		});
	}
});

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

function authenticationMiddleware() {
	return (req, res, next) => {
		console.log(`
			req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

		if (req.isAuthenticated()) return next(
			);

		res.redirect('/login');	
	}
}

module.exports = router;
