$(document).ready(function(){
    $.ajax({
        url: "/customer",
        method: "get"
    })
    .done(
        function(data){
        
            data.forEach(function(customer)
            {
                $('#uname').append( customer.username);
                $('.profile').append("<a href ='profile?id="+ customer._id +"'>View Profile </a>")
            })
        }
    )
})