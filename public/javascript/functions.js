$(function() {
    var myApp = {};
    const ADMIN_TYPES = {
        master: 'master',
        assistent: 'assistent'
    }



    myApp.login = function(email, password) {
        // TODO Post request to server
        // Server should log in
        $.ajax({
            url: '/login',
            type: 'POST',
            dataType: 'JSON',
            data: {
                email: email,
                password: password
            },
            success: function(data) {
                document.location.href = data.redirect_url;
            }
        })
        .done(function() {
            console.log("success");
        })
        .fail(function(data) {
            console.log("error");
            console.log(data);
            $("legend").html("<span class='bg-danger'>" + data.responseJSON + "</span>");
        })
        .always(function() {
            console.log("complete");
        });
    };


    myApp.register = function(firstName, lastName, studentID, email, password, confirmPassword) {
        // TODO Post request to server for registration
        $.ajax({
            url: '/register',
            type: 'POST',
            dataType: 'JSON',
            data: {
                firstName: firstName,
                lastName: lastName,
                studentID: studentID,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            success: function(data) {
                console.log(data);
                document.location.href = "/login";
            }
        })
        .done(function() {
            console.log("success");
        })
        .fail(function() {
            $("#statusMessage").html("<p class='bg-warning'>There is already a user with that username or mail address</p>")
        })
        .always(function() {
            console.log("complete");
        });f
    };

    myApp.isValidEmail = function(email) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(email);
    };

    myApp.resetForm = function() {
        $("form")[0].reset();
    };

    myApp.addUserAsAssistant = function(userObject) {
        if (userObject) {
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
    };

    myApp.addAssistantToCourse = function(userID, courseID) {
        $.ajax({
            url: '/admin/addAssistantToCourse',
            type: 'POST',
            dataType: 'JSON',
            data: {
                studentAssistant: userID,
                courseSelection: courseID
            },
            success: function(data) {
                $("#addAssistantStatus").html(userID + " is now asssigned as an assistant for " + courseID);
            }
        })
        .done(function() {
            console.log("success");
        })
        .fail(function() {
            console.log("error");
            $("#addAssistantStatus").html(userID + " is already assigned as an assistant for " + courseID);
        })
        .always(function() {
            console.log("complete");
        });
    };

    myApp.fetchSeminarGroupsForAssistant = function(userID) {
        $.ajax({
            url: '/common/fetchSeminarGroupsForAssistant',
            type: 'POST',
            dataType: 'JSON',
            data: {
                userID: userID
            },
            success: function(data) {
                populateTable(data);
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
    };

    myApp.removeAssistantFromCourse = function(userID, courseID) {
        $.ajax({
            url: '/admin/removeAssistantFromCourse',
            type: 'POST',
            dataType: 'JSON',
            data: {
                userID: userID,
                courseID: courseID
            },
            success: function(data) {
                console.log(data);
                // location.reload();
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
            $("#fetchCoursesForAssistant").trigger('click');
        });
    };

    function populateTable(data) {
        var $table = $("table");
        var $tbody = $("table tbody");
        $tbody.html("");
        data.forEach(function(value, index) {
            $tbody.append("<tr><td>" + value.courseID + "</td><td>" + value.name + "</td><td><a id=\"removeAssistantFromCourse\" data-courseid = \"" + value.courseID + "\" href=\"#\">Remove assistant from course</a></td>");
        });
        $table.removeClass('hide');
        addEventListenerForRemoveAnchor();
    }

    function addEventListenerForRemoveAnchor() {
        $("table #removeAssistantFromCourse").on('click', function(event) {
            event.preventDefault();
            var userID = $("#studentAssistant").val();
            var courseID = $(this).data('courseid');
            myApp.removeAssistantFromCourse(userID, courseID);
        });
    }



    $("#loginButton").on('click', function(e) {
        $("legend").html("");
        e.preventDefault();
        var email = $("#email").val();
        var password = $("#password").val();
        var statusMessages = [];

        if (isEmpty(email) || !myApp.isValidEmail(email)) {
            statusMessages.push("Please provide a valid email address");
        }

        if (isEmpty(password)) {
            statusMessages.push("Please provide a password");
        }

        if (statusMessages.length == 0) {
            myApp.login(email, password);
        } else {
            var $legend = $("legend");
            $legend.append("<ul></ul>");
            $.each(statusMessages, function(index, element) {
                $legend.find("ul").append("<li class=\"bg-danger\">" + element + "</li>");
            })
        }
    });

    $("#registerButton").on('click', function(e) {
        $("legend").html("");
        e.preventDefault();
        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var studentID = $("#studentRegID").val();
        var email = $("#email").val();
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();
        var statusMessages = [];


        if (isEmpty(firstName)) {
            statusMessages.push("Please provide a first name");
        }

        if (isEmpty(lastName)) {
            statusMessages.push("Please provide a last name");
        }

        if (isEmpty(studentID)) {
            statusMessages.push("Please provide a student id");
        }

        if (isEmpty(email) || !myApp.isValidEmail(email)) {
            statusMessages.push("Please provide a valid email address");
        }

        if (isEmpty(password)) {
            statusMessages.push("Please provide a password");
        }

        if (isEmpty(confirmPassword)) {
            statusMessages.push("Please confirm your password");
        }

        if (password !== confirmPassword) {
            statusMessages.push("Your chosen password and confirmation password does not match");
        }

        if (isEmpty(statusMessages)) {
            myApp.register(firstName, lastName, studentID, email, password, confirmPassword);
        } else {
            var $legend = $("legend");
            $legend.append("<ul></ul>");
            $.each(statusMessages, function(index, element) {
                $legend.find("ul").append("<li class=\"bg-danger\">" + element + "</li>");
            });
        }
    });

    $("#registerAttendanceBtn").on('click', function(event) {
        event.preventDefault();
        // Get all students 
        var students = [];

        // Get status of seminar, if cancelled or not
        // By adding + to the start of the expression, we automatically convert true to 1 and false to 0
        const cancelled = +$("#cancelledCheckBox").prop('checked');

        $(".student-attendance").each(function(index, element) {
            // if the seminar is cancelled, everyone gets registered as attended
            if(cancelled === 1) {
                students.push({
                    StudID: $(element).val(),
                    attended: true
                });
            } else {
                students.push({
                    StudID: $(element).val(),
                    attended: $(element).prop('checked')
                });
            }
        });

        // Get place of seminar and check that it is not empty
        const place = $("#placeSelection").val();
        if(place.length === 0) {
            alert("Please choose a place for the seminar");
            return;
        }

        // Get seminar group ID from hidden html input field
        const semGrID = $("#semGrID").val();

        // Post to server
        $.ajax({
            url: '/assistant/takeAttendance/' + semGrID,
            type: 'POST',
            dataType: 'JSON',
            data: {
                students: JSON.stringify(students),
                semGrID: semGrID,
                place: place,
                status: cancelled
            },
            success: function(data) {
                console.log(data);
            }
        })
        .done(function() {
            console.log("success");
            $("#status").html("Seminar opprettet.");
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
    });

    $("#addAssistantToCourseBtn").on('click', function(event) {
        event.preventDefault();
        var userID = $("#studentAssistant").val();
        var courseID = $("#courseSelection").val();
        var statusMessages = [];

        if(isEmpty(userID)) {
            statusMessages.push("User cannot be empty");
        }

        if(isEmpty(courseID)) {
            statusMessages.push("Course cannot be empty");
        }

        if(statusMessages.length == 0) {
            myApp.addAssistantToCourse(userID, courseID);
        } else {
            var $legend = $("#addAssistantStatus");
            statusMessage.forEach(function(item, index) {
                $legend.append("<span class='bg-danger'>" + item + "</span><br>");
            });
        }
    });

    $("#fetchCoursesForAssistant").on('click', function(event) {
        event.preventDefault();
        var userID = $("#studentAssistant").val();
        if(userID.length > 0) {
            myApp.fetchSeminarGroupsForAssistant(userID);
        } else {
            $("legend").html("Du må velge en bruker for å fortsette");
        }
    });

    $("#studentAssistant").on('change', function(e) {
        e.preventDefault();
        var $table = $("table");
        $table.find('tbody').html("");
        $table.addClass('hide');
    });

    function isEmpty(value) {
        return value.length == 0;
    }


    $("#searchForGroup").on('click', function(e) {
        e.preventDefault();
        var $seminarTable = $("#seminarTable");
        if ($seminarTable.hasClass('hide')) {
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
        if ($courseTable.hasClass("hide")) {
            $courseTable.removeClass("hide");
            $.ajax({
                    url: "/student/listCourses",
                    type: "GET",
                    dataType: "json",
                    data: {},
                    async: true,
                    success: function(data) {
                        showCourseList(data);
                        fetchSeminarGroups();
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

        if (courseID === '') {
            statusMessages.push("Course ID cannot be empty");
        }

        if (groupName === '') {
            statusMessages.push("Group name cannot be empty");
        }

        if (statusMessages.length > 0) {
            var $status = $("#status ul");
            $status.html("");
            for (var i = 0; i < statusMessages.length; i++) {
                $status.append("<li class=\"bg-danger\">" + statusMessages[i] + "</li>");
            }
        } else {
            $.ajax({
                    url: '/common/createNewSeminarGroup',
                    type: "POST",
                    dataType: "json",
                    data: {
                        courseID: courseID,
                        groupName: groupName},
                    async: true,
                    success: function(data) {
                        var $status = $("#status");
                        $status.html("");
                        $status.append(data);
                        if(data.redirect_url) {
                            $status.html("<p>There are no courses with " + courseID + " registered. If you are an admin you can create a new course. If you are a student assistant, then you need to contact an administrator.</p> "
                                            + "<a href=\"" + data.redirect_url + "\" class=\"btn btn-primary\">Create new course</a>");

                        } else {
                            setTimeout(function(){
                            location.reload();
                         }, 3000);
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
                })
        }
    });

    // Function for making a student student assistant
    $("#createSeminarAssBtn").on('click', function(e) {
        e.preventDefault();
        const studentID = $("#studentID").val();
        var statusMessages = [];

        if (isEmpty(studentID)) {
            statusMessages.push("Student ID cannot be empty");
        }

        // If the courseID is empty and the student id has been entered correctly
        if (statusMessages.length == 0) {
            myApp.addUserAsAssistant({
                studentID: studentID,
                adminType: ADMIN_TYPES.assistent
            });
        } else {
            $("#status").html(statusMessages[0]);
        }
    });


    $("#courseSelection").on('change', function(e) {
        e.preventDefault();
        const $select = $("#courseSelection");
        const courseID = $select.val();
        $("section.seminars").html("");
        $.ajax({
                url: '/assistant/getSeminarGroupsFromCourse',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    courseID: courseID
                },
                async: true,
                success: function(data) {
                    if (data.length > 0) {
                        showSeminarGroupCards(data);
                    } else {
                        $("section.seminars").html("<p>There are no seminar groups created for " + $("#courseSelection option:selected").text() + " </p>");
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
    });

    // Trigger change at page load so the chosen element is fetching data at page load
    $("#courseSelection").trigger('change');

    // Function to show thumbnail cards for some data
    function showSeminarGroupCards(data) {
        if (data) {
            var $seminar = $("section.seminars");
            $seminar.html("");
            $.each(data, function(index, val) {
                /* iterate through array or object */
                const html = "<div class=\"col-xs-12 col-sm-12 col-md-6 col-lg-4\">" +
                    "<div class=\"thumbnail\" >" +
                    "<a href=\"/assistant/takeAttendance/" + val.semGrID + "\"><h4>" + val.name + "</h4></a>" +
                    "</div>" +
                    "</div>";
                $seminar.append(html);
            });
        }
    }

    // This function call appends the value written in the courseID field
    // to the groupName-field used when creating a new seminargroup
    $("#courseID").keyup(function(e) {
        const value = $(this).val();
        $("#groupName").val(value);
    });

    // This function call is called when an admin enters the student id when 
    // registering a student assistant
    $("#studentID").on("keyup change", function(e) {
        /* Act on the event */
        var $this = $(this);
        colorMarkElement($this, '#fff');
        // Vi sjekker ikke brukere dersom de har en studentid under 5 karakterer lang.
        if ($this.val().length >= 1) {
            var studentID = $this.val();
            // TODO Call database to check if student assistant exists
            $.ajax({
                    url: '/common/checkExistingUser',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        studentID: studentID
                    },
                    success: function(data) {
                        console.log(data);
                        if (data) {
                            if(data.length > 1) {
                                // showWarningMessage
                                populateDropdown(data);
                            } else {
                                colorMarkElement($this, '#91C368');
                                unhideformFields();
                                populateRegistrationFields(data);
                                $(".multipleNameSelect").addClass('hide');
                                $("#createSeminarAssBtn").prop('disabled', false);
                            }
                        } else {
                            hideFormFields();
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
        } else {
            hideFormFields();
            $(".multipleNameSelect").addClass('hide');
        }
    });

    $("#assistantUser").on('keyup change', function(e) {
        e.preventDefault();
        var $this = $(this);
    });

    $("#resetForm").on('click', function(event) {
        event.preventDefault();
        myApp.resetForm();
        hideFormFields();
        colorMarkElement($("#studentID"), '#FFF');
    })

    function populateDropdown(data) {
        console.log("Should populate dropdown");
        var $selectDiv = $(".multipleNameSelect");
        var $select = $("#multipleNameSelect");
        $selectDiv.removeClass('hide');
        $select.html("");
        for(var i = 0; i < data.length; i++) {
            $select.append("<option value=\"" + data[i].StudID + "\">" + data[i].fName + " " + data[i].lName + "</option>");
        }
    }

    $("#multipleNameSelect").on('blur change', function(event) {
        event.preventDefault();
        var value = $(this).val();
        var $studentID = $("#studentID");
        $studentID.val(value);
        $studentID.trigger('change');
    });

    //sort the table on text input for courses
    $("#inputCourse").keyup(function() {
        _this = this;

        $.each($("#courseTable tbody tr"), function() {
            if ($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
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

    function hideFormFields() {
        $("#firstName").parent().addClass('hide');
        $("#lastName").parent().addClass('hide');
        $("#email").parent().addClass('hide');
    }


    function populateRegistrationFields(data) {
        var $firstName = $("#firstName");
        var $lastName = $("#lastName");
        var $email = $("#email");
        var $studentID = $("#studentID");
        console.log(data.fName);
        $studentID.val(data.StudID);
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
        $(".registerForSeminarBtn").on('click', function(e) {
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
        var $table = $("#courseTable tbody");
        //$table.html("");
        console.log(data);
        for (var i = 0; i < data.length; i++) {

            var course = data[i];

            $("[data-courseid=" + course.courseID + "]").after("<tr class=semHead" + course.courseID + ">" +
             "<th></th><th></th>" + "<th>Seminar Group</th>" + "<th>Registrer</th></tr>" + 
             "<tr class=semInfo>" +
                "<td>" + "</td>" + "<td></td>" +
                "<td>" + course.name + "</td>" +
                "<td><a data-courseid=\"" + course.courseID + "\" data-seminarkey=\"" + course.semGrID 
                + "\" class=\"registerForSeminarBtn\" href=\"#\">Sign Up</a></td>" +
                "</tr>").one();
            $(".semHead" + course.courseID + ">:gt(3)").remove();
            $(".semInfo tr").remove();
        }
    }

    
    function showCourseList(data) {
        var $table = $("#courseTable tbody");
        $table.html("");
        for (var i = 0; i < data.length; i++) {
            var course = data[i];
            $table.append("<tr data-courseid=\"" + course.courseID + "\" class='fetchSeminarGroups'>" +
                "<td class='courseId'>" + course.courseID + "</td>" +
                "<td >" + course.name + "</td>" +
                "<td>" + course.semester + "</td>" +
                "<td>" + course.attendance + " %" + "</td>" +
                "</tr>");
        }

    }

    function fetchSeminarGroups() {
        $('.fetchSeminarGroups').one("click", function(e) {
            e.preventDefault();
            console.log("click");
            var courseID = $(this).data("courseid");
            console.log(courseID);
            $.ajax({
                    url: '/student/listSeminars',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        courseID: courseID
                    },
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
        });
    }

    //calculate percentage attendace from html elements
    $("#attendancePercentage").each(function() {
    	var attended = 0;
    	var total = $("#totalSeminars").text();
    	total = parseInt(total.substring(total.length -2, total.length));

		$(".table tbody tr").each(function(){
    		$(this).find("td.success").each(function(){
        		attended++;
    		});
    	});

		$("#attendancePercentage").append(" "+(attended/total*100)+"%");
    });

    function addClickEventForCourseRegistration() {
         $(".createCourseBtn").on('click', function(e) {
            e.preventDefault();
            var courseID = $(this).data('courseID');

        });
    };

    $("#createCourseBtn").on("click", function(e){
        e.preventDefault();
        var $status = $("#status");

        var courseID = $("#courseID").val();
        var courseName = $("#courseName").val();
        var semester = $("#semester").val();
        var attendancePercentage = $("#attendancePercentage").val();
        var plannedSeminars = $("#plannedSeminars").val();


        $.ajax({
            url: '/admin/createCourse',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    courseID : courseID,
                    courseName : courseName,
                    semester : semester,
                    attendancePercentage : attendancePercentage,
                    plannedSeminars : plannedSeminars
                },
                success: function(data) {
                    $status.html(data);
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
                //location.reload();
            });
        
    });
});