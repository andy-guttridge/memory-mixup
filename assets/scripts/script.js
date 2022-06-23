document.addEventListener('DOMContentLoaded', addEventListenersToButtons) 

function addEventListenersToButtons() {
  let buttons = document.getElementsByTagName('button');

  for (let button of buttons) {
    if (button.getAttribute('id') === 'start-button') {
      button.addEventListener('click', playGame)
    } else if (button.getAttribute('id') === 'info-button') {
    button.addEventListener('click', displayInstructions)
    }
  }

}

function playGame(event) {
  console.log('Entered playGame()')
}

function displayInstructions(event) {
  console.log('Entered displayInstructions()');
}