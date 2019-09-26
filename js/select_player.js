
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
    
    editName.innerHTML="<a href='#' href='javascript:renamePlayer();'>Rename player</a>";
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


function renamePlayer()
{
    var isRenamed= false;
    var myObj = { name : null, idPlayer : null };
    urlRequest=urlServer+"players/";
    //TODO: Set a form to receive the new name
    
    
    
    myObj.idPlayer= myPlayer.idPlayer; //Set the id
    //TODO: get the new name and full the myObjt with the new name  

    

    $.ajax
    ({
            
        url= urlRequest,
        type:"PUT",
        async: true,
        cache: false, 
        processData: false,               
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(myObj),
        // dataType: "json", 
            success:function(data)
            {
                //TODO: confirm the rename and exit menu
                alert(data)
            },
            error:function(xhr, ajaxOptions, thrownError)
            {
                //TODO: control the errors to exit the correct message and end  
                var errorMsg=""; 
                switch (xhr.status) 
                {                            
                    case 200 :
                        alert("200")
                        isDeleted=true;//Generate error on deleted and return to the form again to put the new name
                        break;
                    default:                         
                        errorMsg="Error comunications("+xhr.status+")";
                        alert(errorMsg);                      
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
