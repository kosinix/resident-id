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

var easycashreferral = getQuery("utm_campaign");
if (easycashreferral) {
    setCookie('easycashreferral', easycashreferral, 1);
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

jQuery(document).ready(function ($) {
    $('#more-search').on('click', function (e) {
        e.preventDefault();


        if ($('.more-search').is(":visible")) {
            $('.more-search').hide();
            localStorage.setItem('moreSearch', 0);
        } else {
            $('.more-search').show();
            localStorage.setItem('moreSearch', 1);

        }
    });
    var moreSearch = localStorage.getItem('moreSearch');
    if (moreSearch == 1) {
        $('.more-search').show();
    } else {
        $('.more-search').hide();
    }
})

// Extend Quill
Quill.prototype.getHtml = function () {
    return this.container.querySelector('.ql-editor').innerHTML;
};

var VueMoney = {
    mixin: {
        methods: {
            money: function(value){
                return parseFloat(_.toNumber(value).toFixed(2));
            },
            /**
             * Readable money format
             * 
             * @param {String|Number} value 
             * @param {String} sep 
             * @param {Number} decPlace 
             * 
             * @returns {String} Readable money format
             */
            currency: function (value, sep, decPlace) {
                if(!sep) sep = ',';
                if(!decPlace) decPlace = 2;
                var rounded = _.toNumber(value).toFixed(decPlace);
                var split = _.split(rounded, '.');
                var whole = _.toArray(_.get(split, '[0]', []));
                var cent = _.toString(_.get(split, '[1]', ''));

                var out = [];
                var length = whole.length;
                for (c = 0; c < length; c++) {
                    var rev = length - c;
                    if (rev % 3 === 0) {
                        out.push(sep);
                        out.push(whole[c]);
                    } else {
                        out.push(whole[c]);
                    }
                }
                var merged = _.join(out, ''); // Join arrays
                merged = _.trimStart(merged, sep); // Remove left-most sep
                if (cent) { // If there is a cent, append
                    merged += '.' + cent;
                }
                return merged;
            },
        }
    }
};

/**
 * @returns {Number} Float with 2 decimal places aka money format
 */
window.money =  function (value) {
    return parseFloat(_.toNumber(value).toFixed(2));
}

// Client side axios is almost always an ajax request. This will set req.xhr = true in express.
window.axios = axios.create({
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
});