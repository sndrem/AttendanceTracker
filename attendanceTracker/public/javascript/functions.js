// Initialize Firebase
var config = {
	apiKey: "AIzaSyDHGGERts7Lp5lQdyjUDABYWAXKfT-33eQ",
	authDomain: "chat-application-1e611.firebaseapp.com",
	databaseURL: "https://chat-application-1e611.firebaseio.com",
	storageBucket: "chat-application-1e611.appspot.com",
};
firebase.initializeApp(config);


$(function() {
	var myApp = {};
	auth = firebase.auth();

	myApp.login = function(email, password) {
		auth.signInWithEmailAndPassword(email, password).then(function(e){
			console.log(e);
			$("legend").html("You successfully logged in!");
			$.session.set("loggedIn", true);
			window.location.assign("/dashboard");
		}, function(error) {
			console.log("Could not sign in with email and password");
			console.log(error.code);
			console.log(error.message);
		});
	};

	myApp.signOut = function() {
		auth.signOut().then(function(e) {
			console.log("User successfully signed out");
			$.session.remove("loggedIn");
			window.location.replace("/");
		}), function(error) {
			console.log("An error occured. Could not sign out");
		}
	};

	myApp.register = function(email, password) {
		auth.createUserWithEmailAndPassword(email, password).then(function(e) {
			$("legend").html("You successfully registered your new user!");
			$.session.set("loggedIn", true);
		}, function(error) {
			$("legend").html("Could not create user");
			console.log("Could not create user with email and password");
			console.log(error.code);
			console.log(error.message);
			myApp.resetForm();
		});
	};

	myApp.saveTokenCookie = function() {
		auth.currentUser.getToken(true).then(function(idToken) {
			Cookies.set('token', idToken, {
				domain: window.location.hostname,
				expire: 1 / 24,
				path: "/"
			});
		});
	};

	myApp.removeTokenCookie = function() {
		console.log("Fjerner cookie med token");
		Cookies.remove('token', {
			domain: window.location.hostname,
			path: "/"
		});
	};

	myApp.isValidEmail = function(email) {
		var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
		return pattern.test(email);
	};

	myApp.resetForm = function() {
		$("form")[0].reset();
	}


	$("#loginButton").on('click', function(e) {
		$("legend").html("");
		e.preventDefault();
		var email = $("#email").val();
		var password = $("#password").val();
		var statusMessages = [];
		
		if(email.length == 0 || !myApp.isValidEmail(email)) {
			statusMessages.push("Please provide a valid email address");
		}

		if(password.length == 0) {
			statusMessages.push("Please provide a password");
		}

		if(statusMessages.length == 0) {
			myApp.login(email, password);	
		} else {
			var $legend = $("legend");
			$legend.append("<ul></ul>");
			$.each(statusMessages, function(index, element){
				$legend.find("ul").append("<li class=\"bg-danger\">" + element + "</li>");
			})
		}
		
	});

	$("#registerButton").on('click', function(e) {
		$("legend").html("");
		e.preventDefault();
		var email = $("#email").val();
		var password = $("#password").val();
		var confirmPassword = $("#confirmPassword").val();
		var statusMessages = [];

		if(email.length == 0 || !myApp.isValidEmail(email)) {
			statusMessages.push("Please provide a valid email address");
		}

		if(password.length == 0) {
			statusMessages.push("Please provide a password");
		}

		if(confirmPassword.length == 0) {
			statusMessages.push("Please confirm your password");
		}

		if(password !== confirmPassword) {
			statusMessages.push("Your chosen password and confirmation password does not match");
		}

		if(statusMessages.length == 0) {
			myApp.register(email, password);
		} else {
			var $legend = $("legend");
			$legend.append("<ul></ul>");
			$.each(statusMessages, function(index, element){
				$legend.find("ul").append("<li class=\"bg-danger\">" + element + "</li>");
			});
		}		
	});

	$("#logOutButton").on('click', function(e) {
		myApp.signOut();
		myApp.removeTokenCookie();
	});

	auth.onAuthStateChanged(function(firebaseUser) {
		if(firebaseUser) {
			myApp.saveTokenCookie();
			console.log("User logged in");		
		} else {
			console.log("Ingen logget inn");
		}
	});

});



