/* ------------ Constant definitions ------------ */
const numberOfPlayItems = 12; //The number of items required for each turn of the game
const timerAmount = 8; //The allowed time per turn of the game in seconds
const startingTurns = 5; //The number of turns at the start of a new game
const playerState = {turnsLeft: 0, score: 0, isFirstGame: true}; //Stores how many turns are left and score


// Call setUp() function when DOM has loaded
document.addEventListener('DOMContentLoaded', setUp(0)) 

/**
 * Sets things up for a new game.
 * Ensures event listeners are added to buttons and fills the play area with a random selection of items
 */
function setUp() {

  addEventListenersToButtons();
  // Duplicates code in playGame() function. Can we get rid of repetition?
  let fullItemsList = createFullItemsList();
  let randomItemsList = generateRandomItems(fullItemsList);
  fillPlayArea(randomItemsList);

  //Display the question mark image for each of the answer buttons and remove any event listeners
  let buttons = document.getElementsByClassName('answer-button');
  for (button of buttons) {
    button.setAttribute('src', `assets/images/question-mark-img.png`);
    button.removeEventListener('click', evaluateAnswer);
  }

  //Set turnsLeft and score to starting values
  playerState.turnsLeft = startingTurns;
  playerState.score = 0;

  //Update score and turns left display
  document.getElementById('turns-left-info').textContent = playerState.turnsLeft;
  document.getElementById('score-info').textContent = playerState.score;

  //If this is the player's first game after the page has loaded, automatically display the instructions
  if (playerState.isFirstGame) {
    displayInstructions();
    playerState.isFirstGame = false;
  }

}

/**
 * Adds event listeners to the 'start' and 'how to play the game' buttons
 * and removes the disabled attribute from the start button if it is present
 */
function addEventListenersToButtons() {
  let buttons = document.getElementsByTagName('button');

  //Add event listeners to buttons. Make sure start button is enabled
  for (let button of buttons) {

    if(button.getAttribute('id') === 'start-button') {
      button.addEventListener('click', playGame);
      button.removeAttribute('disabled');
    } else if(button.getAttribute('id') === 'info-button') {
    button.addEventListener('click', displayInstructions);
    } else {
      throw('Unrecognised button passed to addEventListenersToButtons()');
    }
  }
}

/**
 * Starts the game
 */
function playGame(event) {
  //Clear the bottom message area
  document.getElementById('bottom-message-area').textContent = ' ';
  // Fill the play area with random items
  let fullItemsList = createFullItemsList();
  let randomItemsList = generateRandomItems(fullItemsList);
  fillPlayArea(randomItemsList);

  //Display the question mark image for each of the answer buttons and remove any event listeners
  let buttons = document.getElementsByClassName('answer-button');
  for (button of buttons) {
    button.setAttribute('src', `assets/images/question-mark-img.png`);
    button.removeEventListener('click', evaluateAnswer);
  }

  document.getElementById('top-message-area').textContent = "Try to remember what's on the board!"

  //Disable the start button, and start a timer
  //Pass the timer function a callback to execute the next part of the game when the timer ends
  let startButton = document.getElementById('start-button');
  startButton.removeEventListener('click', playGame);
  startButton.setAttribute('disabled', true);
  runTimer(timerAmount, function(){takeOneItem(randomItemsList)}, 'time-left-info');
}

/**
 * Returns an array of objects, each of which represents the items for the game
 */
function createFullItemsList() {
  return [
    {name:'book', image:'book-img.png'},
    {name:'car', image:'car-img.png'},
    {name:'cat', image:'cat-img.png'},
    {name:'cheese', image:'cheese-img.png'},
    {name:'cow', image:'cow-img.png'},
    {name:'drum', image:'drum-img.png'},
    {name:'duck', image:'duck-img.png'},
    {name:'elephant', image:'elephant-img.png'},
    {name:'fish', image:'fish-img.png'},
    {name:'fork', image:'fork-img.png'},
    {name:'guitar', image:'guitar-img.png'},
    {name:'hat', image:'hat-img.png'},
    {name:'house', image:'house-img.png'},
    {name:'lamp', image:'lamp-img.png'},
    {name:'owl', image:'owl-img.png'},
    {name:'piano', image:'piano-img.png'},
    {name:'table', image:'table-img.png'},
    {name:'tree', image:'tree-img.png'},
    {name:'umbrella', image:'umbrella-img.png'},
  ];
}

