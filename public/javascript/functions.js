

$(function() {
	var myApp = {};

    // TODO Verifisere token
    myApp.checkLoggedinUser = function() {
        if(myApp.userIsLoggedIn()) {
            myApp.showLoggedInNavigation();
        }
    };

    myApp.userIsLoggedIn = function() {
        var storedToken = Cookies.get('token');
        if(!storedToken) {
            return false;
        }
        return true;
    }

    myApp.showLoggedInNavigation = function() {
        console.log("Should show this awesome menu");
        var $navbar = $(".navbar-nav");
        var navigation = "<li>" +
                        "<a href=\"/dashboard\"><i class=\"material-icons\">&#xE853;</i>Dashboard</a>" +
                        "</li>" +
                        "<li>" +
                        "<a href=\"#\" id=\"logOutButton\"><i class=\"material-icons\">&#xE879;</i>Log Out</a>" +
                        "</li>";
        $navbar.html(navigation);
    };

	myApp.login = function(email, password) {
		// TODO Post request to server
        // Server should log in
	};

	myApp.signOut = function() {
		// TODO - Sign out trough server
	};


	myApp.register = function(firstName, lastName, studentID, email, password, confirmPassword) {
		// TODO Post request to server for registration
        $.post('/register', 
            {   
                firstName: firstName,
                lastName: lastName,
                studentID: studentID,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            function(data, textStatus, xhr) {
            /*optional stuff to do after success */
            console.log(data);
        });
	};

	myApp.saveTokenCookie = function() {
		// TODO save token cookie for keeping status of logged in
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

    myApp.checkLoggedinUser();
 
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
		var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var studentID = $("#studentID").val();
        var email = $("#email").val();
		var password = $("#password").val();
		var confirmPassword = $("#confirmPassword").val();
        console.log(password);
        console.log(confirmPassword);
        var statusMessages = [];


        if(isEmpty(firstName)) {
            statusMessages.push("Please provide a first name");
        }

        if(isEmpty(lastName)) {
            statusMessages.push("Please provide a last name");
        }

        if(isEmpty(studentID)) {
            statusMessages.push("Please provide a student id");
        }

		if(isEmpty(email) || !myApp.isValidEmail(email)) {
			statusMessages.push("Please provide a valid email address");
		}

		if(isEmpty(password)) {
			statusMessages.push("Please provide a password");
		}

		if(isEmpty(confirmPassword)) {
			statusMessages.push("Please confirm your password");
		}

		if(password !== confirmPassword) {
			statusMessages.push("Your chosen password and confirmation password does not match");
		}

		if(isEmpty(statusMessages)) {
			myApp.register(firstName, lastName, studentID, email, password, confirmPassword);
		} else {
			var $legend = $("legend");
			$legend.append("<ul></ul>");
			$.each(statusMessages, function(index, element){
				$legend.find("ul").append("<li class=\"bg-danger\">" + element + "</li>");
			});
		}
	});

    function isEmpty(value) {
        return value.length == 0;
    }

	$("#logOutButton").on('click', function(e) {
        e.preventDefault();
        myApp.signOut();
	});


    $("#addGroup").on('click', function(e) {
        e.preventDefault();
        var $seminarTable = $("#seminarTable");
        if($seminarTable.hasClass('hide')) {
            $seminarTable.removeClass('hide');
            $.ajax({
                url: '/listSeminars',
                type: 'GET',
                dataType: 'json',
                data: {},
                async: true,
                success: function(data) {
                    showSeminarList(data);
                    addClickEventForSeminarRegistration();
                }
            })
            .done(function() {
                console.log("success");
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
        } else {
            $seminarTable.addClass('hide');
        }
    });

    function addClickEventForSeminarRegistration() {
        $(".registerForSeminarBtn").on('click', function(e){
            e.preventDefault();
            var courseKey = $(this).data('coursekey');
            var seminarKey = $(this).data('seminarkey');
            $.ajax({
                url: '/signUpForSeminar/' + courseKey + "/" + seminarKey,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    course: courseKey,
                    seminar: seminarKey
                },
                success: function(data) {
                    alert(data.message);
                }
            })
            .done(function() {
                console.log("success");
            })
            .fail(function(data) {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
            
        });
    }

    function showSeminarList(data) {
        var $table = $("#seminarTable tbody");
        $table.html("");
        for(var subject in data) {
            for(var key in data[subject]) {
                var course = data[subject][key];
                console.log(course);
                $table.append("<tr>" +
                        "<td>" + course.name + "</td>" +
                        "<td>" + course.day + "</td>" +
                        "<td>" + course.address + "</td>" +
                        "<td>" + course.startTime + "</td>" +
                        "<td>" + course.endTime + "</td>" +
                        "<td>" + course.room + "</td>" +
                        "<td><a data-coursekey=\"" + subject + "\" data-seminarkey=\"" + key + "\" class=\"registerForSeminarBtn\" href=\"#\">Sign Up</a></td>" +
                        "</tr>");
            }  
        }
    }
});



