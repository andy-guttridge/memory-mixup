/* ------------ Constant definitions ------------ */
const numberOfPlayItems = 12; //The number of items required for each round of the game
const timerAmount = 30; //The allowed time per round of the game in seconds


// Call setUp() function when DOM has loaded
document.addEventListener('DOMContentLoaded', setUp) 

/**
 * Ensure event listeners are added to buttons and fills the play area with a random selection of items
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
 */
function addEventListenersToButtons() {
  let buttons = document.getElementsByTagName('button');

  for (let button of buttons) {

    if(button.getAttribute('id') === 'start-button') {
      button.addEventListener('click', playGame)
    } else if(button.getAttribute('id') === 'info-button') {
    button.addEventListener('click', displayInstructions)
    } else {
      throw('Unrecognised button passed to addEventListenersToButtons()')
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

  //Start the timer
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
  let randomItemsList = []; //Empty array to hold the randomly selected items
  while (randomItemsList.length <= numberOfPlayItems - 1) {
    let randomNumber = Math.floor(Math.random() * fullItemsList.length); //Create random integer no large than number of items we have to pick from
    if (!randomItemsList.includes(fullItemsList[randomNumber])) { //Add random item to array if it isn't already in there
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
    let gameItemContainer = document.getElementById(`game-item${i}`);  //Get reference to the current gameItemContainer
    imageFileNameString = `URL("assets/images/${randomItemsList[i].image}")`; //Retrieve the filename for the item and concatenate to the full file location
    gameItemContainer.style.backgroundImage = imageFileNameString; //Display the image via CSS backgroundImage property
  }
}

function takeOneItem(randomItemsList) {
  console.log(randomItemsList);
}

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