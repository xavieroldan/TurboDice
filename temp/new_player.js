//Get all players
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function playgame()
{
    //Get the player Id
    var idPlayer = document.getElementById("idplayer").textContent;
    var name ="XD"; 
    var dices = new Array(); 
    var resultTxt= "Results: ";   
    var winner = false;
    var played = false;

    //Play the game
    var played = false;
    $.ajax
    ({
        url: "http://localhost:8080/players/"+idPlayer+"/games/",
        type: 'POST',
        async: false,
        cache: false,
        processData: false, 
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
        success: function(player)
            {   
                played=true;
                //Get the dice game result
                var listGame = player.listGame; //Get the list of games
                var numGames = listGame.length; //Get the number of games
                numGames --;   //Get the current position game  
                var lastGame = new Array();        
                lastGame = listGame[numGames]; //Get the last game
                winner = lastGame.isWinner;
                //Get the result of the dices  
                var listDiceResult = lastGame.listDiceResult; 
                listDiceResult.forEach(
                        function(results)
                            {
                                dices.push(results.result);                        
                            }
                    );                
                //Get the player name
                name = player.name;
                //Change the return message
                if(winner)
                {
                    //Wins
                    output= name+".You wins!";
                }
                else
                {
                    //Lost
                    output= name+".You lost.";
                }
                //Add the dice results
                dices.forEach(function(result) 
                    {
                       resultTxt += result+" ";
                    });
                //Add the dices results
                output= output+"\n"+resultTxt;
                played=true;                        
            },
        error: function(xhr, ajaxOptions, thrownError)
            {                        
                played = false;
                switch (xhr.status) 
                    {
                        case 409 : 
                            output = "No fue posible localizar el jugador:"+name;
                            break;
                        case 404 :
                            output = "No se pudo realizar la jugada. Error 404" ;
                            break;  
                        default:   
                            output = "Communications error, try later";
                    }
            }            
    }); 
    alert(output);
    //Play again?
    alert("Estoy en la nueva página");
    document.getElementById("playagain").style.visibility ="visible";
    document.getElementById("playyes").style.visibility ="visible";
    document.getElementById("playno").style.visibility ="visible";
    document.getElementById("play").style.visibility ="hidden";
}