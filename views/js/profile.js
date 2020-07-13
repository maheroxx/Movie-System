//var customerId = 0;
$(document).ready(function() {
   // var urlParams = new URLSearchParams(window.location.search);
   // customerId = urlParams.get('id');

    $.ajax({
        url: "/profile",
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

    return false;
})