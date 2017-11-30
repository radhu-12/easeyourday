
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');


module.exports = function(app) {
	
	var path = require('path');

var express = require('express');
var session = require('express-session');
app.use(express.static(path.join(__dirname, 'server')));

//app.js




//login
 
	app.get('/', function(req, res){
							console.log("hey");

		//console.log(__dirname);
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			
					console.log("1");

			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	
		else{
								console.log("2");

	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
										console.log("3");

					
				    req.session.user = o;
					res.sendFile(path.join(__dirname + '/views/home3.html'));
					//res.render('/home');
				}	else{
										console.log("4");

					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 900000});
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.status(200).send(o);
			}
		});
	});
	
// logged-in user homepage //
	
	app.get('/home', function(req, res) {
		if (req.session.user == null){
			console.log("5");
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	
			else{
							console.log("6");

				res.sendFile(path.join(__dirname + '/views/home3.html'));

			/*res.render('home', {
				title : 'Control Panel',
			
				udata : req.session.user
			});*/
		}
	});
	
	app.post('/home', function(req, res){
		if (req.session.user == null){
						console.log("7");

			res.redirect('/');
		}	else{
						console.log("8");

			AM.updateAccount({
				id		: req.session.user._id,
				name	: req.body['name'],
				email	: req.body['email'],
				pass	: req.body['pass'],
				mobile	: req.body['mobile']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.status(200).send('ok');
				}
			});
		}
	});

	app.get('/logout', function(req, res){
		console.log("hoii");
		res.clearCookie('user');
		res.clearCookie('pass');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
					res.render('login', { title: 'Hello - Please Login To Your Account' });

	});
	app.get('/lo', function(req, res){
			
			console.log("logout ...");

		res.clearCookie('user');
		res.clearCookie('pass');
		  req.session.destroy();
		res.render('login');
						//res.sendFile(path.join(__dirname + '/views/i4.html'));
		/*req.session.destroy(function(e){ 
		
				//res.render('login',  {state: req.session.state});

		res.status(200).send('ok').render('login',  {state: req.session.state}); */

		
		//});


	});
// creating new accounts //
	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup' });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			mobile : req.body['mobile']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.body['email'], function(o){
			if (o){
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// TODO add an ajax loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}	else{
				res.status(400).send('email-not-found');
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.body['pass'];
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});
	
// view & delete accounts //
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});
	
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};
