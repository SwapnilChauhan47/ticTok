let gameBoard;

let humanPlayer = 'O';
let compPlayer = 'X'; 

const winningCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];


const cells = document.querySelectorAll('.cell');

startGame();

function selectSyn(syn){
    humanPlayer = syn;
    compPlayer = syn==='O' ? 'X' : 'O';
    gameBoard = Array.from(Array(9).keys());
    
    for(let i = 0; i< cells.length;i++){
        cells[i].addEventListener('click',turnClick,false)
    }
    if (compPlayer === 'X') {
    turn(bestSpot(),compPlayer);
  }
  document.querySelector('.selectSyn').style.display = "none";
    
}

function startGame(){
    document.querySelector('.endgame').style.display = 'none';
    document.querySelector('.endgame .text').innerText ="";
    document.querySelector('.selectSyn').style.display = "block";
    for(var i = 0; i< cells.length;i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
    }
}

function turnClick(square){
    if(typeof gameBoard[square.target.id] === 'number'){
        turn(square.target.id,humanPlayer);
        if (!checkWin(gameBoard, humanPlayer) && !checkTie())  
            turn(bestSpot(), compPlayer);
    }    
}

function turn(squareId,player){
    gameBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    let gameWon = checkWin(gameBoard,player);
    if(gameWon){
        gameOver(gameWon);}
        checkTie();
}

function checkWin(board,player){
    
    let plays = board.reduce((a,e,i) => (e === player) ? a.concat(i) : a , [] );
//    console.log("plays", plays)
    let gameWon = null;
    
    for(let [index,win] of winningCombination.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
               gameWon = {
               index : index,
               player: player
               };break;
           }
        }
    return gameWon;
    }
           
function gameOver(gameWon){
            for(let index of winningCombination[gameWon.index]){
                document.getElementById(index).style.backgroundColor = 
                    gameWon.player == humanPlayer? "lightgreen" : "red";
            }
            
            for ( let i = 0 ; i< cells.length ; i++){
                cells[i].removeEventListener('click',turnClick,false);
            }
        declareWinner( gameWon.player == humanPlayer? "You Won !" : "You Lose." )
        }

function emptySquares(){
    return gameBoard.filter((elm,i) => i === elm);
}

function bestSpot(){
    return minMax(gameBoard,compPlayer).index;
}

function checkTie(){
    if(emptySquares().length === 0){
        for(cell of cells){
            cell.style.backgroundColor = "orange";
            cell.removeEventListener('click',turnClick,false)
        }
        declareWinner("Game Tie");
        return true;
    }
    return false;
}

function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function minMax(newBoard,player){
    var availSpots = emptySquares(newBoard);
    
    if(checkWin(newBoard, humanPlayer)){
        return {score: -10};
    }else if(checkWin(newBoard,compPlayer)){
        return {score: 10};
    }else if(availSpots.length === 0){
        return {score: 0};
    }
    
    var moves = [];
    for (let i = 0; i < availSpots.length; i++){
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;
        
        if(player === compPlayer){
            move.score = minMax(newBoard,humanPlayer).score;
        }
        else{
            move.score = minMax(newBoard,compPlayer).score;
        }
        newBoard[availSpots[i]] = move.index;
        
        if ((player === compPlayer && move.score === 10) || (player === humanPlayer && move.score === -10)){
            return move;}
    else 
      moves.push(move);      
    }
        
        let bestScore,bestMove;
        if(player === compPlayer){
            bestScore = -1000;
            for(let i = 0; i < moves.length; i++){
                if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
                }
            }
        }else{
                bestScore = 1000;
                for(let i = 0; i<moves.length; i++){
                    if(moves[i].score < bestScore){
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
        }
    return moves[bestMove];
}




































