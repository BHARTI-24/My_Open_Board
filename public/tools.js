let optionsCont = document.querySelector(".option-cont")
let toolsCont = document.querySelector(".tools-cont")
let pencilToolCont = document.querySelector(".pencil-tool-cont")
let eraserToolCont = document.querySelector(".eraser-tool-cont")
let pencil = document.querySelector(".pencil")
let eraser = document.querySelector(".eraser")
let sticky = document.querySelector(".sticky")
let upload = document.querySelector(".upload")



let pencilFlag = false
let eraserFlag = false
let optionsFlag = true   //denote that the menu is active

//true -> tools show, false -> hide tools
optionsCont.addEventListener("click", (e) => {
    optionsFlag = !optionsFlag

    if (optionsFlag) openTools();
    else closeTools();
    // let iconElem = optionsCont.children(e)

})

//removing of menu button when clicked and showing of the times btn
function openTools() {
    let iconElem = optionsCont.children[0]
    iconElem.classList.remove("fa-times")
    iconElem.classList.add("fa-bars")
    toolsCont.style.display = "flex"
}

function closeTools() {
    let iconElem = optionsCont.children[0]
    iconElem.classList.remove("fa-bars")
    iconElem.classList.add("fa-times")
    toolsCont.style.display = "none"
    pencilToolCont.style.display = "none"   //the coloring and range bar
    eraserToolCont.style.display = "none"   //the coloring and range bar

}

pencil.addEventListener("click", (e) => {
    //true -> show pencil tool
    //false -> hide pencil tool
    pencilFlag = !pencilFlag

    if (pencilFlag) pencilToolCont.style.display = "block"
    else pencilToolCont.style.display = "none"
})

eraser.addEventListener("click", (e) => {
    //true -> show eraser tool
    //false -> hide eraser tool
    eraserFlag = !eraserFlag

    if (eraserFlag) eraserToolCont.style.display = "flex"
    else eraserToolCont.style.display = "none"
})

//upload listener
upload.addEventListener("click", (e) => {
    //first to open file explorer
    let input = document.createElement("input")
    input.setAttribute("type", "file")
    input.click()

    input.addEventListener("change", (e) => {
        let file = input.files[0]   //0 index indicates the first file (upload image)
        let url = URL.createObjectURL(file)

        let stickyTemplateHTML = `
        <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src ="${url}" />
        </div>`
        createSticky(stickyTemplateHTML)

        
    })


})


sticky.addEventListener("click", (e) => {
    let stickyTemplateHTML = `
    <div class="header-cont">
    <div class="minimize"></div>
    <div class="remove"></div>
    </div>
    <div class="note-cont">
       <textarea spellcheck="false"></textarea>
    </div>`
    createSticky(stickyTemplateHTML)
})


function createSticky(stickyTemplateHTML){
    let stickyCont = document.createElement("div")

        stickyCont.setAttribute("class", "sticky-cont")
        stickyCont.innerHTML = stickyTemplateHTML
        document.body.appendChild(stickyCont)

        let minimize = stickyCont.querySelector(".minimize")
        let remove = stickyCont.querySelector(".remove")
        noteActions(minimize, remove, stickyCont)


        stickyCont.onmousedown = function (event) {

            dragNDrop(stickyCont, event)

        };

        stickyCont.ondragstart = function () {
            return false;
        };
}

//function on note -> remove the note or to minimize the note
function noteActions(minimize, remove, stickyCont) {
    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    })
    minimize.addEventListener("click", (e) => {
        let noteCont = stickyCont.querySelector(".note-cont")  //in note-cont ony textarea is included
        let display = getComputedStyle(noteCont).getPropertyValue("display")
        if (display === "none") noteCont.style.display = "block"
        else noteCont.style.display = "none"
    })
}


function dragNDrop(element, event) {  //event = e
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}
