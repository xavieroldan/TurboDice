var urlServer="http://localhost:8080/";
var myPlayer = { name : null, idPlayer : null};
var editedPlayer = { name : null, idPlayer : null };
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
        async: false,
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
                    document.getElementById("d2").innerHTML = selectList;

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
    document.getElementById("d1").innerHTML="<p class='blinky'>Player "+myPlayer.name+" selected</p><br>";

    //Options    
    document.getElementById("d2").innerHTML="<a href='javascript:renamePlayer();'>Rename player</a>";
    document.getElementById("d3").innerHTML="<br>"+"<a href='javascript:deletePlayer();'>Delete player</a>";
    document.getElementById("d4").innerHTML="<br>"+"<a href='javascript:resetGames();'>Reset games</a>";
    document.getElementById("d5").innerHTML="<br>"+"<a href='#' onclick='#'>Play Game</a>"; 
}

//Delete player
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function deletePlayer(){
    urlRequest=urlServer+"players/"+myPlayer.idPlayer;
        
    document.getElementById("d2").innerHTML="<p>Confirm delete player, please</p>";
    document.getElementById("d3").innerHTML="<a href='javascript:deletePlayerRequest();' >Yes</a>";
    document.getElementById("d4").innerHTML="<br><a href='javascript:submenu();' >No</a>";    
    document.getElementById("d5").innerHTML="";    
}

//Delete request
function deletePlayerRequest(){
        $.ajax
        ({
                url: urlRequest,
                type: 'DELETE', 
                async: true,
                cache: false, 
                processData: false,               
                contentType: "application/json; charset=utf-8",
                dataType: "json", 
                  success: function(data)
                      {
                          //
                      alert("Data Deleted: " + data);
                      },
                  error: function(xhr, ajaxOptions, thrownError)
                     {
                         var errorMsg="";
                          switch (xhr.status) 
                          {                            
                            case 200 :
                                //TODO: Solve the generate error on deleted
                                document.getElementById("d1").innerHTML= "<p class='blinky'>Player deleted</p>";
                                document.getElementById("d2").innerHTML= "<br><a href='./index.html'>Exit</a>"; 
                                document.getElementById("d3").innerHTML= "";
                                document.getElementById("d4").innerHTML= "";
                                break;

                            default:   
                                 errorMsg="Error comunications("+xhr.status+")";
                                 document.getElementById("d1").innerHTML="";
                                 document.getElementById("d2").innerHTML="";
                                 document.getElementById("d3").innerHTML="<p class='blinkr'>"+errorMsg+"</p>";
                                 document.getElementById("d4").innerHTML="";                          
                          }                          
                      }

              });
}

//Rename player
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Set the menu and get the PUT
function renamePlayer(){
    
    urlRequest=urlServer+"players/";//set the url call
    editedPlayer.idPlayer= myPlayer.idPlayer; //Set the id

    // Set a form to receive the new name
    document.getElementById("d1").innerHTML = "<p>Input new name</p>";
    document.getElementById("d2").innerHTML = "<br><form id='rename_form' onsubmit='return setNewName()' action='javascript:void(0);'><input id='newname'required='true'maxlength='15'size='15'type='text'value=''/></form>"
    document.getElementById("d3").innerHTML="";
    document.getElementById("d4").innerHTML=""; 
    document.getElementById("d5").innerHTML=""; 
    document.getElementById('newname').focus();
    }
    

 // Setting the name (PUT)
 function setNewName(){        
    
    //Get the new name and full the object with the new name 
    var newName = document.getElementById("newname").value ;
    editedPlayer.name = newName;
    
    //Make the put request
    $.ajax
    ({            
    url: urlRequest,
    type:"PUT",
    async: true,
    cache: false, 
    processData: false,               
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(editedPlayer),
    dataType: "json", 
        success:function(data)
        {
            //Confirm the rename and exit menu
            document.getElementById("d1").innerHTML = "<p class='blinky'>Name changed</p>";
            document.getElementById("d2").innerHTML = "<br><a href='./index.html'>Exit</a>" 
        },
        error:function(xhr, ajaxOptions, thrownError)
        {
            //TODO: control the errors to exit the correct message and end  
            var output="XD"; 
            switch (xhr.status) 
            {                            
                case 409 :
                    //Duplicated name
                    output="The '"+editedPlayer.name+"' name already exists."
                    break;
                default:   
                    output = "<p class='blinkr'>Communications error:</p class='blink'><p class='blinkr'>try later</p>"
            }
            document.getElementById("d1").innerHTML = "<p class='blinkr'>"+output+"</p>";
            document.getElementById("d2").innerHTML = "<br><a href='javascript:renamePlayer();'>Try again</a>" 

        }
});    
}

//Reset games
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function resetGames(){
    urlRequest=urlServer+"players/"+myPlayer.idPlayer+"/games";
        
    document.getElementById("d2").innerHTML="<p>Confirm delete games, please</p>";
    document.getElementById("d3").innerHTML="<a href='javascript:resetGamesRequest();' >Yes</a>";
    document.getElementById("d4").innerHTML="<br><a href='javascript:submenu();' >No</a>";    
    document.getElementById("d5").innerHTML="";    
}

//Reset games request
function resetGamesRequest(){
        $.ajax
        ({
                url: urlRequest,
                type: 'DELETE', 
                async: true,
                cache: false, 
                processData: false,               
                contentType: "application/json; charset=utf-8",
                dataType: "json", 
                  success: function(data)
                      {
                        //Reset games done
                        document.getElementById("d1").innerHTML= "<p class='blinky'>Games reset done</p>";
                        document.getElementById("d2").innerHTML= "<br><a href='./index.html'>Exit</a>"; 
                        document.getElementById("d3").innerHTML= "";
                        document.getElementById("d4").innerHTML= "";
                      },
                  error: function(xhr, ajaxOptions, thrownError)
                     {
                         var errorMsg="";
                          switch (xhr.status) 
                          {                            
                            case 409 :
                                //Server catch error unable to delete
                                document.getElementById("d1").innerHTML="";
                                document.getElementById("d2").innerHTML="";
                                document.getElementById("d3").innerHTML="<p class='blinkr'>Unable to reset</p><p class='blinkr>games for "+myPlayer.name+"</p>";
                                document.getElementById("d4").innerHTML="";                                
                                break;

                            default:   
                                 errorMsg="Error comunications("+xhr.status+")";
                                 document.getElementById("d1").innerHTML="";
                                 document.getElementById("d2").innerHTML="";
                                 document.getElementById("d3").innerHTML="<p class='blinkr'>"+errorMsg+"</p>";
                                 document.getElementById("d4").innerHTML="";                          
                          }                          
                      }
              });
}



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
