var table = document.getElementsByTagName("table")[0];
var allTiles = document.getElementsByClassName("tile");


var startingTilesBlack = document.getElementsByClassName("lowRow tile");
var startingTilesRed = document.getElementsByClassName("highRow tile");

for(var i = 0; i < startingTilesBlack.length; i++)
{
    startingTilesBlack[i].classList.remove("noPiece");
    startingTilesRed[i].classList.remove("noPiece");

    var newBPiece = document.createElement("div");
    var newRPiece = document.createElement("div");

    var imageRed = document.createElement("img");
    var imageBlack = document.createElement("img");
    
    newBPiece.classList.add("bPiece");
    newRPiece.classList.add("rPiece");

    imageBlack.classList.add("bCrown");
    imageBlack.classList.add("invisibleCrown");
    imageBlack.src = "images/blackCrown.png";

    imageRed.classList.add("rCrown");
    imageRed.classList.add("invisibleCrown");
    imageRed.src = "images/redCrown.jpg";

    newRPiece.appendChild(imageRed);
    newBPiece.appendChild(imageBlack); 

    startingTilesBlack[i].appendChild(newBPiece);
    startingTilesRed[i].appendChild(newRPiece);
}

//red always goes first, so starting condition for each game will be redTurn = true;
var socket = io();

var theRedPlayer;
var theBlackPlayer;

var theRoom;

    
socket.on("assignPlayers", function(room)
{
    if(room.client1 == socket.id)
        theRedPlayer = socket.id;
    else
        theBlackPlayer = socket.id;
    theRoom = room;
    playRedTurn();
});

socket.on("aPlayerDisconnected", function()
{
    document.getElementsByClassName("gameInstructions")[0].textContent = "opponent has disconnected, so we have disconnected you as well";
    socket.disconnect();
});
socket.on("serverFull", function()
{
    document.getElementsByClassName("gameInstructions")[0].textContent = "server is full, you have been disconnected";
    socket.disconnect();
});
socket.on("redNcapture", function(boardChanges)
{
    console.log("Client is doing changes to html");
    let thePieceToMove = document.getElementById(boardChanges.pieceId).firstElementChild;
    let theTileToMoveTo = document.getElementById(boardChanges.tileToId);

    thePieceToMove.parentElement.classList.add("noPiece");
    thePieceToMove.parentElement.removeChild(thePieceToMove);

    theTileToMoveTo.classList.remove("noPiece");
    theTileToMoveTo.appendChild(thePieceToMove);

    if(theTileToMoveTo.classList.contains("botRow"))
        thePieceToMove.firstElementChild.classList.remove("invisibleCrown");
    playBlackTurn();
});
socket.on("redCapture", function(boardChanges)
{
    let thePieceToMove = document.getElementById(boardChanges.pieceId).firstElementChild;
    let theTileToMoveTo = document.getElementById(boardChanges.tileToId);
    let IdOfTile = boardChanges.capturedId;

    document.getElementById(IdOfTile).firstElementChild.remove();
    document.getElementById(IdOfTile).classList.add("noPiece");

    thePieceToMove.parentElement.classList.add("noPiece");
    thePieceToMove.parentElement.removeChild(thePieceToMove);

    theTileToMoveTo.classList.remove("noPiece");
    theTileToMoveTo.appendChild(thePieceToMove);

    if(theTileToMoveTo.classList.contains("botRow"))
        thePieceToMove.firstElementChild.classList.remove("invisibleCrown");

    if(document.getElementsByClassName("bPiece").length < 1)
    {
        var turnInfo = document.getElementsByClassName("gameInstructions")[0];
        turnInfo.textContent = "Red has won!!";

        document.querySelectorAll(".rPiece").forEach(function(piece)
        {
            piece.removeEventListener("click", pieceListenerMethodBlack);
        });
        document.querySelectorAll(".noPiece").forEach(function(tile)
        {
            tile.removeEventListener("click", tileListenerMethodBlack);
        }); 
    }   
    else
        playBlackTurn();
});
socket.on("blackNcapture", function(boardChanges)
{
    console.log("Client is doing changes to html");
    let thePieceToMove = document.getElementById(boardChanges.pieceId).firstElementChild;
    let theTileToMoveTo = document.getElementById(boardChanges.tileToId);

    thePieceToMove.parentElement.classList.add("noPiece");
    thePieceToMove.parentElement.removeChild(thePieceToMove);

    theTileToMoveTo.classList.remove("noPiece");
    theTileToMoveTo.appendChild(thePieceToMove);

    if(theTileToMoveTo.classList.contains("topRow"))
        thePieceToMove.firstElementChild.classList.remove("invisibleCrown");
    playRedTurn();
});
socket.on("blackCapture", function(boardChanges)
{
    let thePieceToMove = document.getElementById(boardChanges.pieceId).firstElementChild;
    let theTileToMoveTo = document.getElementById(boardChanges.tileToId);
    let IdOfTile = boardChanges.capturedId;

    document.getElementById(IdOfTile).firstElementChild.remove();
    document.getElementById(IdOfTile).classList.add("noPiece");

    thePieceToMove.parentElement.classList.add("noPiece");
    thePieceToMove.parentElement.removeChild(thePieceToMove);

    theTileToMoveTo.classList.remove("noPiece");
    theTileToMoveTo.appendChild(thePieceToMove);

    if(theTileToMoveTo.classList.contains("topRow"))
        thePieceToMove.firstElementChild.classList.remove("invisibleCrown");

    if(document.getElementsByClassName("rPiece").length < 1)
    {
        var turnInfo = document.getElementsByClassName("gameInstructions")[0];
        turnInfo.textContent = "Black has won!!";

        document.querySelectorAll(".bPiece").forEach(function(piece)
        {
            piece.removeEventListener("click", pieceListenerMethodBlack);
        });
        document.querySelectorAll(".noPiece").forEach(function(tile)
        {
            tile.removeEventListener("click", tileListenerMethodBlack);
        }); 
    }   
    else 
        playRedTurn();
});

