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

    // var resp = document.getElementById("response"); // Set the response text to void
    // var play = document.getElementById("play");//Get the the play link element
    // resp.innerHTML =""; 
    // resp.style.color="#FF4500";     
    // play.style.visibility="hidden";   

    var textInput= document.getElementById("d1");
    var form = document.getElementById("d2");
    var response = document.getElementById("d4");
    
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
                        textInput.innerHTML = "<br>";
                        var idPlayer = document.getElementById("id_player");
                        idPlayer.innerHTML = data.idPlayer;
                        
                        //Change the return message
                        output="</p>Created player "+name+"</p>";
                        created=true;                        
                    },
        error: function(xhr, ajaxOptions, thrownError)
                    {                        
                        textInput.innerHTML = "<br>";
                        created = false;
                        switch (xhr.status) 
                            {
                                case 409 : 
                                    output = "<p >The player already exists:</p><p>try again</p>";
                                    break;
                                case 401 : 
                                    output = "</p >The name is empty:</p><p>try again</p>";
                                    break;
                                default:   
                                    output = "</p >Communications error:</p><p>try later</p>"
                            }
                    }        
            }); 

    if(created) 
        {
            //Message player displayed
            response.innerHTML = output; 
            form.innerHTML ="";
            //Load the options
            var rows= document.getElementById("table1").rows[0].cells;
            //Exit            
            rows[0].innerHTML = "<a id='link' title='hello' href='./index2.html'><img src='./images/exit_game.png' style='width: 40%'></a>";
            //Void
            rows[1].innerHTML = "<br>";
            //Play game
            rows[2].innerHTML = "<a id='link' title='hello' href='javascript:playgame();' onclick='playgame(); return false'><img src='./images/play_again.png' style='width: 40%'></a>";
        }
    else {
        response.innerHTML = output; 
        }         
    return output;                             
}

//Play new game
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function playgame()
{
    //Get the player Id
    var idPlayer = document.getElementById("id_player").textContent;

    var rows= document.getElementById("table1").rows[0].cells;
    var response = document.getElementById("d4");
    var name ="XD"; 
    var dices = new Array(); 
    var resultTxt= "Results: ";   
    var winner = false;
    var played = false;
    var penguin = "XD";

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
                    output= "<br><p>"+name+".<p>You win!</p>";
                    penguin="./images/happy.gif"
                }
                else
                {
                    //Lost
                    output= "<br><p>"+name+".<p>You lost!</p>";
                    penguin="./images/lost.gif"
                }
                //Add the dice results
                dices.forEach(function(result) 
                    {
                       resultTxt += result+" ";
                    });
                //Add the dices results
                output= output+"<p>"+resultTxt+"</p>";
                played=true;                        
            },
        error: function(xhr, ajaxOptions, thrownError)
            {                        
                played = false;
                switch (xhr.status) 
                    {
                        case 409 : 
                            output = "<br><p>It was not possible to locate the player "+name+"</p>";
                            break;
                        case 404 :
                            output = "<br><p>Unable to play</p>Error 404<p></p>" ;
                            break;  
                        default:   
                            output = "<br><p>Communications error:</p><p>try later</p>";
                    }
            }            
    }); 
    //Change the output text
    response.innerHTML = output; 
    //Change the penguin image
    rows[1].innerHTML = "<img src='"+penguin+"' style='width: 40%'>";
}