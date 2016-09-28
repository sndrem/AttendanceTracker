

$(function() {
	var myApp = {};

    

	myApp.login = function(email, password) {
		// TODO Post request to server
        // Server should log in
        $.post('/login',
         {
            email: email,
            password: password
        }, function(data, textStatus, xhr) {
            /*optional stuff to do after success */
            console.log(data);
            console.log(textStatus);
            console.log(xhr);
            if(textStatus === 'success') {
                document.location.href = "/dashboard";
            }
        });
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
            console.log(data.message);
            $("#statusMessage").html(data.message);
            myApp.resetForm();
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
		
		if(isEmpty(email) || !myApp.isValidEmail(email)) {
			statusMessages.push("Please provide a valid email address");
		}

		if(isEmpty(password)) {
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
                    console.log(data);
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
            var seminarKey = $(this).data('seminarkey');
            console.log(seminarKey);
            $.ajax({
                url: '/signUpForSeminar/' + seminarKey,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    seminarGroup: seminarKey
                },
                success: function(data) {
                    alert(data);
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
        for(var i = 0; i < data.length; i++) {
            var course = data[i];
            $table.append("<tr>" +
                    "<td>" + course.courseID + "</td>" +
                    "<td>" + course.name + "</td>" +
                    "<td><a data-seminarkey=\"" + course.semGrID + "\" class=\"registerForSeminarBtn\" href=\"#\">Sign Up</a></td>" +
                    "</tr>");   
        }
    }


});



