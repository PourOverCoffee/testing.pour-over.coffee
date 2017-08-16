user_token = localStorage.getItem('user_token')
if (!user_token) {
    user_token = (Math.random() * Math.pow(2, 70)).toString(36)
    localStorage.setItem('user_token', user_token)
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

session_token = (Math.random() * Math.pow(2, 70)).toString(36)

campaign = findGetParameter('utm_campaign') || 'no_campaign'
product = findGetParameter('product')  || 'no_product'
version = '4.0'
server = 'https://pourover.ambroselli.tech'

start_time = new Date()


function logSession() {
    // Log Session (POST http://localhost:3000/log/session)

    session = JSON.stringify({
            "campaign": campaign,
            "session_token": session_token,
            "product": product,
            "token": user_token,
            "domain": window.location.protocol + '//' + window.location.hostname,
            "version": version
        })

    jQuery.ajax({
        url: server + "/log/session",
        type: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        contentType: "application/json",
        data: session
    })
    .done(function(data, textStatus, jqXHR) {
        // console.log("HTTP Request Succeeded: " + jqXHR.status);
        // console.log(data);
        console.log("Logged session", session)
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log("HTTP Request Failed", textStatus, errorThrown);
    })
}

function logAction(action, identifier) {
    // Log Action (POST http://localhost:3000/log/action)
    action = JSON.stringify({
            "action": action || 'default',
            "session_token": session_token,
            "identifier": identifier || 'default',
            "path": window.location.href,
            "elapsed_time": "" + Math.floor(((new Date()) - start_time) / 1000)
        })

    jQuery.ajax({
        url: server + "/log/action",
        type: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        contentType: "application/json",
        data: action
    })
    .done(function(data, textStatus, jqXHR) {
        // console.log("HTTP Request Succeeded: " + jqXHR.status);
        // console.log(data);
        console.log("Logged action", action)
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log("HTTP Request Failed", textStatus, errorThrown);
    })
    .always(function() {
        /* ... */
    });
}

// always log the session on load
logSession()
logAction("openPage", window.location.href)
