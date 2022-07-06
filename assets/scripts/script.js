/* Script wrapped in anonymous function to limit scope of constants */
(function(){
  /* ------------ Constant definitions ------------ */
  //The number of items required on the game board for each turn of the game
  const NUMBER_OF_PLAY_ITEMS = 12; 

  //The allowed time per turn of the game in seconds
  const TIMER_AMOUNT = 3; 

  //The number of turns at the start of a new game
  const STARTING_TURNS = 5; 

  //Stores how many turns are left and score
  const PLAYER_STATE = {turnsLeft: 0, score: 0, isFirstGame: true, isPlaying: false}; 

  //Stores the full list of items available to populate the game
  const FULL_ITEMS_LIST = [
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
    {name:'umbrella', image:'umbrella-img.png'}
];

  // Call setUp() function when DOM has loaded
  document.addEventListener('DOMContentLoaded', setUp); 

  /**
   * Sets up for a new game.
   * Ensures event listeners are added to buttons and fills the play area with a random selection of items
   */
  function setUp() {
    // Fill play area with random selection of items
    fillPlayArea(generateRandomItems());

    //Display the question mark image for each of the answer buttons and disable them
    //And set appropriate aria-labels
    let buttons = document.getElementsByClassName('answer-button');
    for (let button of buttons) {
      button.setAttribute('src', `assets/images/question-mark-img.png`);
      button.setAttribute('disabled', 'true');
      button.setAttribute('aria-label', 'Answer button - inactive');
    }

    //Set turnsLeft and score to starting values
    PLAYER_STATE.turnsLeft = STARTING_TURNS;
    PLAYER_STATE.score = 0;

    //Update score and turns left display
    document.getElementById('turns-left-info').textContent = PLAYER_STATE.turnsLeft;
    document.getElementById('score-info').textContent = PLAYER_STATE.score;

    //Ensure play button is enabled
    document.getElementById('start-button').removeAttribute('disabled');

    //If this is the player's first game after the page has loaded, display instructions and add event listeners to buttons
    if (PLAYER_STATE.isFirstGame) {
      addEventListenersToButtons();
      displayInstructions();
    }
  }

  /**
   * Adds event listeners to the 'start', 'how to play the game' and answer buttons
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
      } 
    }

    //Add event listeners to answer buttons
    let answerButtons = document.getElementsByClassName('answer-button');
    for (let button of answerButtons) {
      button.addEventListener('click', evaluateAnswer);
    }
  }

  /**
   * Starts the game
   */
  function playGame() { 
    PLAYER_STATE.isFirstGame = false;
    PLAYER_STATE.isPlaying = true;

    //Clear the bottom message area
    document.getElementById('bottom-message-area').textContent = ' ';
    
    // Fill the play area with random items. The set of random items is stored in a variable as it is later passed to another function.
    let randomItemsList = generateRandomItems();
    fillPlayArea(randomItemsList);

    //Display the question mark image for each of the answer buttons and disable them
    //And set appropriate aria-labels
    let buttons = document.getElementsByClassName('answer-button');
    for (let button of buttons) {
      button.setAttribute('src', `assets/images/question-mark-img.png`);
      button.setAttribute('disable', 'true');
      button.setAttribute('aria-label', 'Answer button - inactive');
    }

    document.getElementById('top-message-area').textContent = "Try to remember what's on the board!";

    //Disable the start button, and start a timer
    //Pass the timer function a callback to execute the next part of the game when the timer ends
    let startButton = document.getElementById('start-button');
    startButton.setAttribute('disabled', true);
    runTimer(TIMER_AMOUNT, function(){takeOneItem(randomItemsList);}, 'time-left-info');
  }

  /**
   * Returns an array of unique random items picked from the full list of available items
   * @return {Array} array of unique random game items
   */
  function generateRandomItems() {
    //Empty array to hold the randomly selected items
    let randomItemsList = []; 

    while (randomItemsList.length <= NUMBER_OF_PLAY_ITEMS - 1) {
      //Create random integer no large than number of items we have to pick from
      let randomNumber = Math.floor(Math.random() * FULL_ITEMS_LIST.length);

      //Add random item to array if it isn't already in there 
      if (!randomItemsList.includes(FULL_ITEMS_LIST[randomNumber])) { 
        randomItemsList.push(FULL_ITEMS_LIST[randomNumber]);
      }
    }
    return randomItemsList;
  }

  /**
   * Fills the play area with items from the array passed in
   *  @param {Array} randomItemsList - an array of game items to populate the game board
   */
  function fillPlayArea(randomItemsList) {
    for (let i = 0; i <= NUMBER_OF_PLAY_ITEMS - 1; i++) {
      //Get reference to the current gameItemContainer
      let gameItemContainer = document.getElementById(`game-item${i}`);

      //Retrieve the filename for the item and concatenate to the full file location  
      let imageFileNameString = `URL("assets/images/${randomItemsList[i].image}")`; 

      //Display the image via CSS backgroundImage property and set an appropriate aria-label
      gameItemContainer.style.backgroundImage = imageFileNameString; 
      gameItemContainer.setAttribute('aria-label', `Game board item - ${randomItemsList[i].name}`)
    }
  }

  /**
   * Randomly shuffles the array of items passed in, removes and replaces one item in the array with a big X
   * and passes the shuffled array and the removed item to the next function
   * @param {Array} randomItemsList - an array of game items to be shuffled and one item swapped for the X
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
    randomItemsList[randomIndex] = {name:'X', image:'cross-img.png'};
    fillPlayArea(randomItemsList);
    
    //Call function to get an answer from the player
    getAnswerFromPlayer(randomItemsList, removedItem);
  }

  /**
   * Asks player which item is missing. Gives them three buttons to choose from, one of which is correct.
   * Adds event listeners to the answer buttons. Accepts the randomised array of items and the item selected to be removed as parameters.
   * @param {Array} randomItemsList - an array of game items which were used to populate the game board
   * @param {Array} removedItem - the game item that was randomly selected for removal from the game board
   */
  function getAnswerFromPlayer(randomItemsList, removedItem) {
    console.log('Correct answer is: ' + removedItem.name);
    document.getElementById('top-message-area').textContent = 'Which item do you think is missing?';

    // randomButton determines which button is assigned the correct answer
    let randomButton = Math.floor(Math.random() * 3);

    // randomItems[] is used to track which random items are picked for the buttons, so we don't repeat them
    let newRandomItems = [];
    let i = 0;
    
    // Loop until all three buttons have an image and ensure they are enabled
    while (i < 3) {
      let answerButton = document.getElementById(`answer-button${i}`);
      answerButton.removeAttribute('disabled');

      //If the button is the one selected for the correct answer, give it a data attribute in the DOM to mark it as correct and set its image to the missing item
      //And set an appropriate aria-label
      if (i === randomButton) {
        answerButton.setAttribute('data-correct-answer', true);
        answerButton.setAttribute('src', `assets/images/${removedItem.image}`);
        answerButton.setAttribute('aria-label', `Answer option - ${removedItem.name}`)
        i++;
      } else {
        //Otherwise find a random item that wasn't already on the board and add it to the button, unless its one we've already used or the big cross
        
        //Pick a random item from the full list of items
        let randomItem = FULL_ITEMS_LIST[Math.floor(Math.random() * FULL_ITEMS_LIST.length)];

        //Check if the random item is valid as one of the player options and set as the value for the answer button if it is
        //And set an appropriate aria-label
        if (checkItemValid(randomItem, randomItemsList, removedItem, newRandomItems)) {
          answerButton.setAttribute('src', `assets/images/${randomItem.image}`);
          answerButton.setAttribute('data-correct-answer', false);
          answerButton.setAttribute('aria-label', `Answer option - ${randomItem.name}`

          //Store the name of the correct item as an attribute of the button for use when we evaluate whether the player chose the correct answer
          answerButton.setAttribute('data-correct-item-name', removedItem.name);
          newRandomItems.push(randomItem);
          i++;
        } 
      }
    }
    //Make sure the bottom message area is clear of text
    document.getElementById('bottom-message-area').textContent = ' ';
  }

  /**
   * Checks whether a game item is a valid choice to populate an answer button
   * @param {Object} randomItem - random game item to be checked for validity to populate one of the answer buttons
   * @param {Array} randomItemsList - array of random game items currently used to populate the game board
   * @param {Object} removedItem - game item that has been removed from the board and is the correct answer
   * @param {Array} newRandomItems - array of game items that have already been selected to populate the answer buttons
   * @returns {boolean} - returns true if the randomItem is valid to populate the answer button
   */
  function checkItemValid(randomItem, randomItemsList, removedItem, newRandomItems) {
    //Check if the random item was used on the board, that it isn't the correct answer, that it isn't the 'X' and that we haven't already used it for another answer button
    if (!randomItemsList.includes(randomItem) && randomItem.name !== removedItem.name && randomItem.name !== 'X' && !newRandomItems.includes(randomItem)) {
      return true;
    }
    return false;
  }

  /**
   * Evaluates the answer selected by the player, updates the score and number of turns left.
   * Then starts a new turn or displays an end of game message as appropriate.
   * @param {event} event - event triggered by the player selecting an answer button
   */
  function evaluateAnswer(event) {
    //Decrement turns left and update display
    PLAYER_STATE.turnsLeft--;
    document.getElementById('turns-left-info').textContent = PLAYER_STATE.turnsLeft;

    //Disable answer buttons
    let answerButtons = document.getElementsByClassName('answer-button');
    for (let button of answerButtons) {
      button.setAttribute('disabled', 'true');
    }

    //If the player selected the correct answer, increment score and display well done message
    //Otherwise, display hard luck message
    if (event.target.getAttribute('data-correct-answer') === 'true') {
      document.getElementById('top-message-area').textContent = "Well done, that's right!";
      PLAYER_STATE.score++;
      document.getElementById('score-info').textContent = PLAYER_STATE.score;
    } else {
      let chosenItem = event.target.getAttribute('data-correct-item-name');
      document.getElementById('top-message-area').textContent = `That's not right. The ${chosenItem} was missing. Better luck next time.`;
    }

    //Wait a few seconds and start another turn if the player has turns left
    //Otherwise, wait a few seconds and display end of game message
    if (PLAYER_STATE.turnsLeft > 0) {
      document.getElementById('bottom-message-area').innerHTML = `Next turn in <span id = "turn-end-timer"></span>`;
      runTimer(5, playGame, 'turn-end-timer');
    } else {
        PLAYER_STATE.isPlaying = false;
        runTimer(2, endGameMessage, null);
      }
  }

  /**
   * Starts an asynchronous timer and updates the timer on the display
   * Accepts three parameters:
   * TimeInSeconds is the number of seconds we want the timer to run;
   * callback is the function to be called when the timer has elapsed;
   * displayElementId is optional. It is a string containing the DOM ID for the HTML element for the timer to update
   * @param {number} timeInSeconds -  number of seconds for the timer to run
   * @param {callback} callback - function to be called when the timer has completed
   * @param {string} displayElementId - the DOM ID for the HTML element for the timer to update (this param is optional)
   */
  async function runTimer(timeInSeconds, callback, displayElementId) {
    // Code to set up an asynchronous timer adapated from https://masteringjs.io/tutorials/fundamentals/wait-1-second-then#:~:text=To%20delay%20a%20function%20execution,call%20fn%20after%201%20second.
    let timerText = '';

    if (displayElementId) { 
      timerText = document.getElementById(displayElementId);
      timerText.textContent = timeInSeconds;
    }
    while (timeInSeconds > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      timeInSeconds--;
      if (displayElementId){
        timerText.textContent = timeInSeconds;
      }
    }

    // Call the function passed in as the second parameter
    callback();
  }

  /**
   * Displays the game instructions in response to the 'how to play the game' button.
   * Also called automatically when the page first loads.
   */
  function displayInstructions() {
    /* Create content for modal dialog */
    let content = `
    <h2>How to play</h2>
    <div class = "modal-inner-text">
      <p>You have 30 seconds to memorise a random selection of items!</p>
      <p>One item will then be taken away.</p>
      <p>Can you guess which one is missing?</p>
      <p>You have five turns - can you score five out of five?</p>
    </div>
    <br>
    <button id = "ok-button">I'm ready!</button>
  `;
    
    /*Show the modal dialog */
    showModal(content);
  }

  /**
   * Shows a game over message in a modal dialog at the end of the game
   */
  function endGameMessage() {
    /* Create appropriate html message depending on whether the player scored any points */
    let message = '';
    if (PLAYER_STATE.score > 0) {
      message = `
      <p>That's the end of the game.</p>
      <p>You got ${PLAYER_STATE.score} right, well done!</p>
      `;
    } else {
      message = `
      <p>That's the end of the game.</p>
      <p>You didn't get any right.</p>
      <p>Better luck next time!</p>
      `;
    }
    
    /* Create html content for the modal */
    let content = `
    <h2>Game Over!</h2>
    <div class = "modal-inner-text">
     ${message}
    </div>
    <br>
    <button id = "ok-button">OK</button>
    `;

    /* Show the modal dialog */
    showModal(content);
  }

  /**
   * Shows a modal dialog, disables 'play' and 'how to play' buttons and creates an event listener for an ok button in the modal.
   * @param {string} content - html content to be displayed in the modal dialog
   */
  function showModal(content) {
    //Disable the 'play' and 'how to play' buttons
    document.getElementById('info-button').setAttribute('disabled', true);
    document.getElementById('start-button').setAttribute('disabled', true);
    
    //Display the modal dialog elements and add HTML with instructions and a button to dismiss the dialog
    document.getElementById('modal-background').style.display = 'block';
    document.getElementById('modal-dialog').innerHTML = content;

    //Add event listener to the button to call hideInstructions()
    let okButton = document.getElementById('ok-button');
    if(okButton) {
      okButton.addEventListener('click', hideModal);
    } else {
      throw ('Unrecognised button passed to showModal()');
    }
  }

  /**
   * Hides the modal dialog and enables 'play' and 'how to play' buttons
   * @param {event} event - event triggered by the player clicking the ok-button
   */
  function hideModal(event) {
    if (event.target.getAttribute('id') === 'ok-button') {
      document.getElementById('modal-background').style.display = 'none';
    } else {
      throw('Unrecognised button passed to hideModal()');
    }

    //Enable 'play' and 'how to play' buttons
    if (!PLAYER_STATE.isPlaying) {
      document.getElementById('start-button').removeAttribute('disabled');
    }
    document.getElementById('info-button').removeAttribute('disabled');

    //If the player has no turns left, then call setup() to set up for a new game
    if (PLAYER_STATE.turnsLeft < 1) {
      setUp();
    }
  }
})();