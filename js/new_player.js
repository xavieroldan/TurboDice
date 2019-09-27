var urlServer="http://localhost:8080/";
var myPlayer = { name : null, idPlayer : null};

//Create a new player
//✧*｡٩(ˊᗜˋ*)و✧*｡   
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function newplayer(){
     
    var myObj = { name : null }; 
    var name= document.getElementById("newname").value;
    myObj.name = name;
    var created=false;    
    $.ajax
            ({
        url: urlServer+'players',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(myObj),
        async: false,
        cache: false,
        processData: false,  
        success: function(data)
                    {                        
                        //save the idPlayer value 
                        document.getElementById("d1").innerHTML = "<br>"; 
                        myPlayer = data;
                        
                        //Change the return message
                        document.getElementById("d4").innerHTML="<p class='blinky'>Created player</p>";
                        created=true;                        
                    },
        error: function(xhr, ajaxOptions, thrownError)
                    {                        
                        document.getElementById("d1").innerHTML = "<br>";
                        created = false;
                        switch (xhr.status) 
                            {
                                case 409 : 
                                    document.getElementById("d4").innerHTML = "<p class='blinkr'>The player already exists:</p><p class='blinkr'>try again</p>";
                                    break;
                                default:   
                                    document.getElementById("d4").innerHTML= "<p class='blinkr'>Communications error:</p class='blink'><p class='blinkr'>try later</p>"
                            }
                    }        
            }); 

    if(created) 
        {
            playGame();
            //Message player displayed
            // response.innerHTML = output; 
            // document.getElementById("d2").innerHTML ="";
            
        }                          
}

//Play new game
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function playGame()
{
    
    document.getElementById("d1").innerHTML="";
    document.getElementById("d2").innerHTML=""; 
    //Create the table   

    var tableString = "<table id='table1' style='width: 100%'>";
    for (row = 1; row < 2; row += 1) 
    {
        tableString += "<tr>";
            for (col = 1; col < 4; col += 1) 
            {
                tableString += "<td class='thirtythree'> </td>";
            }
        tableString += "</tr>";
    }
    tableString += "</table>";
    document.getElementById("d3").innerHTML = tableString; 

    //Charge the game menu
    var rows= document.getElementById("table1").rows[0].cells;
    //Exit            
    rows[0].innerHTML = 
    "<a id='link' title='exit' href='./index.html'><img src='./images/exit_game.png' alt='exit' class='responsive'></a>";
    //Void
    rows[1].innerHTML = 
    "<img src='./images/happy.gif' alt='penguin' class='responsive'>";
    //Play game
    rows[2].innerHTML = 
    "<a id='link' title='play' href='javascript:startGame();'><img src='./images/play_again.png' alt='play' class='responsive'></a>";
    }
    //+++++++++++++++++
    function startGame(){    
    
        var name ="XD"; 
        var dices = new Array(); 
        var resultTxt= "Results: ";   
        var winner = false;
        var penguin = "XD";

        //Play the game
        $.ajax
        ({
            url: urlServer+'players/'+myPlayer.idPlayer+"/games/",
            type: 'POST',
            async: false,
            cache: false,
            processData: false, 
            contentType: "application/json; charset=utf-8",
            dataType: "json", 
            success: function(player)
                {   
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
                        // output= "<p>"+name+":<p class='blinky'>You win!</p>";
                        output= "<p class='blinky'>You win!</p>";
                        penguin="./images/happy.gif"
                    }
                    else
                    {
                        //Lost
                        // output= "<p>"+name+"<p class='blinkr'>You lost!</p>";
                        output= "<p class='blinkr'>You lost!</p>";
                        penguin="./images/cry.gif"
                    }
                    //Add the dice results
                    dices.forEach(function(result) 
                        {
                        resultTxt += result+" ";
                        });
                    //Add the dices results
                    output+="<p>"+resultTxt+"</p>";
                    played=true;                        
                },
            error: function(xhr, ajaxOptions, thrownError)
                {    
                    switch (xhr.status) 
                        {
                            case 409 : 
                                output = "<p class='blinkr'>It was not possible to locate the player "+name+"</p>";
                                break;
                            case 404 :
                                output = "<p class='blinkr'>Unable to play</p class='blinkr'>Error 404<p></p>" ;
                                break;  
                            default:   
                                output = "<p class='blinkr'>Communications error:</p><p class='blinkr'>try later</p>";
                        }
                }            
        });   
        //Change the output text
        document.getElementById("d4").innerHTML = output; 
        //Change the penguin image
        var rows= document.getElementById("table1").rows[0].cells;
        rows[1].innerHTML = "<img src='"+penguin+"' class='responsive'> ";
}  

