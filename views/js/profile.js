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

            $('#editusername').val(data.username);
            $('#editemail').val(data.email);
            $('#editmobilenumber').val(data.mobilenumber);
            $('#editcreditcard').val(data.creditcard);
            $('#editpassword').val(data.password);

        }
    ).fail(
        function (err) {
            console.log(err.responseText);
        }
    );

});

function editProfile() {
    var customers = {
        id: customerId,
        username: $("$editusername").val(),
        email: $("#editemail").val(),
        mobilenumber: $("#editmobilenumber").val(),
        creditcard: $("#editcreditcard").val(),
        password: $("#editpassword").val()
    };
    $.ajax(
        {
            url: '/profile',
            method: 'put',
            data: customers
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

