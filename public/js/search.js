$(document).ready(function () {
    var valid = window.localStorage.getItem("EnMonte");

    if (!valid) {
        window.localStorage.clear();
        window.location.assign("/index.html")
    } else {
        var token = window.localStorage.getItem("token");

        if (token) {
            var payload = JSON.parse(window.atob(token.split('.')[1]));
            var currentTime = new Date();

            if (payload.exp < currentTime / 1000) {
                window.location.assign("/index.html")
            };
        };
    };

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBxDrdk8o6TGy3lVqgwyQz2jIz6zuBf-Qk",
        authDomain: "aka-joe-project.firebaseapp.com",
        databaseURL: "https://aka-joe-project.firebaseio.com",
        projectId: "aka-joe-project",
        storageBucket: "aka-joe-project.appspot.com",
        messagingSenderId: "682758063555"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    var reqList = [-1];
    var mine = [-1];
    var yours = [-1];
    var position;

    var myFood;
    var yourFood;
    var yourID;
    var accepts = [-1];
    var rejects = [-1];

    // Firebase watcher + initial loader
    database.ref().on("value", function (snapshot) {
        if (snapshot.exists()) {
            // database.ref().set({
            //     accepts: accepts,
            //     rejects: rejects,
            //     reqList: reqList,
            //     mine: mine,
            //     yours: yours
            // });
            
            // storing the snapshot.val() in a variable for convenience
            if (snapshot.val().accepts) {
                accepts = snapshot.val().accepts;
            };
            if (snapshot.val().rejects) {
                rejects = snapshot.val().rejects;
            };
            if (snapshot.val().reqList) {
                reqList = snapshot.val().reqList;
            };
            if (snapshot.val().mine) {
                mine = snapshot.val().mine;
            };
            if (snapshot.val().yours) {
                yours = snapshot.val().yours;
            };
            
            position = reqList.indexOf(payload.userID);

            if (position != -1) {
                $.ajax({
                    url: "/api/food/" + mine[position],
                    method: "GET",
                    headers: { "Authorization": 'Bearer ' + token }
                }).then(function (resp) {
                    var food = resp.lunch;
                    $.ajax({
                        url: "/api/food/" + yours[position],
                        method: "GET",
                        headers: { "Authorization": 'Bearer ' + token }
                    }).then(function (resp) {
                        $(".modal-trade").html("<h4>Will you trade your [" + food + "]<br>with [" + resp.lunch + "]?</h4>");
                        $("#modal2").modal("open");
                    }).catch(function (err) {
                        throw err;
                    });
                }).catch(function (err) {
                    throw err;
                });
            };

            var ok = accepts.indexOf(payload.userID);
            if (ok != -1) {
                accepts.splice(ok, 1);
                $(".modal-content").html("<h4>A REQUEST HAS BEEN ACCEPTED!</h4>")
                $("#modal1").modal("open");
                database.ref().set({
                    accepts: accepts,
                    rejects: rejects,
                    reqList: reqList,
                    mine: mine,
                    yours: yours
                });
            };

            var ok = rejects.indexOf(payload.userID);
            if (ok != -1) {
                rejects.splice(ok, 1);
                $(".modal-content").html("<h4>A REQUEST HAS BEEN REJECTED...</h4>")
                $("#modal1").modal("open");
                database.ref().set({
                    accepts: accepts,
                    rejects: rejects,
                    reqList: reqList,
                    mine: mine,
                    yours: yours
                });
            };
        };
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    $('.sidenav').sidenav();
    $('.modal').modal({ endingTop: '42%' });

    $('#userName1').html("Welcome,<br>" + payload.name);
    $('#userName2').html("Welcome,<br>" + payload.name);

    if (payload.url != "") {
        $('#userPic1').attr("src", payload.url);
        $('#userPic2').attr("src", payload.url);
    }

    var lunchList;
    myLunch();

    function myLunch() {
        $.ajax({
            url: "/api/user/" + payload.userID,
            method: "GET",
            headers: { "Authorization": 'Bearer ' + token }
        })
            .then(function (resp) {
                lunchList = resp;
                if (resp.length === 0) {
                    $("#myItems").html("<h4>Nothing...</h4>");
                } else {
                    $("#myItems").empty();
                    for (var i = 0; i < resp.length; i++) {
                        var food = resp[i].lunch;
                        if (resp[i].tradable) {
                            food += " <span style='font-size:14px; font-weight:100; font-style: italic;'>(tradable)</span>";
                        };
                        var foodName = $("<div class='myFoodName col s10 amber lighten-4'>").attr("id", "food" + resp[i].id).html(food);
                        var button = $('<button class="foodDelete waves-effect waves-light btn orange lighten-1">').attr("id", resp[i].id).text("X");
                        var foodOption = $("<div class='foodOption col s2'>").append(button);
                        $("#myItems").append(foodName).append(foodOption);
                    };
                };
            }).catch(function (err) {
                throw err;
            });
    };

    function tradableLunch() {
        $.ajax({
            url: "/api/lunch",
            method: "GET",
            headers: { "Authorization": 'Bearer ' + token }
        })
            .then(function (resp) {
                var counter = 0;
                $("#searchItems").empty();
                for (var i = 0; i < resp.length; i++) {
                    if (payload.userID != resp[i].userID && resp[i].tradable) {
                        counter++;
                        var food = resp[i].lunch + " <span style='font-size:14px; font-weight:100; font-style: italic;'>(" + resp[i].eater + ")</span>";
                        var foodName = $("<div class='foodName col s9 amber lighten-4'>").attr("id", "food" + resp[i].id).html(food);
                        var button = $('<button class="foodTrade waves-effect waves-light btn orange lighten-1">').attr({ "id": resp[i].id, "data-name": resp[i].userID }).text("Trade");
                        var foodOption = $("<div class='foodOption col s3'>").append(button);
                        $("#searchItems").append(foodName).append(foodOption);
                    };
                };
                if (counter === 0) {
                    $("#searchItems").html("<h4>Nothing...</h4>");
                };
            }).catch(function (err) {
                throw err;
            });
    };

    $("#allTradable1").on("click", function (event) {
        event.preventDefault();
        tradableLunch();
    });

    $("#allTradable2").on("click", function (event) {
        event.preventDefault();
        tradableLunch();
    });

    $("#signOut1").on("click", function (event) {
        event.preventDefault();
        window.localStorage.clear();
        window.location.assign("/index.html")
    });

    $("#signOut2").on("click", function (event) {
        event.preventDefault();
        window.localStorage.clear();
        window.location.assign("/index.html")
    });

    $("#addButton").on("click", function (event) {
        event.preventDefault();

        if ($("#foodName").val() === "") {
            return;
        };

        $.ajax({
            url: "/api/user/",
            method: "POST",
            headers: { "Authorization": 'Bearer ' + token },
            data: {
                "userID": payload.userID,
                "eater": payload.name,
                "lunch": $("#foodName").val(),
                "tradable": $("#trade").is(":checked")
            }
        }).then(function (resp) {
            myLunch();
        }).catch(function (err) {
            throw err;
        });
    });

    $(document).on("click", ".foodDelete", function (event) {
        event.preventDefault();

        $.ajax({
            url: "/api/user/" + $(this).attr("id"),
            method: "DELETE",
            headers: { "Authorization": 'Bearer ' + token }
        }).then(function (resp) {
            myLunch();
        }).catch(function (err) {
            throw err;
        });
    });

    // If ‘Enter’ key has been pressed
    $("#search1").on("keypress", function (e) {
        if (e.which === 13) {
            //Disable textbox to prevent multiple submit
            e.preventDefault();
            $(this).attr("disabled", "disabled");

            searchLunch($("#search1").val().trim());

            //Enable the textbox again if needed.
            $(this).removeAttr("disabled");
        }
    });

    $("#searchButton").on("click", function (event) {
        event.preventDefault();
        searchLunch($("#search2").val().trim());
    });

    function searchLunch(food) {
        $.ajax({
            url: "/api/lunch/" + food,
            method: "GET",
            headers: { "Authorization": 'Bearer ' + token }
        })
            .then(function (resp) {
                var counter = 0;
                $("#searchItems").empty();
                for (var i = 0; i < resp.length; i++) {
                    if (payload.userID != resp[i].userID && resp[i].tradable) {
                        counter++;
                        var food = resp[i].lunch + " <span style='font-size:14px; font-weight:100; font-style: italic;'>(" + resp[i].eater + ")</span>";
                        var foodName = $("<div class='foodName col s9 amber lighten-4'>").attr("id", "food" + resp[i].id).html(food);
                        var button = $('<button class="foodTrade waves-effect waves-light btn orange lighten-1">').attr({ "id": resp[i].id, "data-name": resp[i].userID }).text("Trade");
                        var foodOption = $("<div class='foodOption col s3'>").append(button);
                        $("#searchItems").append(foodName).append(foodOption);
                    };
                };
                if (counter === 0) {
                    $("#searchItems").html("<h4>No results...</h4>");
                };
            }).catch(function (err) {
                throw err;
            });
    };

    $(document).on("click", ".foodTrade", function (event) {
        event.preventDefault();

        yourID = Number($(this).attr("data-name"));
        yourFood = Number($(this).attr("id"));
        $(".foodName").removeClass("darken-2");
        $("#food" + $(this).attr("id")).addClass("darken-2");

        $("#myLunches").css({ "background-color": "rgba(139, 2, 2, 0.8)" });
        $("#myTitle").css({ "background-color": "white", "color": "rgb(139, 2, 2)" }).text("SELECT YOUR FOOD TO BE TRADED");

        $("#myItems").empty();

        var counter = 0;
        for (var i = 0; i < lunchList.length; i++) {
            if (lunchList[i].tradable) {
                counter++;
                var foodName = $("<div class='myFoodName col s10 amber lighten-4'>").attr({ "id": "food" + lunchList[i].id, "value": lunchList[i].id }).html(lunchList[i].lunch);
                var button = $('<button class="myTrade waves-effect waves-light btn orange lighten-1">').attr("id", lunchList[i].id).html('<i class="material-icons prefix">autorenew</i>');
                var foodOption = $("<div class='foodOption col s2'>").append(button);
                $("#myItems").append(foodName).append(foodOption);
            }
        };
        if (counter === 0) {
            $("#myItems").html("<h4>Nothing to trade...</h4>");
            window.setTimeout(function () {
                window.location.assign("/search.html")
            }, 800);
        };
    });

    $(document).on("click", ".myTrade", function (event) {
        event.preventDefault();

        myFood = Number($(this).attr("id"));
        $("#food" + $(this).attr("id")).addClass("darken-2");

        $(".modal-content").html("<h4>A REQUEST HAS BEEN SENT!</h4>")
        $("#modal1").modal("open");

        reqList.push(yourID);
        mine.push(yourFood);
        yours.push(myFood);

        database.ref().set({
            accepts: accepts,
            rejects: rejects,
            reqList: reqList,
            mine: mine,
            yours: yours
        });

        window.setTimeout(function () {
            window.location.assign("/search.html")
        }, 2000);
    });

    function update(id, userID, eater) {
        $.ajax({
            url: "/api/lunch",
            method: "PUT",
            headers: { "Authorization": 'Bearer ' + token },
            data: {
                "id": id,
                "userID": userID,
                "eater": eater,
                "tradable": false
            }
        }).then(function (resp) {
            console.log(resp);
        }).catch(function (err) {
            throw err;
        });
    };

    function getFood(id) {
        $.ajax({
            url: "/api/food/" + id,
            method: "GET",
            headers: { "Authorization": 'Bearer ' + token }
        }).then(function (resp) {
            return resp;
        }).catch(function (err) {
            throw err;
        });
    };

    $(document).on("click", "#agree", function (event) {
        event.preventDefault();

        position = reqList.indexOf(payload.userID);

        $.ajax({
            url: "/api/food/" + mine[position],
            method: "GET",
            headers: { "Authorization": 'Bearer ' + token }
        }).then(function (resp) {
            var my = resp;
            $.ajax({
                url: "/api/food/" + yours[position],
                method: "GET",
                headers: { "Authorization": 'Bearer ' + token }
            }).then(function (resp) {
                var your = resp;

                accepts.push(your.userID);

                update(yours[position], my.userID, my.eater);
                update(mine[position], your.userID, your.eater);

                $(".modal-content").html("<h4>A TRADE HAS BEEN COMPLETED!</h4>")
                $("#modal1").modal("open");
        
                reqList.splice(position, 1);
                mine.splice(position, 1);
                yours.splice(position, 1);
        
                database.ref().set({
                    accepts: accepts,
                    rejects: rejects,
                    reqList: reqList,
                    mine: mine,
                    yours: yours
                });
        
                window.setTimeout(function () {
                    window.location.assign("/search.html")
                }, 2000);
            }).catch(function (err) {
                throw err;
            });
        }).catch(function (err) {
            throw err;
        });
    });

    $(document).on("click", "#disagree", function (event) {
        event.preventDefault();

        position = reqList.indexOf(payload.userID);

        $.ajax({
            url: "/api/food/" + yours[position],
            method: "GET",
            headers: { "Authorization": 'Bearer ' + token }
        }).then(function (resp) {
            $(".modal-content").html("<h4>YOU REJECT A TRADE...</h4>")
            $("#modal1").modal("open");

            rejects.push(resp.userID);
    
            reqList.splice(position, 1);
            mine.splice(position, 1);
            yours.splice(position, 1);
    
            database.ref().set({
                accepts: accepts,
                rejects: rejects,
                reqList: reqList,
                mine: mine,
                yours: yours
            });
        }).catch(function (err) {
            throw err;
        });
    });
});