function playRedTurn()
{
    var turnInfo = document.getElementsByClassName("gameInstructions")[0];
    turnInfo.classList.remove("b");
    turnInfo.classList.add("r");
    turnInfo.textContent = "It's red's turn";

    document.querySelectorAll(".bPiece").forEach(function(piece)
    {
        piece.removeEventListener("click", pieceListenerMethodBlack);
    });
    document.querySelectorAll(".noPiece").forEach(function(tile)
    {
        tile.removeEventListener("click", tileListenerMethodBlack);
    });

    if(socket.id == theRedPlayer)
    {
        document.querySelectorAll(".rPiece").forEach(function(piece)
        {
            piece.addEventListener("click", pieceListenerMethodRed)
        });
    }
}
function playBlackTurn()
{
    var turnInfo = document.getElementsByClassName("gameInstructions")[0];
    turnInfo.classList.remove("r");
    turnInfo.classList.add("b");
    turnInfo.textContent = "It's black's turn";

    document.querySelectorAll(".rPiece").forEach(function(piece)
    {
        piece.removeEventListener("click", pieceListenerMethodRed);
    });
    document.querySelectorAll(".noPiece").forEach(function(tile)
    {
        tile.removeEventListener("click", tileListenerMethodRed);
    });

    if(socket.id == theBlackPlayer)
    {
        document.querySelectorAll(".bPiece").forEach(function(piece)
        {
            piece.addEventListener("click", pieceListenerMethodBlack)
        });
    }
}

