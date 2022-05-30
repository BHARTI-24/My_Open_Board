// back-end work
const express = require("express")  //Access
const socket = require("socket.io")   //like express -> socket is also a function to initialize

const app = express()   //the function in express is called and so that it initializes the app

app.use(express.static("public"))  //method to access the html file -> index.html which is inside the folder front-end

let port = 5000   //the port could be any like 8000, 5000,... 
let server = app.listen(port, () => {
    console.log("Listening to port" + port)
})

//connecting the socket.io
//initializing the socket
let io = socket(server)   //calling the socket function

//after connecting this will run
io.on("connection", (socket) => {
    console.log("Made socket connection")

    //to identify that the data is reached
    //here the data is received from the data (in that objects) in canvas.js
    socket.on("beginPath", (data) => {
        //data -> data from frontend
        //Now transfer data to all connected computers
        io.sockets.emit("beginPath", data)
    })
    //sending data to all receivers
    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data)
    })

    //listening to the redo Undo 
    socket.on("redoUndo", (data) => {
        io.sockets.emit("redoUndo", data)
    })
})