/**
 * Returns an array of unique random items picked from the full list of available items
 */
function generateRandomItems(fullItemsList) {
  
  //Empty array to hold the randomly selected items
  let randomItemsList = []; 

  while (randomItemsList.length <= numberOfPlayItems - 1) {
    //Create random integer no large than number of items we have to pick from
    let randomNumber = Math.floor(Math.random() * fullItemsList.length);
    //Add random item to array if it isn't already in there 
    if (!randomItemsList.includes(fullItemsList[randomNumber])) { 
      randomItemsList.push(fullItemsList[randomNumber])
    }
  }
  return randomItemsList;
}

/**
 * Fills the play area with items from the array passed in
 */
function fillPlayArea(randomItemsList) {
  for (let i = 0; i <= numberOfPlayItems - 1; i++) {

    //Get reference to the current gameItemContainer
    let gameItemContainer = document.getElementById(`game-item${i}`);

    //Retrieve the filename for the item and concatenate to the full file location  
    imageFileNameString = `URL("assets/images/${randomItemsList[i].image}")`; 

    //Display the image via CSS backgroundImage property
    gameItemContainer.style.backgroundImage = imageFileNameString; 
  }
}

/**
 * Randomly shuffles the array of items passed in, removes and replaces one item in the array with a big X
 * and passes the shuffled array and the removed item to the next function
 */
function takeOneItem(randomItemsList) {
  //Algorithm to randomly shuffle an array taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = randomItemsList.length; 
  let randomIndex;

  //Loop while there are elements left to shuffle
  while (currentIndex != 0) {

    //Pick a random element of those that remain and then decrement the index 
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    //Swap the element at the current index with the one at the random index
    [randomItemsList[currentIndex], randomItemsList[randomIndex]] = [randomItemsList[randomIndex], randomItemsList[currentIndex]];
  }

  //Pick a random item from the shuffled array of items, store it and then remove and replace with a big X
  randomIndex = Math.floor(Math.random() * randomItemsList.length);
  let removedItem = randomItemsList[randomIndex];
  randomItemsList[randomIndex] = {name:'X', image:'cross-img.png'}
  fillPlayArea(randomItemsList);
  
  //Call function to get an answer from the player
  getAnswerFromPlayer(randomItemsList, removedItem);
}

/**
 * Asks player which item is missing. Gives them three buttons to choose from, one of which is correct.
 * Adds event listeners to the answer buttons. Accepts the randomised array of items and the item selected to be removed as parameters.
 */
function getAnswerFromPlayer(randomItemsList, removedItem) {
  console.log('Correct answer is: ' + removedItem.name);
  document.getElementById('top-message-area').textContent = 'Which item do you think is missing?'
  // randomButton determines which button is assigned the correct answer
  let randomButton = Math.floor(Math.random() * 3)

  // randomItems[] is used to track which random items are assigned to the buttons, so we don't repeat them
  let newRandomItems = [];

  let i = 0;
  // Loop until all three buttons have an image and event handler
  while (i < 3) {
    let answerButton = document.getElementById(`answer-button${i}`);
    answerButton.addEventListener('click', evaluateAnswer);
    
    //If the button is the one selected for the correct answer, give it a data attribute in the DOM to mark it as correct and set its image to the missing item
    if (i === randomButton) {
      answerButton.setAttribute('data-correct-answer', true);
      answerButton.setAttribute('src', `assets/images/${removedItem.image}`);
      i++;
    } else {
      //Otherwise find a random item that wasn't already on the board and add it to the button, unless its one we've already used or the big cross
      let fullItemsList = createFullItemsList();
      //Pick a random item from the full list of items
      let randomItem = fullItemsList[Math.floor(Math.random() * fullItemsList.length)];
      //didFindItem is used to record the outcome of checking whether the random item has already appeared on the board or already been selected for one of the answer buttons
      let didFindItem = false;
      //Check if the random item was used on the board, that it isn't the correct answer, that it isn't the 'X' and that we haven't already used it for another answer button...
      if (randomItem.name !== 'X' && randomItem.name !== removedItem.name) {
        for (item of randomItemsList) {
          if (item.name === randomItem.name || item.name === removedItem.name) {
          didFindItem = true;
          break;
          }

          for (item of newRandomItems) {
            if (item.name === randomItem.name) {
              didFindItem = true;
              break
            }
          }
        }

        //... and if it isn't a duplicate or the X, we can use it for our button 
        if (!didFindItem) {
          answerButton.setAttribute('src', `assets/images/${randomItem.image}`);
          answerButton.setAttribute('data-correct-answer', false);

          //Store the name of the correct item as an attribute of the button for use when we evaluate whether the player chose the correct answer
          answerButton.setAttribute('data-correct-item-name', removedItem.name);
          newRandomItems.push(randomItem);
          i++;
        }
      } 
    }
  }
  document.getElementById('bottom-message-area').textContent = ' ';
}

