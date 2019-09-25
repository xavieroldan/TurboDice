
var urlServer="http://localhost:8080/";
var idPlayer = null;



//Radio list of all players
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function radioList(){ 

    var playersList = new Array();
    var nameList = new Array();
    var urlHeader = urlServer+"getall";
    var myPlayer = { name : null, idPlayer : null};
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
                    var printList = document.getElementById("player_list") ;
                    printList.innerHTML = selectList;

                    //Detect the selected player
                    var o = document.getElementById("select_list");
                    var nameTried = o.options[o.selectedIndex].value;

                    document.getElementById("select_list").addEventListener("change",
                        function(){                            
                            nameTried = o.options[o.selectedIndex].value;
                            alert("Elegido:"+nameTried);
                                //Set the player object
                            myPlayer.name=nameTried;
                            playersList.forEach(
                                function(player)
                                {                               
                                    if(player.name==nameTried)
                                    {
                                        myPlayer.idPlayer=player.idPlayer;
                                        alert(myPlayer.name+":"+myPlayer.idPlayer);
                                    }
                                }
                            )
                        });
                        
                    




                },
        error: function(xhr, ajaxOptions, thrownError)
                {                        
                    switch (xhr.status) 
                        {
                            case 409 : 
                                alert("Error 409");
                                break;
                            default:   
                                alert("Error "+xhr.status);
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
