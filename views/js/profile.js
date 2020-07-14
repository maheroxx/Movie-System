var customerId = 0;
$(document).ready(function() {
    var urlParams = new URLSearchParams(window.location.search);
    customerId = urlParams.get('id');

    $.ajax({
        url: "/profile/" + customerId,
        method: "get"
    }).done(
        function (data) {
            $('#username').append(data.username);
            $('#email').append(data.email);
            $('#mobilenumber').append(data.mobilenumber);
            $('#creditcard').append(data.creditcard);
        }
    ).fail(
        function (err) {
            console.log(err.responseText);
        }
    );
});


function editProfile() {
    var customer = {
        id: customerId,
        username: $("#username").val(),
        email: $("#email").val(),
        mobilenumber: $("#mobilenumber").val(),
        creditcard: $("#creditcard").val()
    };
    $.ajax(
        {
            url: '/profile',
            method: 'put',
            data: customer
        }
    ).done(
        function (data) {
            alert("Profile updated!");
        }
    ).fail(
        function (err) {
           console.log(err.responseText);
        }
    );
    return false;
}

