//Last edited 3/29/23 3:00pm

const gameContainer = document.querySelector("#game");
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  //   "yellow",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  //   "yellow",
];
const cardStructure = `
<div class="card">
<div class="front"></div>
<div class="back"></div>
</div>`;
const gameStart = document.querySelector("#gameStartBtn");
const gameRestart = document.querySelector("#gameRestartBtn");
let clock = document.querySelector("#timer");
let score = document.querySelector("#score");
let clickDisplay = document.querySelector("#clicks");
let matchArray = [];
let prevCardID = null;
let clickCounter = 0;
let timer = 31;
let gameScore = 0;
let highScore = localStorage.getItem("highScore");

// here is a helper function to shuffle an array
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of card objects
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorsArray) {
  for (let color of colorsArray) {
    let cardIndex = 0;
    // create a new div
    const newDiv = document.createElement("div");
    newDiv.classList.add("container");
    newDiv.innerHTML = cardStructure;
    // give it a class attribute for the value we are looping over
    newDiv.querySelector(".back").classList.add(color);
    //Adding attributes to id later
    newDiv.dataset.key = cardIndex;
    newDiv.dataset.isFlipped = false;
    newDiv.dataset.color = color;
    newDiv.dataset.id = colorsArray.indexOf(color);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
    console.log(cardIndex);
    cardIndex++;
  }
}

// helper function to compare two cards
function compare(arr, event) {
  let cardContainer = event.target.parentElement.parentElement;
  let cardId = cardContainer.dataset.id;
  let activeCards = document.querySelectorAll(`[data-id="${cardId}"]`);
  if (arr[0] === arr[1]) {
    activeCards.forEach((card) => {
      gameScore += 0.5;
      card.classList.add("match");
      card.dataset.isFlipped = true;
      card.dataset.eventListener = true;
      score.innerHTML = `Card Matches:${gameScore}`;
      if (gameScore === 5) {
        setUpNewGame();
      }
    });
  } else {
    console.log();
    setTimeout(function () {
      activeCards.forEach((card) => {
        card.classList.remove("flip");
        card.classList.isFlipped = false;
      });
    }, 500);
  }
  prevCardID = activeCards[0];
  matchArray = []; //clears the matchArray
}

// TODO: Implement this function!==============================
function handleCardClick(event) {
  clickCounter++;
  clickDisplay.innerText = `Clicks: ${clickCounter}`;
  //1. Selecting the card container
  let cardContainer = event.target.parentElement.parentElement;
  let cardId = cardContainer.dataset.id;
  //   let color = cardContainer.dataset.color;
  //   console.log("you just clicked", cardContainer, cardId, color);
  //If the cardId of the current card clicked is equal to the
  setTimeout(function () {
    matchArray = [];
  }, 1000);
  if (cardId === prevCardID) {
    console.log("cannot click on the same card, before shift:", matchArray);
    matchArray.shift();
    console.log(matchArray, `after shift`);

    return;
  } else {
    //2. timeout function that flips card back and sets isFlipped to false
    setTimeout(function () {
      cardContainer.classList.remove("flip");
      cardContainer.dataset.isFlipped = false;
      cardContainer.addEventListener("click", handleCardClick);
    }, 1000);

    //4.If the match array has less than 2 values

    if (matchArray.length < 2) {
      cardContainer.classList.add("flip"); //4-a. Flip the card over

      cardContainer.removeEventListener("click", handleCardClick); //4-b. Once a card has been clicked and flipped over, remove the click event listener
      cardContainer.dataset.isFlipped = true; // 4-c. set isFlipped to true since card is flipped up

      matchArray.push(cardId); // 4-d. Push the current card id into an array to compare
    }
    //5. Once the matchArray has 2 values we can compare
    if (matchArray.length === 2) {
      let list = document.querySelectorAll(".container"); //Selecting all Card divs

      // 5-a. Explaining forEach:
      //forEach element run the function in {} passing in the element itself.
      list.forEach((element) => {
        //5-b. if the classList of the element does not have the class "flip"
        if (element.classList.contains("flip") === false) {
          //5-c. remove the click eventListener on that card's container to "lock the board game"
          // console.log(element);
          element.removeEventListener("click", handleCardClick);
          //5-d. Then after 1000ms add the click eventListener back to each element.
          setTimeout(function () {
            element.addEventListener("click", handleCardClick);
          }, 1000);
        }
      });
      compare(matchArray, event);
    }
  }
}

// when the DOM loads

let displayCards = function (arr) {
  createDivsForColors(arr);
};

let setUpNewGame = function () {
  let totalScore = timer + clickCounter;
  gameContainer.innerHTML = `<h4>You Won</h4>
  <p id="currentScore"> Score:${totalScore}</p>
  <p id="highScore"> High Score: ${totalScore}</p>`;
  clearInterval(startTimer);
  gameContainer.classList.add("win");
  gameScore = 0;
  clickDisplay = 0;
};

let myTimer = function startTimer() {
  setInterval(function () {
    if (timer > 0) {
      timer--;
      clock.innerHTML = `Time: ${timer} seconds`;
    } else {
      let totalScore = timer + clickCounter;
      clearInterval(startTimer);
      if (highScore === null) {
        localStorage.setItem("highScore", totalScore);
      } else if (totalScore < highScore) {
        localStorage.setItem("highScore", totalScore);
      }
      console.log("made it here");
      gameContainer.innerHTML = `<h4>Time's Up!</h4>
      <p id="highScore">Score:${totalScore} , High Score: ${highScore}</p>`;
    }
  }, 1000);
};
gameContainer.classList.add("startScreen");

gameStart.addEventListener("click", function () {
  console.log(clickCounter);
  displayCards(shuffledColors);
  myTimer();
  gameStart.remove();
  gameContainer.classList.remove("hidden");
  gameRestart.classList.remove("hidden");
});

gameRestart.addEventListener("click", function () {
  window.location.reload();
});
