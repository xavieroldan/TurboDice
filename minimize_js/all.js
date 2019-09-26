var idPlayer="";
var urlServer="http://localhost:8080/";

//Create a new player
//✧*｡٩(ˊᗜˋ*)و✧*｡   
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function newplayer(){

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
                        textInput.innerHTML = "<br>";                        
                        idPlayer= data.idPlayer;
                        
                        //Change the return message
                        output="<p class='blinky'> Created player "+name+"</p>";
                        created=true;                        
                    },
        error: function(xhr, ajaxOptions, thrownError)
                    {                        
                        textInput.innerHTML = "<br>";
                        created = false;
                        switch (xhr.status) 
                            {
                                case 409 : 
                                    output = "<p class='blinkr'>The player already exists:</p><p class='blinkr'>try again</p>";
                                    break;
                                default:   
                                    output = "<p class='blinkr'>Communications error:</p class='blink'><p class='blinkr'>try later</p>"
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
            rows[0].innerHTML = 
            "<a id='link' title='hello' href='./index.html'><img src='./images/exit_game.png' alt='exit' class='responsive'></a>";
            //Void
            rows[1].innerHTML = 
            "<img src='./images/happy.gif' alt='penguin' class='responsive'>";
            //Play game
            rows[2].innerHTML = 
            "<a id='link' title='hello' href='javascript:playgame();' onclick='playgame(); return false'><img src='./images/play_again.png' alt='play' class='responsive'></a>";
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
        url: urlServer+'players/'+idPlayer+"/games/",
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
                played = false;
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
    response.innerHTML = output; 
    //Change the penguin image
    rows[1].innerHTML = "<img src='"+penguin+"' class='responsive'> ";
}  

//Get all players
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getall(){
    var options = {
        method: 'get'
        }
    alert("Enviado el GET");

    fetch(urlServer+'getall', options).then(response => {
        document.getElementById("incoming").innerHTML = response
        }).catch(error => console.error(error))
}



var urlServer="http://localhost:8080/";
var myPlayer = { name : null, idPlayer : null};
var urlRequest = "";



//Radio list of all players
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function generateList(){ 

    var playersList = new Array();
    var nameList = new Array();
    var urlHeader = urlServer+"getall";
    var isPlayerSet= false;    
    //Getting the list player's names 
    $.ajax
        ({
        url: urlHeader,
        type: 'GET',
        contentType: "application/json; charset=utf-8",        
        async: true,
        cache: false,
        processData: false,  
        success: function(data)
                {                        
                    //Read all the player's names
                    playersList = data;                    
                    playersList.forEach(
                        function(player) 
                            {                                
                                nameList.push(player.name);
                            }
                        );  
                    //Creating the select list 
                    var selectList 
                    ="<select id='select_list'><option value=''selected disabled hidden></option>";
                    nameList.forEach(
                        function(name)
                            {
                            selectList+="<option value='"+name+"'>"+name+"</option>";               
                            }
                        );
                        selectList+="</select>";

                    //Output the list
                    var printList = document.getElementById("d2") ;
                    printList.innerHTML = selectList;

                    //Detect the selected player
                    var o = document.getElementById("select_list");
                    var nameTried = o.options[o.selectedIndex].value;

                    document.getElementById("select_list").addEventListener("change",
                        function(){                            
                            nameTried = o.options[o.selectedIndex].value;
                            //Set the player object
                            myPlayer.name=nameTried;
                            playersList.forEach(
                                function(player)
                                {                               
                                    if(player.name==nameTried)
                                    {
                                        //Go to the submenu
                                        myPlayer.idPlayer=player.idPlayer;
                                        isPlayerSet=true;
                                        if(isPlayerSet==true){submenu();}   
                                    }
                                }
                            )
                        });
                },
        error: function(xhr, ajaxOptions, thrownError)
                {                        
                    var errorMsg="";
                    switch (xhr.status) 
                        {
                            case 409 :
                                errorMsg="Error 409";
                                break;
                            default:   
                                errorMsg="Error comunications("+xhr.status+")";
                        }
                    
                    document.getElementById("d3").innerHTML="<p class='blinkr'>"+errorMsg+"</p>";
                }        
        });           
    }

//Submenu select player
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function submenu(){
    
    //Generate the submenu
    //Header
    var nameText = document.getElementById("d1");
    nameText.innerHTML="<p class='blinky'>Player "+myPlayer.name+" selected</p><br>";

    //Options
    var editName= document.getElementById("d2");
    var deletePlayer= document.getElementById("d3");
    var play= document.getElementById("d4");
    
    editName.innerHTML="<a href='#' onclick='#' onmouseover='this.style.color='#FF4500'' onmouseout='this.style.color='white'' >Edit name</a>";
    deletePlayer.innerHTML="<br>"+"<a href='javascript:deletePlayer();'>Delete player</a>";
    play.innerHTML="<br>"+"<a href='#' onclick='#'>Play Game</a>"; 
}

//Delete player
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function deletePlayer(){
    urlRequest=urlServer+"players/"+myPlayer.idPlayer;
    var alertText = document.getElementById("d2");
    var yesOption= document.getElementById("d3");
    var NoOption= document.getElementById("d4");
    
    alertText.innerHTML="<p>Confirm delete, please</p>";
    NoOption.innerHTML="<br><a href='javascript:submenu();' >No</a>";
    yesOption.innerHTML="<a href='javascript:del();' >Yes</a>";
}

//Delete call
function del(){
        var isDeleted = false;
        $.ajax
        ({
                url: urlRequest,
                type: 'DELETE', 
                async: false,
                cache: false, 
                processData: false,               
                contentType: "application/json; charset=utf-8",
                dataType: "json", 
                  success: function(data)
                      {
                      alert("Data Deleted: " + data);
                      },
                  error: function(xhr, ajaxOptions, thrownError)
                     {
                         var errorMsg="";
                          switch (xhr.status) 
                          {                            
                            case 200 :
                                isDeleted=true;//Generate error on deleted
                                  break;
                              default:   
                                 errorMsg="Error comunications("+xhr.status+")";                          
                          }
                          document.getElementById("d1").innerHTML="";
                          document.getElementById("d2").innerHTML="";
                          document.getElementById("d3").innerHTML="<p class='blinkr'>"+errorMsg+"</p>";
                          document.getElementById("d4").innerHTML="";
                      }
              });
        if(isDeleted)
            {
                window.open("./index.html","_self");
            }
        else
            {
                generateList();
            }
}

//Rename player
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//Get all players
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getall(){
    var options = {
        method: 'get'
        }
    alert("Enviado el GET");

    fetch(urlHost+"getall", options).then(response => {
        document.getElementById("incoming").innerHTML = response
        }).catch(error => console.error(error))
}
