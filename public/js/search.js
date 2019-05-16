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
    
    var timer;
    var startTime;
    
    function start() {
      startTime = parseInt(localStorage.getItem('startTime') || Date.now());
      localStorage.setItem('startTime', startTime);
      timer = setInterval(clockTick, 100);
    }
    
    function stop() {
      clearInterval(timer);
    }
    
    function reset() {
      clearInterval(timer);
      localStorage.removeItem('startTime');
      document.getElementById('display-area').innerHTML = "00:00:00.000";
      location.reload();
    }
    
    function clockTick() {
      var currentTime = Date.now(),
        timeElapsed = new Date(currentTime - startTime),
        hours = timeElapsed.getUTCHours(),
        mins = timeElapsed.getUTCMinutes(),
        secs = timeElapsed.getUTCSeconds(),
        ms = timeElapsed.getUTCMilliseconds(),
        display = document.getElementById("display-area");
    
      display.innerHTML =
        (hours > 9 ? hours : "0" + hours) + ":" +
        (mins > 9 ? mins : "0" + mins) + ":" +
        (secs > 9 ? secs : "0" + secs) + "." +
        (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms);
    };
    
    var stopBtn = document.getElementById('stop_btn');
    
    stopBtn.addEventListener('click', function() {
      stop();
      reset()
    })
    start();
    // var xhr = new XMLHttpRequest()
    // xhr.open('POST', 'http://localhost:3000/search.html', true)
    // xhr.withCredentials = true
    // xhr.onreadystatechange = function() {
    //   if (xhr.readyState === 2) {//do something
    // };}
    // xhr.setRequestHeader('Content-Type', 'application/json');
  

    
    
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCvBcag3zLL2UmActnn9Z4Aj6xnA4u6RPU",
        authDomain: "lunchapp-510ad.firebaseapp.com",
        databaseURL: "https://lunchapp-510ad.firebaseio.com",
        projectId: "lunchapp-510ad",
        storageBucket: "lunchapp-510ad.appspot.com",
        messagingSenderId: "926839213984",
        appId: "1:926839213984:web:0ebcedcacfe5ac31"
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

                window.setTimeout(function () {
                    window.location.assign("/search.html")
                }, 2000);
           
           
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
                        var food = resp[i].lunch + "<span style='font-size:14px; font-weight:100; font-style: italic;'>("+resp[i].ingredients+")</span>" +
                        // var ingredients = ;
                        "<span style='font-size:14px; font-weight:100; font-style: italic;'> (" + resp[i].createdAt + ")</span>"
                        if (resp[i].tradable) {
                                food += " <span style='font-size:14px; font-weight:100; font-style: italic;'>(tradable)</span>";
                            };
                        var foodName = $("<div class='myFoodName col s10 amber lighten-4'>").attr("id", "food" + resp[i].id).html(food);
                        
                        var button = $('<button class="foodDelete waves-effect waves-light btn orange lighten-1">').attr("id", resp[i].id).text("X");
                        var foodOption = $("<div class='foodOption col s2'>").append(button);
                    
                        $("#myItems").append(foodName).append(foodOption)
                        // $("#myItems").append(ingredients);
                        // $("#myItems")
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
                        var food = resp[i].lunch + "<span style='font-size:14px; font-weight:100; font-style: italic;'>("+resp[i].ingredients+")</span>" +
                        // var ingredients = ;
                        "<span style='font-size:14px; font-weight:100; font-style: italic;'> (" + resp[i].createdAt + ")</span>"
                        if (resp[i].tradable) {
                                food += " <span style='font-size:14px; font-weight:100; font-style: italic;'>(tradable)</span>";
                            };
                        var foodName = $("<div class='myFoodName col s10 amber lighten-4'>").attr("id", "food" + resp[i].id).html(food);
                        
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
        $('.sidenav').sidenav("close");
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
                "ingredients": $("#ingredients").val(),              
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
        $('.sidenav').sidenav("close");
        searchLunch($("#search1").val().trim());
       
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
                        var ingredients = resp[i].ingredients;
                        var foodDate = "<span style='font-size:14px; font-weight:100; font-style: italic;'> (" + resp[i].createdAt + ")</span>"

                        var food = resp[i].lunch + " <span style='font-size:14px; font-weight:100; font-style: italic;'>(" + resp[i].eater + ")</span>";
                        var foodName = $("<div class='foodName col s9 amber lighten-4'>").attr("id", "food" + resp[i].id).html(food);
                        var button = $('<button class="foodTrade waves-effect waves-light btn orange lighten-1">').attr({ "id": resp[i].id, "data-name": resp[i].userID }).text("Trade");
                        var foodOption = $("<div class='foodOption col s3'>").append(button);
                        $("#searchItems").append(foodName).append(foodOption);
                        $("#searchItems").append(ingredients);
                        $("#searchItems").append(foodDate)
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
  
    function onMessageAdded(data) {
        let template = $("#new-message").html();
        template = template.replace(req.body, data.message);
      

        $(".chat").append(template);
    }

    // if(!isAuthenticated && !window.location.hash){
    //     lock.show();
    // }
    // else{
    //     if(profile){
    //         $("#username").html(profile.name);
    //     }

        // Enable pusher logging - don't include this in production
        // Pusher.logToConsole = true;

        $("#username").html(payload.userID);
        var pusher = new Pusher('5f7a51d01f971c30ce3a', {
            cluster: 'us3',
            forceTLS: true
          });

        var channel = pusher.subscribe('lunchapp-development');
        channel.bind('my-event', onMessageAdded);
  

        $('#btn-chat').click(function(){
            event.preventDefault();

             $("#message").val("");
            const message = $("#message").val();
           
                //send message
                $.ajax({ 
                    type: "POST", 
                    url: "/message", 
                    data: {"message":message}   ,
                    headers: { "Authorization": 'Bearer ' + token }
                  }); 
                     
                   
                   
                
                    // .then(function (resp) {
                    //     window.localStorage.setItem("EnMonte", "Pythons");
                    //     window.localStorage.setItem("token", resp.token);
        
                    //     window.setTimeout(function () {
                    //         window.location.assign("/search.html")
                    //     }, 400) })
    //   }) 

                        })

});


