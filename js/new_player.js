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

    var resp = document.getElementById("response"); // Set the response text to void
    var play = document.getElementById("play");//Get the the play link element
    resp.innerHTML =""; 
    resp.style.color="#FF4500";     
    play.style.visibility="hidden";
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
        success: function(data)
                    {                        
                        //save the idPlayer value into the page
                        var idPlayer = document.getElementById("idplayer");
                        idPlayer.innerHTML = data.idPlayer;
                        
                        //Change the return message
                        output="Created player "+name;
                        created=true;                        
                    },
        error: function(xhr, ajaxOptions, thrownError)
                    {                        
                        created = false;
                        switch (xhr.status) 
                            {
                                case 409 : 
                                    output = "The player already exists, try again";
                                    break;
                                case 401 : 
                                    output = "The name is empty, try again";
                                    break;
                                default:   
                                    output = "Communications error, try later"
                            }
                    }        
            }); 
    if(created) 
        {
            play.style.visibility ="visible";
            play.style.color="#FF4500";
            document.getElementById("nameform").style.visibility ="hidden";  
            document.getElementById("textform").style.visibility ="hidden"; 
        }
    else       
    resp.innerHTML = output; 

    return output;                             
}

//Play new game
function playgame()
{
    var idPlayer = document.getElementById("idplayer").textContent;
    alert("Jugamos con: "+idPlayer);

}