//Get all players
function getall(){
    var options = {
        method: 'get'
        }
    alert("Enviado el GET");

    fetch('http://localhost:8080/getall', options).then(response => {
        document.getElementById("incoming").innerHTML = response
        }).catch(error => console.error(error))
}


//Create a new player
//✧*｡٩(ˊᗜˋ*)و✧*｡   
function newplayer(){

    var x = document.getElementById("response"); // Set the response text to void
    var y = document.getElementById("play");//Get the link to play element
    x.innerHTML ="";
    y.style.visibility="hidden";
    var myObj = { name : null }; 
    var name= document.getElementById("newname").value;
    myObj.name = name;
    var output="XD"; 
    var created=false;
    $.ajax
            ({
        url: 'http://localhost:8080/players',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(myObj),
        async: false,
        cache: false,
        processData: false,
        success: function()
                    {
                        alert("Success");
                        output="Creado jugador "+name;
                        created=true;
                    },
        error: function(xhr, ajaxOptions, thrownError)
                    {
                        alert("Error");
                        created = false;
                        switch (xhr.status) 
                            {
                                case 409 : 
                                    output = "El jugador ya existe, prueba de nuevo";
                                    break;
                                case 401 : output = "El nombre está vacío, prueba de nuevo";
                                    break;
                            }
                    }        
            }); 
    alert(output);

    if(created) 
        {
            y.style.visibility ="visible";
            y.style.color="#FF4500";   
        }
    else       
      x.innerHTML= output; 

    return output;                             
}