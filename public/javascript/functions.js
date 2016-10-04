

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
            console.log(data.redirect_url);
            if(textStatus === 'success') {
                document.location.href = data.redirect_url;
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
	};

    myApp.addUserAsAssistant = function(userObject) {
        if(userObject) {
            $.ajax({
                url: '/admin/addUserAsAssistant',
                type: 'POST',
                dataType: 'JSON',
                data: userObject,
                async: true,
                success: function(data) {
                    $("#status").html(data);
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
            
        }
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


    $("#searchForGroup").on('click', function(e) {
        e.preventDefault();
        var $seminarTable = $("#seminarTable");
        if($seminarTable.hasClass('hide')) {
            $seminarTable.removeClass('hide');
            $.ajax({
                url: '/student/listSeminars',
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

    $("#inputCourse").one("click", function(e) {
    	e.preventDefault();
    	var $courseTable = $("#courseTable");
    	if($courseTable.hasClass("hide")) {
    		$courseTable.removeClass("hide");
    		$.ajax({
    			url: "/student/listCourses",
    			type: "GET",
    			dataType: "json",
    			data: {},
    			async: true,
    			success: function(data) {
    				showCourseList(data);
                    console.log(data);
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
    		})
    	} else {
    		$courseTable.addClass("hide");
    	}
    });

    $("#createSeminarBtn").on('click', function(e) {
        e.preventDefault();
        var courseID = $("#courseID").val();
        var groupName = $("#groupName").val();
        var statusMessages = [];

        if(courseID === '') {
            statusMessages.push("Course ID cannot be empty");
        }

        if(groupName === '') {
            statusMessages.push("Group name cannot be empty");
        }

        if(statusMessages.length > 0) {
            var $status = $("#status ul");
            $status.html("");
            for(var i = 0; i < statusMessages.length; i++) {
                $status.append("<li class=\"bg-danger\">" + statusMessages[i] + "</li>");
            }
        } else {
            $.post('/admin/createNewSeminarGroup',
            {
                courseID: courseID,
                groupName: groupName
            }, function(data, textStatus, xhr) {
                if(textStatus === 'success') {
                    $("#status").html(groupName + " created");
                }
            });
        }
    });
    
    // Function for making a student student assistant
    $("#createSeminarAssBtn").on('click', function(e){
        e.preventDefault();
        const studentID = $("#studentID").val();
        const courseID = $("#courseID").val();
        var statusMessages = [];

        if(isEmpty(studentID)) {
            statusMessages.push("Student ID cannot be empty");
        }

        // If the courseID is empty and the student id has been entered correctly
        if(isEmpty(courseID) && statusMessages.length == 0) {
            myApp.addUserAsAssistant({
                studentID: studentID,
                adminType: 'assistent'
            });
        } else if(!isEmpty(courseID) && statusMessages.length == 0) {
            // If the courseID has been entered and the student id has been entered
            myApp.addUserAsAssistant({
                studentID: studentID,
                courseID: courseID,
                adminType: 'assistent'
            });
        } else {
            $("#status").html(statusMessages[0]);
        }

    });

    // This function call appends the value written in the courseID field
    // to the groupName-field used when creating a new seminargroup
    $("#courseID").keyup(function(e){
        const value = $(this).val();
        $("#groupName").val(value);
    });

    // This function call is called when an admin enters the student id when 
    // registering a student assistant
    $("#studentID").keyup(function(e) {
        /* Act on the event */
        var $this = $(this);
        colorMarkElement($this, '#fff');
        // Vi sjekker ikke brukere dersom de har en studentid under 5 karakterer lang.
        if($this.val().length > 5) {
            console.log($(this).val());
            var studentID = $this.val();
            // TODO Call database to check if student assistant exists
            $.ajax({
                url: '/admin/checkExistingUser',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    studentID: studentID
                },
                success: function(data) {
                    console.log(data);
                    if(data) {
                        colorMarkElement($this, '#91C368');
                        unhideformFields();
                        populateRegistrationFields(data);
                    }
                    else {
                        colorMarkElement($this, '#FC4F4F');
                    }
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
        }
    });

    //sort the table on text input for courses
    $("#inputCourse").keyup(function() {
    	_this = this;

    	$.each($("#courseTable tbody tr"), function() {
    		if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
    			$(this).hide();
    		else
    			$(this).show();
    	});
    });

    // Method to populate the registration fields for the creation of a new student assistant
    function unhideformFields() {
        $("form div.hide").each(function(index, val) {
             /* iterate through array or object */
             $(val).removeClass('hide');
        });
    }

    function populateRegistrationFields(data) {
        var $firstName = $("#firstName");
        var $lastName = $("#lastName");
        var $email = $("#email");
        console.log(data.fName);
        $firstName.val(data.fName).prop('disabled', true);
        $lastName.val(data.lName).prop('disabled', true);
        $email.val(data.eMail).prop('disabled', true);
    }

    // Function to mark a element as green
    function colorMarkElement(element, color) {
        element.css('background-color', color);
        element.css('color', '#2d2d2d');
    }


    function addClickEventForSeminarRegistration() {
        $(".registerForSeminarBtn").on('click', function(e){
            e.preventDefault();
            var seminarKey = $(this).data('seminarkey');
            var courseID = $(this).data('courseid');
            $.ajax({
                url: '/student/signUpForSeminar/' + seminarKey,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    seminarGroup: seminarKey,
                    courseID: courseID
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
                location.reload();
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
                    "<td><a data-courseid=\"" + course.courseID + "\" data-seminarkey=\"" + course.semGrID + "\" class=\"registerForSeminarBtn\" href=\"#\">Sign Up</a></td>" +
                    "</tr>");
        }
    }

    function showCourseList(data) {
    	var $table = $("#courseTable tbody");
    	$table.html("");
    	for(var i = 0; i < data.length; i++) {
    		var course = data[i];
    		$table.append("<tr>" +
                        + "<td>" + "</td>"
                        + "<td class='courseId'>" + course.courseID + "</td>"
                        + "<td>" + course.name + "</td>"
                        + "<td>" + course.semester + "</td>"
                        + "<td>" + course.attendance + " %" + "</td>"
                        + "</tr>");
    	}
    }


});



