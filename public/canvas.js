let canvas = document.querySelector("canvas")
//adjusting the canvas width and height
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let pencilColor = document.querySelectorAll(".pencil-color")
let pencilWidthElem = document.querySelector(".pencil-width")
let eraserWidthElem = document.querySelector(".eraser-width")
let download = document.querySelector(".download")
//accessing of the buttons - undo and redo
let redo = document.querySelector(".redo")
let undo = document.querySelector(".undo")

let penColor = "black"
let eraserColor = "white"
let penWidth = pencilWidthElem.value
let eraserWidth = eraserWidthElem.value


//to available the undo and redo
let undoRedoTracker = []    //data 
let track = 0    //represent which action from tracker array

let mouseDown = false



//first to begin path (where to begin line)
//say tool is an API = on which the graphics is performed 
let tool = canvas.getContext("2d")

//styling the line or the graphic
tool.strokeStyle = penColor
tool.lineWidth = penWidth


// tool.beginPath()  //new graphics (path) (line)
// tool.moveTo(10, 10)  //start point
// tool.lineTo(100, 150)   //end point
// tool.stroke()    //to fill the color in the line or in the graphics

//here since beginPath is used only once so when we give these other dimensions to the lineTo to determine where line should drawn, the line is going to start from the vertex where the first line has ended 
//therfore to start a new line from the other end rather then the end of the first line the beginPath again shall be written

//i.e from old path the new path will start if beginPath has only mentiones once 
// tool.beginPath()
// tool.moveTo(30, 30)
//and again these two line shall be written
// tool.lineTo(200, 200)
// tool.stroke()

//1.drawing

//mousedown -> start new path, mousemove -> path fill (graphics)

canvas.addEventListener("mousedown", (e) => {
    mouseDown = true

    // beginPath({
    //     x: e.clientX,
    //     y: e.clientY
    // })
    let data = {
        x: e.clientX,
        y: e.clientY
    }

    socket.emit("beginPath", data)

    // tool.beginPath()
    // tool.moveTo(e.clientX, e.clientY)    //e.clientX and e.clientY represents the value given by mouse clicking in the horizontal direction and the value given by clicking in the vertical direction resp.
})

canvas.addEventListener("mousemove", (e) => {
    //to fill the graphics till the mouse is moving as it was down

    if (mouseDown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        }
        socket.emit("drawStroke", data)
    }

    // tool.lineTo(e.clientX, e.clientY)
    // tool.stroke()

    // drawStroke({
    //         x: e.clientX,
    //         y: e.clientY,
    //         color: eraserFlag ? eraserColor : penColor,
    //         width: eraserFlag ? eraserWidth : penWidth
    //     })
})
canvas.addEventListener("mouseup", (e) => {
    mouseDown = false
    //here -> some graphics is already performed
    let url = canvas.toDataURL()
    undoRedoTracker.push(url)  //pushing the current state to the tracker
    track = undoRedoTracker.length - 1   //therefore the current element(last element) is in the track after the graphics is over
})

//performing actions on the undo redo buttons
undo.addEventListener("click", (e) => {
    //for undo if the track say is on 3 then the track would be decreased(--) i.e when performed the ttrack should be on 2 and 1 and 0..

    if (track > 0) track--;   // > 0 because it couldn't be -1
    // track action
    let data = {   //object to pass
        trackValue: track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj)

    //sending data to server
    socket.emit("redoUndo", data)

})

redo.addEventListener("click", (e) => {
    //for redo the track'd be increased(++) i.e if the track is on 0 then it should increased to 1, 2, 3 ...since the length of tracker array'd be 3 it cannot increase to more than 3..

    if (track < undoRedoTracker.length - 1) track++
    //track action
    let data = {   //object to pass
        trackValue: track,
        undoRedoTracker
    }

    // undoRedoCanvas(trackObj)

    socket.emit("redoUndo", data)
})

//action on undo redo
function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue
    undoRedoTracker = trackObj.undoRedoTracker

    let url = undoRedoTracker[track]
    let img = new Image()   //new image reference element is created
    img.src = url    //url is taken from undoredotracker //i.e the previous graphical imagre or action will be shown or we can say in (img.src -> url is stored which represents the previous data) 
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
    //tool represents current canavas on ehich the previous action is performed
}


//* beginPath and drawStroke functions...
function beginPath(strokeObj) {
    tool.beginPath()
    tool.moveTo(strokeObj.x, strokeObj.y)
}
function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color
    tool.lineWidth = strokeObj.width
    tool.lineTo(strokeObj.x, strokeObj.y)
    tool.stroke()
}


//use forEach loop to all the colors to access by the pencil
pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0]
        penColor = color
        tool.strokeStyle = penColor  //here the color will be changed 
    })
})

//to access the width of the pencil..
pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value
    tool.lineWidth = penWidth
})

eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value
    tool.lineWidth = eraserWidth
})

//eraser class is already accessed in the tools.js
//here to give eraser a color white so that it overrides the other colors and erase them
eraser.addEventListener("click", (e) => {
    //getting the function described earlier in tools.js
    //checking the width for the eraser and change the color and width

    //if the eraserFlag is clicked(true) then the eraser color ... is enabled otherwise the style and width'd be of the pencil (i.e after removing the eraser ofcourse the pencil will be enabled on the board)
    if (eraserFlag) {
        tool.strokeStyle = eraserColor
        tool.lineWidth = eraserWidth
    } else {
        tool.strokeStyle = penColor
        tool.lineWidth = penWidth
    }
})

//applying download feature to the board, while clicking the board will be downloaded
download.addEventListener("click", (e) => {
    let url = canvas.toDataURL()

    let a = document.createElement("a")
    a.href = url
    a.download = "board.jpg"
    a.click()
})

//to check that the data is send by server is received or not

socket.on("beginPath", (data) => {
    //data -> data from server
    beginPath(data)
})

//listening when the data is received
socket.on("drawStroke", (data) => {
    drawStroke(data)
})

socket.on("redoUndo", (data) => {
    undoRedoCanvas(data)
})