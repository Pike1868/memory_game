const gameContainer = document.querySelector("#game");
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
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
  let cardContainer = event.target.parentElement.parentElement;
  let cardId = cardContainer.dataset.id;
  setTimeout(function () {
    matchArray = [];
  }, 1000);
  if (cardId === prevCardID) {
    matchArray.shift();
    return;
  } else {
    setTimeout(function () {
      cardContainer.classList.remove("flip");
      cardContainer.dataset.isFlipped = false;
      cardContainer.addEventListener("click", handleCardClick);
    }, 1000);

    if (matchArray.length < 2) {
      cardContainer.classList.add("flip");

      cardContainer.removeEventListener("click", handleCardClick);
      cardContainer.dataset.isFlipped = true;

      matchArray.push(cardId);
    }

    if (matchArray.length === 2) {
      let list = document.querySelectorAll(".container");
      list.forEach((element) => {
        if (element.classList.contains("flip") === false) {
          element.removeEventListener("click", handleCardClick);
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
      gameContainer.innerHTML = `<h4>Time's Up!</h4>
      <p id="highScore">Score:${totalScore} , High Score: ${highScore}</p>`;
    }
  }, 1000);
};
gameContainer.classList.add("startScreen");

gameStart.addEventListener("click", function () {
  displayCards(shuffledColors);
  myTimer();
  gameStart.remove();
  gameContainer.classList.remove("hidden");
  gameRestart.classList.remove("hidden");
});

gameRestart.addEventListener("click", function () {
  window.location.reload();
});