function tileListenerMethodBlack()
{
    theTileToMoveTo = this; 

    var rowOfPiece = parseInt(thePieceToMove.parentElement.id.substring(0,1));
    var colOfPiece = parseInt(thePieceToMove.parentElement.id.substring(1));
    var rowOfTile = parseInt(theTileToMoveTo.id.substring(0,1));
    var colOfTile = parseInt(theTileToMoveTo.id.substring(1));
    
    var rowOfPotentialEnemy = (rowOfPiece + rowOfTile)/2;
    var colOfPotentialEnemy = (colOfPiece + colOfTile)/2;
    var IdOfTile = rowOfPotentialEnemy.toString() + colOfPotentialEnemy.toString();

    var theBoardChanges = {
        pieceId: thePieceToMove.parentElement.id,
        tileToId: theTileToMoveTo.id,
        capturedId: IdOfTile,
        channel: theRoom
    }

    var style = getComputedStyle(thePieceToMove.firstElementChild);
    if(style.visibility === "hidden")
    {
        switch((rowOfTile - rowOfPiece))
        {
            case -1:
            {
                if((colOfTile === (colOfPiece - 1) || colOfTile === (colOfPiece + 1)) && theTileToMoveTo.classList.contains("noPiece"))
                {
                    socket.emit("blackNcapture", theBoardChanges);
                }
                break;
            }
                
            case -2:
            {
                if((colOfTile === (colOfPiece + 2)) || (colOfTile === (colOfPiece - 2)) && theTileToMoveTo.classList.contains("noPiece"))
                {
                    if(document.getElementById(IdOfTile).firstElementChild.classList.contains("rPiece"))
                        socket.emit("blackCapture", theBoardChanges);
                    break;
                }
                break;
            } 
        }
    }
    else
    {
        switch((rowOfTile - rowOfPiece))
        {
            case -1:
            case 1:
            {
                if((colOfTile === (colOfPiece - 1) || colOfTile === (colOfPiece + 1)) && theTileToMoveTo.classList.contains("noPiece"))
                    socket.emit("blackNcapture", theBoardChanges);
                break;
            }
            case -2:
            case 2:
            {
                if((colOfTile === (colOfPiece - 2)) || (colOfTile === (colOfPiece + 2)))
                {
                    if(document.getElementById(IdOfTile).firstElementChild.classList.contains("rPiece"))
                        socket.emit("blackCapture", theBoardChanges);
                    break;
                }
                    
            }
        }
    }
}
function tileListenerMethodRed()
{
    theTileToMoveTo = this; 

    var rowOfPiece = parseInt(thePieceToMove.parentElement.id.substring(0,1));
    var colOfPiece = parseInt(thePieceToMove.parentElement.id.substring(1));
    var rowOfTile = parseInt(theTileToMoveTo.id.substring(0,1));
    var colOfTile = parseInt(theTileToMoveTo.id.substring(1));

    var rowOfPotentialEnemy = (rowOfPiece + rowOfTile)/2;
    var colOfPotentialEnemy = (colOfPiece + colOfTile)/2;
    var IdOfTile = rowOfPotentialEnemy.toString() + colOfPotentialEnemy.toString();

    var theBoardChanges = {
        pieceId: thePieceToMove.parentElement.id,
        tileToId: theTileToMoveTo.id,
        capturedId: IdOfTile,
        channel: theRoom
    }

    var style = getComputedStyle(thePieceToMove.firstElementChild);
    if(style.visibility === "hidden")
    {
        switch((rowOfTile - rowOfPiece))
        {
            case 1:
            {
                if((colOfTile === (colOfPiece - 1) || colOfTile === (colOfPiece + 1)) && theTileToMoveTo.classList.contains("noPiece"))
                {
                    console.log("red player has emitted boardChanges to server");
                    socket.emit("redNcapture", theBoardChanges);
                }
                    
                break;
            }
            case 2:
            {
                if((colOfTile === (colOfPiece - 2)) || (colOfTile === (colOfPiece + 2)))
                {
                    if(document.getElementById(IdOfTile).firstElementChild.classList.contains("bPiece"))
                        socket.emit("redCapture", theBoardChanges);
                    break;
                }
            }
        }   
    }    
    else
    {
        switch((rowOfTile - rowOfPiece))
        {
            case -1:
            case 1:
            {
                if((colOfTile === (colOfPiece - 1) || colOfTile === (colOfPiece + 1)) && theTileToMoveTo.classList.contains("noPiece"))
                    socket.emit("redNcapture", theBoardChanges);
                break;    
            }
            case -2:
            case 2:
            {
                if((colOfTile === (colOfPiece - 2)) || (colOfTile === (colOfPiece + 2)))
                {
                    if(document.getElementById(IdOfTile).firstElementChild.classList.contains("bPiece"))
                        socket.emit("redCapture", theBoardChanges);
                    break;
                }
            } 
                
        }
    }
}    
function pieceListenerMethodRed()
{
    thePieceToMove = this;
    document.querySelectorAll(".noPiece").forEach(function(tile)
    {
        tile.addEventListener("click", tileListenerMethodRed)
    });
}
function pieceListenerMethodBlack()
{
    thePieceToMove = this;
    document.querySelectorAll(".noPiece").forEach(function(tile)
    {
        tile.addEventListener("click", tileListenerMethodBlack);
    });
}