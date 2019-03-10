$(document).ready(function () {
    var valid = window.localStorage.getItem("EnMonte");

    if (!valid) {
        window.localStorage.clear();
    } else {
        var token = window.localStorage.getItem("token");

        if (token) {
            var payload = JSON.parse(window.atob(token.split('.')[1]));
            var currentTime = new Date();
    
            if (payload.exp > currentTime / 1000) {
                window.location.assign("/search.html")
            };
        };
    };

    $('.modal').modal({ endingTop: '42%' });
    $("#title").delay(1000).animate({ height: 350 }, 700);
    $("#sign").delay(1500).fadeIn(800);

    $("#signIn").on("click", function (event) {
        event.preventDefault();
        $("#title").animate({ height: 490 }, 700);
        $("#sign").fadeOut(800);
        $("#signInForm").delay(800).fadeIn(800);
    });

    $("#signUp").on("click", function (event) {
        event.preventDefault();
        $("#title").animate({ height: 625 }, 700);
        $("#sign").fadeOut();
        $("#signUpForm").delay(800).fadeIn(800);
    });

    $("#signInButton").on("click", function (event) {
        event.preventDefault();

        var email = $("#id").val().trim();
        var password = $("#pw").val().trim();

        $.post("/auth/login", {
            email: email,
            password: password
        })
            .then(function (resp) {
                window.localStorage.setItem("EnMonte", "Pythons");
                window.localStorage.setItem("token", resp.token);

                window.setTimeout(function () {
                    window.location.assign("/search.html")
                }, 400)
            })
            .catch(function (err) {
                console.log(err.responseJSON.msg);
                if (err.responseJSON.msg === "Error: password no match" ||
                err.responseJSON.msg === "TypeError: Cannot read property 'salt' of null") {
                    $(".modal-content").html("THE EMAIL OR PASSWORD<br>DOES NOT MATCH OUR RECORDS");
                } else {
                    $(".modal-content").html("PLEASE ENTER THE EMAIL AND PASSWORD");
                };
                $("#modal1").modal("open");
            })
    });

    $("#signUpButton").on("click", function (event) {
        event.preventDefault();

        var userData = {
            name: $("#name").val().trim(),
            url: $("#pic").val().trim(),
            email: $("#email").val().trim(),
            password: $("#password").val().trim()
        };

        $.post("/auth/register", userData)
            .then(function () {
                $.post("/auth/login", {
                    email: userData.email,
                    password: userData.password
                })
                    .then(function (resp) {
                        window.localStorage.setItem("EnMonte", "Pythons");
                        window.localStorage.setItem("token", resp.token);

                        window.setTimeout(function () {
                            window.location.assign("/search.html")
                        }, 400)
                    })
            })
            .catch(function (err) {
                console.log(err.responseJSON.msg);
                if (err.responseJSON.msg === "SequelizeValidationError: Validation error: Validation isEmail on email failed") {
                    $(".modal-content").html("AN EMAIL ADDRESS IS<BR>INVALID OR ALREADY IN USE");
                } else {
                    $(".modal-content").html("PLEASE FILL OUT<BR>ALL REQUIRED FIELDS");
                };
                $("#modal1").modal("open");
            })
    });
});