function getQuery(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function handleAxiosError(error) {
    var ret = "";
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        ret = "Error: " + error.response.data;
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log('Error', error.request);
        ret = "Error: Could not connect to server.";
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        ret = "Error: Something went wrong with the request.";
    }
    alert(ret);
    return ret;
}

// Client side axios is almost always an ajax request. This will set req.xhr = true in express.
window.axios = axios.create({
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
});

