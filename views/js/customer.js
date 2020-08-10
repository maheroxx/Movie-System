$(document).ready(function(){
    $.ajax({
        url: "/profile",
        method: "get"
    })
    .done(
        function(data){
        
            data.forEach(function(customer)
            {
                $('#uname').append( customer.username);
                $('.profile').append("<a href ='profilepage?id="+ customer._id +"'>View Profile </a>")
                $('#historyForm').append("<input type='text' id='cusID' value='"+ customer._id + "'>")
            })
        }
    )
})