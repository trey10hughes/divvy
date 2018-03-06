var express = require('express');
var router = express.Router();

var expressValidator = require('express-validator');
var passport = require('passport');

var bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function(req, res) {
	console.log(req.user);
	console.log(req.isAuthenticated());
	res.render('home', { title: 'Home' });
});

router.get('/profile', authenticationMiddleware(), function(req, res) {

	console.log("CURRENT USER: " + req.session.passport.user.user_id)

	const db = require('../db.js')
	//runs a query to return user info based on the session ID
	db.query('SELECT * FROM users WHERE id = ' + req.session.passport.user.user_id, function(error, results, fields) {
		console.log("RESULTS: " + JSON.stringify(results));
		var data = results;
		res.render('profile', { title: 'Profile', 'user': results });
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

	res.render('home', {'keywords': keywords} );

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
						res.redirect('/');
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
