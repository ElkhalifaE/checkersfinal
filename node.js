const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
server.listen(process.env.PORT || 3000);


app.use(express.static(__dirname + "/public"));


app.get("/", function(req, res)
{
    res.sendFile(__dirname + "/public/index.html");
});


var rooms = new Array(10);//array of Strings, created after odd connection count, 1, 3, 5 etc. rooms[x] = "roomx";
for(let i = 0; i < rooms.length; i++)
    rooms[i] = {
        name:"rooms" + i.toString(), 
        playersAssigned:false, 
        client1:null, 
        client2:null
    };
io.on("connection", function(socket)
{
    var noSpotsAvailable = true;
    for(var i = 0; i < rooms.length; i++)
    {
        if(rooms[i].client1 == null)
        {
            noSpotsAvailable = false;
            socket.join(rooms[i].name);
            rooms[i].client1 = socket.id;
            break;
        } 
        else if(rooms[i].client2 == null)
        {
            noSpotsAvailable = false;
            socket.join(rooms[i].name);
            rooms[i].client2 = socket.id;
            break;
        } 
    }
    if(noSpotsAvailable)
        io.to(socket.id).emit("serverFull");
    for(var i = 0; i < rooms.length; i++)
    {
        if(rooms[i].client1 != null && rooms[i].client2 != null && rooms[i].playersAssigned == false)
        {
            console.log()
            rooms[i].playersAssigned = true;
            var room = rooms[i]
            io.to(rooms[i].name).emit("assignPlayers", room);
        }
    }
    socket.on("blackNcapture", function(boardChanges)
    {
        io.to(boardChanges.channel.name).emit("blackNcapture", boardChanges);
    });
    socket.on("blackCapture", function(boardChanges)
    {
        io.to(boardChanges.channel.name).emit("blackCapture", boardChanges);
    });
    socket.on("redNcapture", function(boardChanges)
    {
        io.to(boardChanges.channel.name).emit("redNcapture", boardChanges);
    });
    socket.on("redCapture", function(boardChanges)
    {
        io.to(boardChanges.channel.name).emit("redCapture", boardChanges);
    });
    //closes all connections, if one of the 2 clients disconnect
    socket.on("disconnect", function()
    {
        for(var i = 0; i < rooms.length; i++)
        {
            if(rooms[i].client1 == socket.id)//there is only one member of the room disconnecting
            {
                io.to(rooms[i].client2).emit("aPlayerDisconnected");
                rooms[i].client2 = null;
                rooms[i].client1 = null;
                rooms[i].playersAssigned = false;
            }
            else if(rooms[i].client2 == socket.id)
            {
                io.to(rooms[i].client1).emit("aPlayerDisconnected");
                rooms[i].client2 = null;
                rooms[i].client1 = null;
                rooms[i].playersAssigned = false;
            }
        }
    });
    // a client waiting for a second client can only stay connected for 30 minutes
    // or a client in a game can only stay connected for 30 minutes
    setTimeout(function()
    {
        socket.disconnect();
    }, 1800000);
});
    

