var customerId = 0;
$(document).ready(function() {
    var urlParams = new URLSearchParams(window.location.search);
    customerId = urlParams.get('id');

    $.ajax({
        url: "/profile/" + customerId,
        method: "get"
    }).done(
        function (data) {
            $('#username').val(data.username);
            $('#email').val(data.email);
            $('#mobilenumber').val(data.mobilenumber);
            $('#creditcard').val(data.creditcard);
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

