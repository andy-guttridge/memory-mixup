/* ------------ Constant definitions ------------ */
const numberOfPlayItems = 12; //The number of items required for each round of the game
const timerAmount = 5; //The allowed time per round of the game in seconds


// Call setUp() function when DOM has loaded
document.addEventListener('DOMContentLoaded', setUp) 

/**
 * Ensures event listeners are added to buttons and fills the play area with a random selection of items
 */
function setUp() {
  addEventListenersToButtons();
  // Duplicates code in playGame() function. Can we get rid of repetition?
  let fullItemsList = createFullItemsList();
  let randomItemsList = generateRandomItems(fullItemsList);
  fillPlayArea(randomItemsList);
}

/**
 * Adds event listeners to the 'start' and 'how to play the game' buttons
 * and removes the disabled attribute from the start button if it is present
 */
function addEventListenersToButtons() {
  let buttons = document.getElementsByTagName('button');

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
  randomIndex = Math.floor(Math.random() * randomItemsList.length-1);
  let removedItem = randomItemsList[randomIndex];
  randomItemsList[randomIndex] = {name:'X', image:'cross-img.png'}
  fillPlayArea(randomItemsList);
  
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