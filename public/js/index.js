$(document).ready(function(){
    // Initiating our Auth0Lock
    let lock = new Auth0Lock(
        'CmxYhPqOp17ZdOPS7qS3bG3UkZeNUjsI',
        'dev-ocpo5ji5.auth0.com',
        {
            auth: {
                // params: {
                //     scope: 'openid profile'
                // },
                sso: false,
            },
            autoclose: true,
            closable: false,
            rememberLastLogin: true
        }
    );

    // Listening for the authenticated event
    lock.on("authenticated", function(authResult) {
        // Use the token in authResult to getUserInfo() and save it to localStorage
        lock.getUserInfo(authResult.accessToken, function(error, profile) {
            if (error) {
                // Handle error
                console.log(error);
                return;
            }

            localStorage.setItem('accessToken', authResult.accessToken);
            localStorage.setItem('profile', JSON.stringify(profile));
            localStorage.setItem('isAuthenticated', true);
            updateAuthenticationValues(profile, true);
            $("#username").html(profile.name);
        });
    });

    let profile = JSON.parse(localStorage.getItem('profile'));
    let isAuthenticated = localStorage.getItem('isAuthenticated');

    function updateAuthenticationValues(userProfile, authStatus) {
        profile = userProfile;
        isAuthenticated = authStatus;
    }

    $("#logout").click((e) => {
        e.preventDefault();
        logout();
    });

    function logout(){
        localStorage.clear();
        isAuthenticated = false;
        lock.logout({
            returnTo: "http://localhost:3000"
        });
    }

    function onMessageAdded(data) {
        let template = $("#new-message").html();
        template = template.replace("{{body}}", data.message);
        template = template.replace("{{name}}", data.name);

        $(".chat").append(template);
    }

    if(!isAuthenticated && !window.location.hash){
        lock.show();
    }
    else{
        if(profile){
            $("#username").html(profile.name);
        }

        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        
        var pusher = new Pusher('5f7a51d01f971c30ce3a', {
            cluster: 'us3',
            forceTLS: true
          });

        var channel = pusher.subscribe('my-channel');
        channel.bind('message-added', onMessageAdded);

        $('#btn-chat').click(function(){
            const message = $("#message").val();
            $("#message").val("");
                //send message
            $.post( "http://localhost:3000/message", { message, name: profile.name } );
        });  
    }
});