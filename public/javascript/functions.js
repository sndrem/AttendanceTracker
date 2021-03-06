$(function() {
    var myApp = {};
    const ADMIN_TYPES = {
        master: 'master',
        assistent: 'assistent'
    }

    // Initialize Froala wysiwyg editor
    $('#froala').froalaEditor({
        toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'fontSize', 'fontFamily', 'emoticons', '|', 'paragraphFormat', 'align', 'undo', 'redo', 'html'],
        fontSizeSelection: true,
        heightMin: 100,
        heightMax: 200,
        // Colors list.
        colorsBackground: [
            '#15E67F', '#E3DE8C', '#D8A076', '#D83762', '#76B6D8', 'REMOVE',
            '#1C7A90', '#249CB8', '#4ABED9', '#FBD75B', '#FBE571', '#FFFFFF'
        ],
        colorsDefaultTab: 'text',
        colorsStep: 6,
        colorsText: [
            '#15E67F', '#E3DE8C', '#D8A076', '#D83762', '#76B6D8', 'REMOVE',
            '#1C7A90', '#249CB8', '#4ABED9', '#FBD75B', '#FBE571', '#FFFFFF'
        ],
        emoticonsStep: 4
    });

    var defaultBeenAwayHtml = "<p>Hey {name}</p><p>You have been away {beenAway} times, and if you want to be " + "able to take the exam, then you have to start showing up.</p>";
    $('#froala').froalaEditor('html.set', defaultBeenAwayHtml);


    /**
        ###########  My app ###########
    */
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

            })
            .fail(function(data) {


                $("legend").html("<span class='bg-danger'>Could not log in</span>");
            })
            .always(function() {

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
                    document.location.href = "/login";
                }
            })
            .done(function() {

            })
            .fail(function() {
                $("#status").html(
                    "<p class='bg-warning'>There is already a user with that username or mail address</p>")
            })
            .always(function() {

            });
        f
    };

    myApp.updateProfile = function(user) {
        // TODO Implement update functionality
        if (user) {
            $.ajax({
                    url: '/updateProfile',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        user: JSON.stringify(user)
                    },
                    success: function(data) {
                        $(".panel").addClass("panel-success");
                        $(".glyphicon-ok").removeClass('hide');
                    }
                })
                .done(function() {

                })
                .fail(function() {

                })
                .always(function() {

                });
        }
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

                })
                .fail(function() {

                })
                .always(function() {

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

            })
            .fail(function() {

                $("#addAssistantStatus").html(userID + " is already assigned as an assistant for " + courseID);
            })
            .always(function() {

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

            })
            .fail(function() {

            })
            .always(function() {

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
                success: function(data) {}
            })
            .done(function() {

            })
            .fail(function() {

            })
            .always(function() {

                $("#fetchCoursesForAssistant").trigger('click');
            });
    };

    // Removes a person as an assistant
    myApp.removeAssistant = function(studentID) {
        $.ajax({
                url: '/admin/removeAssistant',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    StudID: studentID
                },
            })
            .done(function() {
                $("legend").html("<p class='bg-warning'>" + studentID + " was successfully removed as an assistant</p>");
                setTimeout(function() {
                    document.location.reload();
                }, 2500)
            })
            .fail(function() {

            })
            .always(function() {

            });
    };

    // ########### Functions ###########
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

    function getStudentAttendanceList() {
        // Get all students
        var students = [];
        var cancelled = isSeminarCancelled();
        $(".student-attendance").each(function(index, element) {
            // if the seminar is cancelled, everyone gets registered as attended
            if (cancelled === 1) {
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
        return students;
    }

    function isSeminarCancelled() {
        return +$("#cancelledCheckBox").prop('checked');
    }

    function getPlaceOfSeminar() {
        return $("#placeSelection").val();;
    }

    function getSemGrID() {
        return $("#semGrID").val();
    }

    function resetAttendanceBtnClickListener(semGrID) {
        $("#resetAttendanceBtn").on('click', function(event) {
            event.preventDefault();
            document.location.href = "/assistant/takeAttendance/" + semGrID;
        });
    }

    function isEmpty(value) {
        return value.length == 0;
    }

    // Returns the number of checked checkboxes
    function getNumOfCheckedCheckboxes() {
        return $("table tr td:nth-child(5) input:checked").length;
    }

    function populateDropdown(data) {

        var $selectDiv = $(".multipleNameSelect");
        var $select = $("#multipleNameSelect");
        $selectDiv.removeClass('hide');
        $select.html("");
        for (var i = 0; i < data.length; i++) {
            $select.append("<option value=\"" + data[i].StudID + "\">" + data[i].fName + " " + data[i].lName + "</option>");
        }
    }

    // Function to show thumbnail cards for some data
    function showSeminarGroupCards(data) {
        if (data) {
            var $seminar = $("section.seminars");
            $seminar.html("");
            $.each(data, function(index, val) {
                /* iterate through array or object */
                const html = "<div class=\"col-xs-12 col-sm-12 col-md-6 col-lg-4\">" +
                    "<div class=\"thumbnail\" >" +
                    "<span class='badge'>" + val.numOfStudents + "</span>" +
                    "<a href=\"/assistant/takeAttendance/" + val.semGrID + "\"><h4>" + val.name + "</h4></a>" +
                    "</div>" +
                    "</div>";
                $seminar.append(html);
            });
        }
    }

    function showAttendanceData(studentName, data) {
        $(".well").removeClass('hide');
        $("#studentName").text("Status for: " + studentName);
        $(".well table tbody").html(data.map(function(index, elem) {
            return "<tr><td>" + moment(index.date).format('MMMM Do YYYY, h:mm:ss a') + "</td><td>" + index.place + "</td>" + formatAttendanceData(index.attended) + "</tr>";
        }))
    }

    function formatAttendanceData(attended) {
        return attended === 1 ? "<td class='success'>Yes</td>" : "<td class='warning'>No</td>";
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

                })
                .fail(function(data) {

                })
                .always(function() {

                    location.reload();
                });
        });
    }

    function showSeminarList(data) {
        var $table = $("#courseTable tbody");
        //$table.html("");

        for (var i = 0; i < data.length; i++) {

            var course = data[i];

            $("[data-courseid=" + course.courseID + "]").after("<tr class=semHead" + course.courseID + ">" +
                "<th></th><th></th>" + "<th>Seminar Group</th>" + "<th>Registrer</th></tr>" +
                "<tr class=semInfo>" +
                "<td>" + "</td>" + "<td></td>" +
                "<td>" + course.name + "</td>" +
                "<td><a data-courseid=\"" + course.courseID + "\" data-seminarkey=\"" + course.semGrID + "\" class=\"registerForSeminarBtn\" href=\"#\">Sign Up</a></td>" +
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

            var courseID = $(this).data("courseid");

            $.ajax({
                    url: '/student/listSeminars',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        courseID: courseID
                    },
                    async: true,
                    success: function(data) {

                        showSeminarList(data);
                        addClickEventForSeminarRegistration();
                    }
                })
                .done(function() {

                })
                .fail(function() {

                })
                .always(function() {


                });
        });
    }

    function addClickEventForCourseRegistration() {
        $(".createCourseBtn").on('click', function(e) {
            e.preventDefault();
            var courseID = $(this).data('courseID');

        });
    };

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

        $studentID.val(data.StudID);
        $firstName.val(data.fName).prop('disabled', true);
        $lastName.val(data.lName).prop('disabled', true);
        $email.val(data.eMail).prop('disabled', true);
    }

    // Function to show thumbnail cards for some data
    function showSeminarGroupCards(data) {
        if (data) {
            var $seminar = $("section.seminars");
            $seminar.html("");
            $.each(data, function(index, val) {
                /* iterate through array or object */
                const html = "<div class=\"col-xs-12 col-sm-12 col-md-6 col-lg-4\">" +
                    "<div class=\"thumbnail\" >" +
                    "<span class='badge'>" + val.numOfStudents + "</span>" +
                    "<a href=\"/assistant/takeAttendance/" + val.semGrID + "\"><h4>" + val.name + "</h4></a>" +
                    "</div>" +
                    "</div>";
                $seminar.append(html);
            });
        }
    }

    // Returns the number of checked checkboxes
    function getNumOfCheckedCheckboxes() {
        return $("table tr td:nth-child(5) input:checked").length;
    }

    function populateDropdown(data) {
        var $selectDiv = $(".multipleNameSelect");
        var $select = $("#multipleNameSelect");
        $selectDiv.removeClass('hide');
        $select.html("");
        for (var i = 0; i < data.length; i++) {
            $select.append("<option value=\"" + data[i].StudID + "\">" + data[i].fName + " " + data[i].lName + "</option>");
        }
    }

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

                })
                .fail(function(data) {

                })
                .always(function() {

                    location.reload();
                });
        });
    }

    function showSeminarList(data) {
        var $table = $("#courseTable tbody");

        for (var i = 0; i < data.length; i++) {

            var course = data[i];

            $(
                "[data-courseid=" + course.courseID + "]").after(
                "<tr class=semHead" + course.courseID + ">" +
                "<th></th>" +
                "<th></th>" +
                "<th>Seminar Group</th>" +
                "<th>Registrer</th></tr>" +
                "<tr class=semInfo>" +
                "<td></td>" +
                "<td></td>" +
                "<td>" + course.name + "</td>" +
                "<td>" +
                "<a data-courseid=\"" + course.courseID + "\" data-seminarkey=\"" + course.semGrID +
                "\" class=\"registerForSeminarBtn\" href=\"#\">Sign Up</a>" +
                "</td>" +
                "</tr>"
            ).one();
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
            var courseID = $(this).data("courseid");
            $.ajax({
                    url: '/student/listSeminars',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        courseID: courseID
                    },
                    async: true,
                    success: function(data) {
                        showSeminarList(data);
                        addClickEventForSeminarRegistration();
                    }
                })
                .done(function() {

                })
                .fail(function() {

                })
                .always(function() {


                });
        });
    }

    function addClickEventForCourseRegistration() {
        $(".createCourseBtn").on('click', function(e) {
            e.preventDefault();
            var courseID = $(this).data('courseID');

        });
    };

    // ########## On-click event ##########

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

        if(password.length <= 4) {
            statusMessages.push("Please provide a password with 5 or more characters");
        }

        if (statusMessages.length == 0) {
            myApp.login(email, password);
        } else {
            var $legend = $("legend");
            $legend.append("<div></div>");
            $.each(statusMessages, function(index, element) {
                $legend.append("<p class='bg-danger'>" + element + "</p>");
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

        if(password.length <= 4) {
            statusMessages.push("Please provide a password with 5 or more characters");
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
            $legend.append("<div></div>");
            $.each(statusMessages, function(index, element) {
                $legend.append("<p class='bg-danger'>" + element + "</p>");
            });
        }
    });

    $("#updateProfileBtn").on('click', function(event) {
        event.preventDefault();
        $("legend").html("");
        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var email = $("#email").val();

        var statusMessages = [];

        if (isEmpty(firstName)) {
            statusMessages.push("First name cannot be empty");
        } else if ((Number.isInteger(firstName)) || (!isNaN(parseFloat(firstName)) && isFinite(firstName))) {
            statusMessages.push("First name cannot be a number");
        }

        if (isEmpty(lastName)) {
            statusMessages.push("Last name cannot be empty");
        } else if ((Number.isInteger(lastName)) || (!isNaN(parseFloat(lastName)) && isFinite(lastName))) {
            statusMessages.push("Last name cannot be a number");
        }

        if (isEmpty(email) || !myApp.isValidEmail(email)) {
            statusMessages.push("Please provide a valid email");
        }

        if (statusMessages.length > 0) {
            var $legend = $("legend");
            $legend.append("<div></div>");
            $.each(statusMessages, function(index, element) {
                $legend.append("<p class='bg-danger-profile'>" + element + "</p>");
            });
        } else {
            var user = {
                firstName: firstName,
                lastName: lastName,
                email: email
            }
            myApp.updateProfile(user);
        }

    });


    $("#registerAttendanceBtn").on('click', function(event) {
        event.preventDefault();
        var $updateBtn = $("#updateAttendanceBtn");
        // get students
        var students = getStudentAttendanceList();

        // Get status of seminar, if cancelled or not
        // By adding + to the start of the expression, we automatically convert true to 1 and false to 0
        const cancelled = isSeminarCancelled();

        // Get place of seminar and check that it is not empty
        const place = getPlaceOfSeminar();
        if (place.length === 0) {
            alert("Please choose a place for the seminar");
            return;
        }

        // Get seminar group ID from hidden html input field
        const semGrID = getSemGrID();

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
                    $("#previousSeminar option:nth-child(1)").after("<option value=\"/" + semGrID + "/" + data + "\">" + place + " - Today " + "</option>");
                }
            })
            .done(function(insertID) {
                $("#status").html("Seminar opprettet.");
                $updateBtn.removeClass('hide');
                $updateBtn.parent().append("<button class='btn btn-default' id='resetAttendanceBtn'>Reset form/New seminar</button>");
                $("#registerAttendanceBtn").addClass('hide');
                $("form").append("<input id='insertID' name='insertID' type='text' value='" + insertID + "' hidden>");
                resetAttendanceBtnClickListener(semGrID);
            })
            .fail(function() {

            })
            .always(function() {

            });
    });

    $("#updateAttendanceBtn").on('click', function(event) {
        event.preventDefault();
        var $this = $(this);
        var students = getStudentAttendanceList();
        const cancelled = isSeminarCancelled();
        const place = getPlaceOfSeminar();
        const semGrID = getSemGrID();
        const updateID = $("#insertID").val();

        $.ajax({
                url: '/assistant/updateAttendance/' + semGrID,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    students: JSON.stringify(students),
                    status: cancelled,
                    place: place,
                    semGrID: semGrID,
                    updateID: updateID
                },
                success: function(data) {

                }
            })
            .done(function() {

                $("#status").html("Seminar group is now updated");
                resetAttendanceBtnClickListener(semGrID);
            })
            .fail(function() {

            })
            .always(function() {

            });
    });

    $("#updateCourseBtn").on('click', function(event) {
        event.preventDefault();
        const courseID = $("#courseID").val();
        const courseName = $("#courseName").val();
        const semester = $("#semester").val();
        const attendance = $("#attendancePercentage").val();
        const plannedSeminars = $("#plannedSeminars").val();

        $.ajax({
                url: '/admin/updateCourse',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    courseID: courseID,
                    courseName: courseName,
                    semester: semester,
                    attendance: attendance,
                    plannedSeminars: plannedSeminars
                },
                success: function(data) {
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
            });
    });

    $("#deleteCourseBtn").on('click', function(event) {
        event.preventDefault();
        var choice = confirm("This action is irreversible. Are you sure you want to delete this course?");
        if (choice) {
            const courseID = $("#courseID").val();
            $.ajax({
                    url: '/admin/deleteCourse',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        courseID: courseID
                    },
                    success: function(data) {
                        document.location.href = data.redirect_url;
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
            return;
        }
    });

    $("#removeStudentAsAssistant").on('click', function(event) {
        event.preventDefault();
        var confirmation = confirm("Are you sure you want to remove the student as an assistant? This step cannot be undone, so use it with care");
        if (confirmation) {
            const studentID = $("#studentAssistant").val();
            myApp.removeAssistant(studentID);
        } else {
            return;
        }
    });


    $("#addAssistantToCourseBtn").on('click', function(event) {
        event.preventDefault();
        var userID = $("#studentAssistant").val();
        var courseID = $("#courseSelection").val();
        var statusMessages = [];

        if (isEmpty(userID)) {
            statusMessages.push("User cannot be empty");
        }

        if (isEmpty(courseID)) {
            statusMessages.push("Course cannot be empty");
        }

        if (statusMessages.length == 0) {
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
        if (userID.length > 0) {
            myApp.fetchSeminarGroupsForAssistant(userID);
        } else {
            $("legend").html("Du må velge en bruker for å fortsette");
        }
    });


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
                        showSeminarList(data);
                        addClickEventForSeminarRegistration();
                    }
                })
                .done(function() {

                })
                .fail(function() {

                })
                .always(function() {


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

                    }
                })
                .done(function() {

                })
                .fail(function() {

                })
                .always(function() {

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
            var $status = $("#status");
            $status.html("");
            for (var i = 0; i < statusMessages.length; i++) {
                $status.append("<p class='bg-danger'>" + statusMessages[i] + "</p>");
            }
        } else {
            $.ajax({
                    url: '/common/createNewSeminarGroup',
                    type: "POST",
                    dataType: "json",
                    data: {
                        courseID: courseID,
                        groupName: groupName
                    },
                    async: true,
                    success: function(data) {
                        var $status = $("#status");
                        $status.html("");
                        $status.append(data);
                        if (data.redirect_url) {
                            $status.html("<p>There are no courses with " + courseID + " registered. If you are an admin you can create a new course. If you are a student assistant, then you need to contact an administrator.</p> " + "<a href=\"" + data.redirect_url + "\" class=\"btn btn-primary\">Create new course</a>");

                        } else {
                            setTimeout(function() {
                                location.reload();
                            }, 3000);
                        }
                    }
                })
                .done(function() {

                })
                .fail(function() {

                })
                .always(function() {

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

    $("#resetForm").on('click', function(event) {
        event.preventDefault();
        myApp.resetForm();
        hideFormFields();
        colorMarkElement($("#studentID"), '#FFF');
    })

    // Functionality for getting more attendance info for a given student
    $(".studentAttendanceInfo").on('click', function(event) {
        event.preventDefault();

        const StudID = $(this).parent().data('student_id');
        const semGrID = $(this).parent().data('semgrid');
        const studentName = $(this)[0].innerHTML;
        $.ajax({
                url: '/assistant/studentAttendanceInfo',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    StudID: StudID,
                    semGrID: semGrID
                },
                success: function(data) {
                    showAttendanceData(studentName, data);
                }
            })
            .done(function() {

            })
            .fail(function() {

            })
            .always(function() {

            });
    });

    $("#clearStudentAttendanceInfo").on('click', function(event) {
        event.preventDefault();
        var $well = $(".well");
        $well.addClass('hide');
        $well.find("tbody").html("");
    });

    $(".studentMessage").on('click', function(event) {
        var $input = $(this).find('input');
        $input.prop("checked", !input.prop("checked"));
    });

    $("#sendMessagesBtn").on('click', function(event) {
        event.preventDefault();
        var confirmation = confirm("This will send out an email to all students you have checked off. Are you sure you want to send the email?");
        if (confirmation === false) {
            return;
        }

        var formattedMessage = $('#froala').froalaEditor('html.get');

        var students = [];
        var $checkboxes = $("table tr td:nth-child(5) input:checked");
        if ($checkboxes.length > 0) {
            $checkboxes.each(function(index, el) {
                var email = $(el).parent().parent().data("email")
                var beenAway = parseInt($(el).parent().parent().find("td:nth-child(3)")[0].innerHTML);
                var name = $(el).parent().parent().find("td:nth-child(1)")[0].innerHTML;
                students.push({
                    email: email,
                    beenAway: beenAway,
                    name: name
                });
            });
        } else {
            return;
        }
        $.ajax({
                url: '/assistant/sendMessages',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    students: JSON.stringify(students),
                    message: JSON.stringify(formattedMessage)
                },
                success: function(data) {

                    $(".sendMessage").append("<div class='alert alert-success'>Mail successfully sent</div>");
                    myApp.resetForm();
                    setTimeout(function() {
                        $(".alert").remove();
                    }, 5000);
                },
            })
            .done(function() {

            })
            .fail(function() {

                $(".sendMessage").append("<div class='alert alert-warning'>Mail could not be sent</div>");
                myApp.resetForm();
                setTimeout(function() {
                    $(".alert").remove();
                }, 5000);
            })
            .always(function() {

            });
    });




    // Method for checking all input boxes
    $("#checkAllAttendanceBtn").on('click', function(event) {
        event.preventDefault();
        $("form input[type='checkbox'].student-attendance").each(function(index, el) {
            $(el).prop('checked', true);
        });
    });

    $("#uncheckAllAttendanceBtn").on('click', function(event) {
        event.preventDefault();
        $("form input[type='checkbox'].student-attendance").each(function(index, el) {
            $(el).prop('checked', false);
        });
    });



    $("#createCourseBtn").on("click", function(e) {
        e.preventDefault();
        var $status = $("#status");

        var courseID = $("#courseID").val();
        var courseName = $("#courseName").val();
        var semester = $("#semester").val();
        var attendancePercentage = $("#attendancePercentage").val();
        var plannedSeminars = $("#plannedSeminars").val();
        var statusMessages = [];

        if (courseID === '') {
            statusMessages.push("Course id cannot be empty");
        }

        if (courseName === '') {
            statusMessages.push("Course name cannot be empty");
        }

        if (semester === '') {
            statusMessages.push("Semester cannot be empty");
        }

        if (statusMessages.length > 0) {
            //error melding her
            var $status = $("#status");
            $status.html("");
            for (var i = 0; i < statusMessages.length; i++) {
                $status.append("<p class=\"bg-danger\">" + statusMessages[i] + "</p>");
            }
        } else {
            $.ajax({
                    url: '/admin/createCourse',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        courseID: courseID,
                        courseName: courseName,
                        semester: semester,
                        attendancePercentage: attendancePercentage,
                        plannedSeminars: plannedSeminars
                    },
                    success: function(data) {
                        $status.html(data);
                        $("table tbody").append("<tr><td>" + courseID + "</td><td>" + courseName + "</td><td>" + semester + "</td><td>" + attendancePercentage + " %</td><td>" + plannedSeminars + "</td><td><a href=\"/admin/editCourse/" + courseID + "\"><i class='material-icons'>&#xE3C9;</i></td></tr>");
                    }
                })
                .done(function() {

                })
                .fail(function(data) {

                })
                .always(function() {

                });
        }
    });


    /**
        ########## On-change events ##########
    */

    $("#previousSeminar").on('change', function(event) {
        event.preventDefault();
        var prevSeminarUrlLocation = $(this).val();
        document.location.href = "/assistant/previousSeminars" + prevSeminarUrlLocation;
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

            })
            .fail(function() {

            })
            .always(function() {

            });
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
            $.ajax({
                    url: '/common/checkExistingUser',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        studentID: studentID
                    },
                    success: function(data) {
                        if (data) {
                            if (data.length > 1) {
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

                })
                .fail(function() {

                })
                .always(function() {

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



    $("#multipleNameSelect").on('blur change', function(event) {
        event.preventDefault();
        var value = $(this).val();
        var $studentID = $("#studentID");
        $studentID.val(value);
        $studentID.trigger('change');
    });

    // Makes the send message button active if at least one checkbox is checked
    $("table tr td:nth-child(5) input").on('change', function(event) {
        event.preventDefault();
        var numOfCheckedCheckboxes = getNumOfCheckedCheckboxes();
        if (numOfCheckedCheckboxes > 0) {
            $("#sendMessagesBtn").prop('disabled', false);
            $("#messageFormatting").removeClass('hide');
        } else {
            $("#sendMessagesBtn").prop('disabled', true);
            $("#messageFormatting").addClass('hide');
        }
    });

    $("#studentAssistant").on('change', function(e) {
        e.preventDefault();
        var $table = $("table");
        $table.find('tbody').html("");
        $table.addClass('hide');
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

            })
            .fail(function() {

            })
            .always(function() {

            });
    });

    // Makes the send message button active if at least one checkbox is checked
    $("table tr td:nth-child(5) input").on('change', function(event) {
        event.preventDefault();
        var numOfCheckedCheckboxes = getNumOfCheckedCheckboxes();
        if (numOfCheckedCheckboxes > 0) {
            $("#sendMessagesBtn").prop('disabled', false);
        } else {
            $("#sendMessagesBtn").prop('disabled', true);
        }
    });

    $("#multipleNameSelect").on('blur change', function(event) {
        event.preventDefault();
        var value = $(this).val();
        var $studentID = $("#studentID");
        $studentID.val(value);
        $studentID.trigger('change');
    });

    $("#studentIDSelection").on('change', function(event) {
        event.preventDefault;
        var student = $(this).val();
        var $studentID = $("#studentID");
        $studentID.val(student);
        $studentID.trigger('keyup');
    });

    /**
        ########## Triggers ##########
    */

    // Trigger change at page load so the chosen element is fetching data at page load
    $("#courseSelection").trigger('change');

    // Trigger change at page load so the chosen element is fetching data at page load
    $("#courseSelection").trigger('change');

    /**
        ########## KeyUp-events ##########
    */

    // This function call appends the value written in the courseID field
    // to the groupName-field used when creating a new seminargroup
    $("#courseID").keyup(function(e) {
        const value = $(this).val();
        $("#groupName").val(value);
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

                        if (data) {
                            if (data.length > 1) {
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

                })
                .fail(function() {

                })
                .always(function() {

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


});