/**
 * Evaluates the answer selected by the player, updates the score and number of turns left.
 * Then starts a new turn or displays an end of game message as appropriate.
 */
function evaluateAnswer(event) {
  
  //Decrement turns left and update display
  playerState.turnsLeft--;
  document.getElementById('turns-left-info').textContent = playerState.turnsLeft;

  //If the player selected the correct answer, increment score and display well done message
  //Otherwise, display hard luck message
  if (event.target.getAttribute('data-correct-answer') === 'true') {
    document.getElementById('top-message-area').textContent = "Well done, that's right!"
    playerState.score++;
    document.getElementById('score-info').textContent = playerState.score;
  } else {
    let chosenItem = event.target.getAttribute('data-correct-item-name');
    document.getElementById('top-message-area').textContent = `That's not right. The ${chosenItem} was missing. Better luck next time.`
  }

  //Wait a few seconds and start another turn if the player has turns left
  //Otherwise, display end of game message
  if (playerState.turnsLeft > 0) {
    document.getElementById('bottom-message-area').innerHTML = `Next turn in <span id = "turn-end-timer"></span>`;
    runTimer(5, playGame, 'turn-end-timer');
  } else {
    if (playerState.score > 0) {
      document.getElementById('bottom-message-area').innerHTML = `That's the end of the game. You got ${playerState.score} right, well done! Press play to play again.`;
    } else {
      document.getElementById('bottom-message-area').innerHTML = `That's the end of the game. You didn't get any right this time. Press play to play again.`
    }
    setUp();
  }
  
}

/**
 * Starts an asynchronous timer and updates the timer on the display
 * Accepts three parameters:
 * TimeInSeconds is the number of seconds we want the timer to run;
 * callback is the function to be called when the timer has elapsed;
 * displayElementId is a string containing the DOM ID for the HTML element for the timer to update
 */
async function runTimer(timeInSeconds, callback, displayElementId) {
  // Code to set up an asynchronous timer adapated from https://masteringjs.io/tutorials/fundamentals/wait-1-second-then#:~:text=To%20delay%20a%20function%20execution,call%20fn%20after%201%20second.
  let timerText = document.getElementById(displayElementId);
  timerText.textContent = timeInSeconds;
  while (timeInSeconds > 0) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  timeInSeconds--;
  timerText.textContent = timeInSeconds;
  }

  // Call the function passed in as the second parameter
  callback();
}

/**
 * Displays the game instructions in response to the 'how to play the game' button.
 * Also called automatically when the page first loads.
 */
function displayInstructions(event) {
  
  //Display the modal dialog elements and add HTML with instructions and a button to dismiss the dialog
  document.getElementById('modal-background').style.display = 'block';
  document.getElementById('modal-dialog').innerHTML = `
    <h2>How to play</h2>
    <p>Instructions on how to play the game will go here</p>
    <br>
    <button id = "ready-button">I'm ready!</button>
  `;

  //Add event listener to the button to call hideInstructions()
  document.getElementById('ready-button').addEventListener('click', hideInstructions);
}

/**
 * Hides the modal dialog with the instructions
 */
function hideInstructions(event) {
  if (event.target.getAttribute('id') === 'ready-button') {
    document.getElementById('modal-background').style.display = 'none';
  } else {
    throw('Unrecognised button passed to hideInstructions()')
  }
}