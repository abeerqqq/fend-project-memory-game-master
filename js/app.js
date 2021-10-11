/*
* Create a list that holds all of your cards
*/
const cards = ['fa-diamond','fa-diamond',
'fa-anchor','fa-anchor',
'fa-cube','fa-cube',
'fa-bicycle','fa-bicycle',
'fa-bomb','fa-bomb',
'fa-leaf','fa-leaf',
'fa-bolt','fa-bolt',
'fa-paper-plane-o','fa-paper-plane-o'];

let htmlDeck = document.querySelector('.deck');
let htmlMoves  = document.querySelector('.moves');
let htmlTimer = document.querySelector('.timer');
let htmlSeconds = document.querySelector('.s');
let htmlMinuts = document.querySelector('.m');
let htmlHours= document.querySelector('.h');
let htmlStarsLabel = document.querySelector('.stars');
let htmlFirstStar = document.querySelector('.first');
let htmlSecondStar = document.querySelector('.second');
let htmlThirdStar = document.querySelector('.third');
let htmlRestart = document.querySelector('.reset');
let htmlDialog = document.querySelector('.myDialog');
let htmlTakenMoves = document.querySelector('.movesNum');
let htmlTakenTime = document.querySelector('.overallTime');
let htmlRate = document.querySelector('.rate');
let htmlRestartBtn = document.querySelector('.restart-button');

let moves = 0;
let hour = 0;
let minute = 0;
let seconds = 0;
let timerVar = 0;
let openCards = [];
let totalSeconds = 0;
let matchedCards = 0;
let starsArray = [htmlFirstStar,htmlSecondStar,htmlThirdStar];
let flag = false;

function generateCard(card){
  return `<li class= "card"><i class= "fa ${card}"></i></li>`;
}

// the cards is created programmatically through this function
function initGame () {

  let htmlCard = cards.map(function(card){
    return generateCard(card);
  });
  htmlDeck.innerHTML = htmlCard.join('');
  moves = 0;
  totalSeconds = 0;
  htmlMoves.innerHTML = moves;
}
// the timer function that calculate the seconds, minutes and the hour
function countTimer() {
    ++totalSeconds;
    hour = Math.floor(totalSeconds /3600);
    minute = Math.floor((totalSeconds - hour*3600)/60);
    seconds = totalSeconds - (hour*3600 + minute*60);
    htmlHours.innerHTML = hour + ' : ';
    htmlMinuts.innerHTML = minute + ' : ';
    htmlSeconds.innerHTML = seconds;
}

function flipCard(evt){
// the flag condition is to start the timer once the user click on the board
  if(flag == false){
    flag = true;
    timerVar = setInterval(countTimer, 1000);
  }
  if(evt.target.nodeName === 'LI'){

    let targetedCard = evt.target;
    // the user cant select the same card twice or select a matched card
    if(!targetedCard.classList.contains("open") && !targetedCard.classList.contains("show") && !targetedCard.classList.contains("match")){

      if (openCards.length<=2){
        targetedCard.classList.add("open","show");
        openCards.push(targetedCard);
      }
      // invoke the matchingTest function if there are 2 cards open
      if(openCards.length == 2){
        moves++; // each time the user open two cards the number of moves increase by 1
        htmlMoves.innerHTML = moves;
        matchingTest(openCards);
        openCards = [];
        if(moves > 11){ // if number of moves increased the stars rate start to decrease
          starsRate();
        }
      }
    }
  }
}

function matchingTest (openCards){

  if(openCards[0].querySelector('i').className === openCards[1].querySelector('i').className){

    openCards[0].classList.add("match");
    openCards[1].classList.add("match");

    matchedCards = matchedCards + 2; // matchedCards variable is to keep track of the number of matched cards
    if(matchedCards == 16){
      clearInterval(timerVar); // once the user matched all the cards the timer stop and the dialog pops up
      showDialog();
    }
  }
  else {
    // close the crads if not matched
    setTimeout(function(){
      openCards[0].classList.remove("open","show");
      openCards[1].classList.remove("open","show");
    },400);
    }
  }

   function starsRate() {
     // when the number of moves increased the stars color turned into gray
     if(moves == 12){
       starsArray[0].style.color = '#C8C8C8';
     }
     else if (moves == 20) {
       starsArray[1].style.color = '#C8C8C8';
     }
   }

   function showDialog(){
     htmlDialog.open = true;
     htmlTakenMoves.innerHTML = moves;
     htmlTakenTime.innerHTML = hour + ":" + minute + ":" + seconds;
     htmlRate.innerHTML = htmlStarsLabel.innerHTML;
   }

   function restartGame(){
     shuffle(cards);
     initGame();
     clearInterval(timerVar);
     openCards = [];
     flag = false;
     moves = 0;
     matchedCards = 0;
     totalSeconds = 0;
     hour = 0;
     seconds = 0;
     minute = 0;
     starsArray[0].style.color = 'black';
     starsArray[1].style.color = 'black';
     htmlMoves.innerHTML = moves;
     htmlHours.innerHTML = hour +' : ';
     htmlMinuts.innerHTML = minute +' : ';
     htmlSeconds.innerHTML = seconds;
   }

  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  function eventListener() {
    htmlDeck.addEventListener('click',flipCard);
    htmlRestart.addEventListener('click',restartGame);
    htmlRestartBtn.addEventListener('click',function(){
      restartGame();
      htmlDialog.close();
    });
  }

  shuffle(cards);
  initGame();
  eventListener();
