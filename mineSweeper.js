/*
TO DO
- Remove all mines when new table generated
- Timer
- Popup
*/
// D O M 



const table = document.querySelector("#table")
const button = document.querySelector("#genButton")

const row = document.querySelector("#row")
const col = document.querySelector("#col")

const difficulty = document.querySelector("#difficulty")

const popUp = document.querySelector(".popup")
const popUpBtn = document.querySelector("#popupBtn")

popUpBtn.addEventListener("click",popUpBtnClick)

//Timers

let startDate
let endDate




button.addEventListener("click",generateClick)

//Turn off contextmenu
table.addEventListener('contextmenu', event => {
    onrightClick(event)
    event.preventDefault()
});


// C L A S S E S
class Mine {
    x
    y

    constructor(x,y){
        this.x = x
        this.y = y
    }
}


// V A R I A B L E S


mineList = []
let numberOfCellsLeft

// F U N C T I O N S

function generateClick(e){
    generateTable()
    generateMines()
    startDate = new Date().getTime()
}

// Create the table elements

function generateTable(e){


    table.innerHTML = ""
    table.addEventListener("click",onTableClick)
    table.classList.remove("shaking")

    let rowNumber = parseInt(row.value)
    let colNumber = parseInt(col.value)


    for(let i = 0; i < rowNumber; i++){
        let newRow = table.insertRow()
        for(let j = 0; j < colNumber; j++){
            let newCol = document.createElement("td")
            newCol.innerText = i * j
            newRow.insertCell(newCol)
        }
    }


}

// Generating mines based on number of cells and difficulty

function generateMines(){
    

    // Difficulty
    /*
    In every X block there will be 1 mine
    Easy = 1/5
    Medium = 1/4
    Hard = 1/3
    */
    let dif = parseInt(getDifficulty())
    
    let numberOfMines = Math.floor((row.value * col.value) / dif)

    numberOfCellsLeft = (row.value * col.value) - numberOfMines

    for(let i = 0; i < numberOfMines; i++){
        mineList.push(selectNewMine(row.value,col.value))
        console.log(mineList[i])
    }

    console.log(mineList)
}

function getDifficulty(){
    
    let options = difficulty.children

    for(let i = 0; i < 3; i++){
        if(options[i].selected == true){
            if(i == 0){return 5}
            if(i == 1){return 4}
            if(i == 2){return 3}
        }
    }
}

// Select a new mine randomly, check if that cell has a mine on it

function selectNewMine(row,col){
    
    let validPosition = false
    let first
    let second
    
    while(!validPosition){
        
        first = Math.floor(Math.random() * col)
        second = Math.floor(Math.random() * row)


        if(!checkMineListContains(first,second)){
            validPosition = true
        }
    }
    let newMine = new Mine(parseInt(first),parseInt(second))
    return newMine    
}

// Checking if the list MineList contains a mine with the same position as the parameter

function checkMineListContains(x,y){
    if(x < 0 || x > col.value || y < 0 || row.value < y){
        return false
    }
    else{
        for(let i = 0; i < mineList.length; i++){
            if(mineList[i].x == x && mineList[i].y == y){
                console.log("checkMineListContains("+ x + "," + y + ") returning: true")
                return true
            }
        }
        console.log("checkMineListContains("+ x + "," + y + ") returning: false")
        return false
    }
}

function onrightClick(e){
    const td = e.target.closest("td")

    const x = td.cellIndex
    const y = td.parentNode.rowIndex

    if(td.classList.contains("flag")){
        td.classList.remove("flag")
    }
    else if(!td.classList.contains("clear") && !td.classList.contains("mine")){
        td.classList.add("flag")
    }
}


// T A B L E  C L I C K

function onTableClick(e){


    const td = e.target.closest("td")

    const x = td.cellIndex
    const y = td.parentNode.rowIndex

    if(td.classList.contains("flag")){return}
    if(checkMineListContains(x,y)){
        td.classList.add("mine")
        
        gameOver()
    }
    else{

        /*
        Todo:
            - Clear multiple blocks on click like in the real game
        */

        //Check if that cell has already been clicked
        if(td.classList.contains("clear")){

        }
        else{

            clearCells(td,x,y)

            
            //td.classList.add("clear")
            if(numberOfCellsLeft == 0){
                gameWin()
            }
        }

    }

}


function popUpBtnClick(){
    popUpBtn.hidden = true
    popUp.hidden = true

}



//When mine is clicked on

function gameOver(){
    


    table.classList.add("shaking")
    table.removeEventListener("click",onTableClick)
    
    const message = "GAME OVER"
    popUp(message)
    //GAME OVER SIGN
}

//When numberOfCellsLeft reaches 0

function gameWin(){

    endDate = new Date().getTime()
    const timer = endDate - startDate
    var minutes = (Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60))).toString()
    var seconds = (Math.floor((timer % (1000 * 60)) / 1000)).toString()
    if(seconds.length == 1){
        seconds = 0 + seconds
    }
    popUp.hidden = false
    popUpBtn.hidden = false
    popUp.innerText = "YOU WIN\nTime " + minutes + ":" + seconds
    popUp.classList.add("popupAnimation")
    popUpBtn.classList.add("popupAnimation")
}


// Clear multiple cells when there are nearby cells that are also clear but not yet clicked
// onClearClick clear all cells with value 0


function clearCells(td,x,y){

    //console.log("clearcell:" + x + " " + y)

    if(x < 0 || y < 0 || x >= col.value || y >= row.value){
        //console.log("Out of bounds: " + x + " " + y)
        return
    }
    if(td.classList.contains("clear")){
        //console.log("Out of bounds: " + x + " " + y)
        return
    }

    td.innerText = addClearValue(x,y)
    td.classList.add("clear")
    numberOfCellsLeft = numberOfCellsLeft - 1

    let tr = td.parentNode
    let prevTr = table.rows[y-1]
    let nextTr = table.rows[y+1]

    let canRight = false
    let canLeft = false


    //call clearcells on border
    if(td.innerText == 0){
        if(x < col.value-1){
            //Right
            canRight = true
            clearCells(tr.children[x+1],x+1,y)
        }
        if(x > 0){
            //Left
            canLeft = true
            clearCells(tr.children[x-1],x-1,y)
        }
        if(y > 0){
            //Up
            clearCells(prevTr.cells[x],x,y-1)
            if(canLeft){
                clearCells(prevTr.cells[x-1],x-1,y-1)
            }
            if(canRight){
                clearCells(prevTr.cells[x+1],x+1,y-1)
            }
        }
        if(y < row.value-1){
            //Down
            clearCells(nextTr.cells[x],x,y+1)
            if(canLeft){
                console.log(x + " " + y + " " + prevTr)
                clearCells(nextTr.cells[x-1],x-1,y+1)
            }
            if(canRight){
                console.log(x + " " + y)
                clearCells(nextTr.cells[x+1],x+1,y+1)
            }
        }
        
        
    }
    

}


// Show how many mines are nearby
function addClearValue(x,y){
    let result = 0
    for(let i = x-1; i <= x+1; i++){
        for(let j = y-1 ; j <= y+1; j++){
            if(checkMineListContains(i,j)){result++}
        }
    }
    if(result == 0){result = ""}
    return result
}