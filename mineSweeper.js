// D O M 

const table = document.querySelector("#table")
const button = document.querySelector("#genButton")

const row = document.querySelector("#row")
const col = document.querySelector("#col")

const difficulty = document.querySelector("#difficulty")


button.addEventListener("click",generateClick)


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
    for(let i = 0; i < mineList.length; i++){
        if(mineList[i].x == x && mineList[i].y == y){
            console.log("checkMineListContains("+ x + "," + y + ") returning: true")
            return true
        }
    }
    console.log("checkMineListContains("+ x + "," + y + ") returning: false")
    return false
}



// T A B L E  C L I C K

function onTableClick(e){
    const td = e.target.closest("td")

    const x = td.cellIndex
    const y = td.parentNode.rowIndex

    if(checkMineListContains(x,y)){
        td.classList.add("mine")
        gameOver()
    }
    else{

        /*
        Todo:
            - Clear multiple blocks on click like in the real game
        */


        if(td.classList.contains("clear")){

        }
        else{
            numberOfCellsLeft = numberOfCellsLeft - 1
            td.classList.add("clear")
            if(numberOfCellsLeft == 0){
                gameWin()
            }
        }
        
        console.log(numberOfCellsLeft)
        
    }

}

//

function gameOver(){
    
    table.classList.add("shaking")
    table.removeEventListener("click",onTableClick)
    
    const message = "GAME OVER"
    popUp(message)
    //GAME OVER SIGN
}

//

function gameWin(){


    const message = "YOU WIN"
    popUp(message)
}

function popUp(message){

}