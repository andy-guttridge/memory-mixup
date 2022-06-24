/* ------------ Constant definitions ------------ */
const numberOfPlayItems = 12; //The number of items required for each turn of the game
const timerAmount = 8; //The allowed time per turn of the game in seconds
const startingTurns = 5
; //The number of turns at the start of a new game
const playerState = {turnsLeft: 0, score: 0}; //Stores how many turns are left and score


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

  //Set turnsLeft and score to starting values
  playerState.turnsLeft = startingTurns;
  playerState.score = 0;

  //Update score and turns left display
  document.getElementById('turns-left-info').textContent = playerState.turnsLeft;
  document.getElementById('score-info').textContent = playerState.score;

  //Hide answer-container
  document.getElementById('answer-container').style.display('none');
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

  // Fill the pay areas with random items
  let fullItemsList = createFullItemsList();
  let randomItemsList = generateRandomItems(fullItemsList);
  fillPlayArea(randomItemsList);

  //Clear any messages left from previous rounds
  document.getElementById('answer-container').style.display = 'none';

  //Disable the start button, and start a timer
  //Pass the timer function a callback to execute the next part of the game when the timer ends
  let startButton = document.getElementById('start-button');
  startButton.removeEventListener('click', playGame);
  startButton.setAttribute('disabled', true);
  runTimer(timerAmount, function(){takeOneItem(randomItemsList)});
}

/**
 * Returns an array of objects, each of which represents the items for the game
 */
function createFullItemsList() {
  return [
    {name:'Book', image:'book-img.png'},
    {name:'Car', image:'car-img.png'},
    {name:'Cat', image:'cat-img.png'},
    {name:'Cheese', image:'cheese-img.png'},
    {name:'Cow', image:'cow-img.png'},
    {name:'Drum', image:'drum-img.png'},
    {name:'Duck', image:'duck-img.png'},
    {name:'Elephant', image:'elephant-img.png'},
    {name:'Fish', image:'fish-img.png'},
    {name:'Fork', image:'fork-img.png'},
    {name:'Guitar', image:'guitar-img.png'},
    {name:'Hat', image:'hat-img.png'},
    {name:'House', image:'house-img.png'},
    {name:'Lamp', image:'lamp-img.png'},
    {name:'Owl', image:'owl-img.png'},
    {name:'Piano', image:'piano-img.png'},
    {name:'Table', image:'table-img.png'},
    {name:'Tree', image:'tree-img.png'},
    {name:'Umbrella', image:'umbrella-img.png'},
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
 * Adds event listeners to the answer buttons.
 */
function getAnswerFromPlayer(randomItemsList, removedItem) {
  // randomNumber determines which button has the correct answer
  let randomNumber = Math.floor(Math.random() * 3)

  // randomItems[] is used to avoid selecting duplicate random items
  let randomItems = [];

  let i = 0;
  // Loop until all three buttons have an image and event handler
  while (i < 3) {
    let answerButton = document.getElementById(`answer-button${i}`);
    answerButton.addEventListener('click', evaluateAnswer);
    
    //If the button is the one selected for the correct answer, give it a data attribute to mark it as correct and set its image to the missing item
    if (i === randomNumber) {
      answerButton.setAttribute('data-correct-answer', true);
      console.log(removedItem.name + ' ' + removedItem.image);
      answerButton.setAttribute('src', `assets/images/${removedItem.image}`);
      i++;
    } else {

      //Otherwise choose a random item and add it to the button, unless its one we've already used or the big Cross
      let randomItem = randomItemsList[Math.floor(Math.random() * randomItemsList.length)];
      if (!randomItems.includes(randomItem) && randomItem.name !== 'X') {
        answerButton.setAttribute('src', `assets/images/${randomItem.image}`);
        answerButton.setAttribute('data-correct-answer', false);
        randomItems.push(randomItem);
        i++;
      } 
    }
  }
  document.getElementById('answer-response').innerHTML = '';
  document.getElementById('answer-container').style.display = 'inline-block';
}

/**
 * Evaluates the answer selected by the player, updates the score and number of turns left.
 * Then starts a new round or displays an end of game message as appropriate.
 */
function evaluateAnswer(event) {
  
  //Decrement turns left and update display
  playerState.turnsLeft--;
  document.getElementById('turns-left-info').textContent = playerState.turnsLeft;

  //If the player selected the correct answer, increment score and display well done message
  //Otherwise, display hard luck message
  if (event.target.getAttribute('data-correct-answer') === 'true') {
    document.getElementById('answer-response').innerHTML = "<h2>Well done, that's right!</h2>"
    playerState.score++;
    document.getElementById('score-info').textContent = playerState.score;
  } else {
    document.getElementById('answer-response').innerHTML = "<h2>That's not right. Better luck next time.</h2>"
  }

  //Wait a few seconds and start another round if the player has turns left
  //Otherwise, display end of game message
  if (playerState.turnsLeft > 0) {
    runTimer(5, playGame);
  } else {
    document.getElementById('answer-response').innerHTML += `<h2>That's the end of the game. You got ${playerState.score} right, well done!</h2>`;
    runTimer(5, setUp);
  }
  
}

/**
 * Starts an asynchronous timer and updates the timer on the display
 * Accepts two parameters:
 * TimeInSeconds is the number of seconds we want the timer to run;
 * callback is the function to be called when the timer has elapsed
 */
async function runTimer(timeInSeconds, callback) {
  // Code to set up an asynchronous timer adapated from https://masteringjs.io/tutorials/fundamentals/wait-1-second-then#:~:text=To%20delay%20a%20function%20execution,call%20fn%20after%201%20second.
  let timerText = document.getElementById('time-left-info');
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
 * Displays the game instructions in response to the 'how to play the game' button
 */
function displayInstructions(event) {
  console.log('Entered displayInstructions()');
}