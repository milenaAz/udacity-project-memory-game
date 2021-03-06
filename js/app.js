'use strict'

const icons = ["fa-space-shuttle", "fa-space-shuttle", "fa-user-astronaut", "fa-user-astronaut", "fa-satellite", "fa-satellite",
		"fa-robot", "fa-robot", "fa-rocket", "fa-rocket", "fa-satellite-dish",
		"fa-satellite-dish", "fa-fighter-jet", "fa-fighter-jet", "fa-sun", "fa-sun"];

const stars = document.querySelectorAll('.fa-star');
const deck = document.querySelector('tbody');
const modal = document.querySelector('.modal');

let openedCards = [];
let matchedPairs = 0;
let moves = 0;
let cardClicked = true;

/**
* @description Creates a 8x8 deck
*/
function createDeck () {
	const docFrag = document.createDocumentFragment();
	const deck = document.querySelector('tbody');

	for (let i = 0; i < 4; i++) {
		const row = document.createElement('tr');
		docFrag.appendChild(row);		
		for (let j = 0; j < 4; j++) {
			const col = document.createElement('td');
			col.classList.add('card', 'animated');
			docFrag.appendChild(col);
		}
	}
	deck.appendChild(docFrag);
}

/**
* @description Adds icon classes to <td> elements
*/
function addIcons() {
	const deck = document.querySelectorAll('td');

	for (let i = 0; i < deck.length; i++) {
		deck[i].innerHTML = "<i class=\"fas "+icons[i]+"\"></i>";
	}
}

/**
* @description Shuffles the array
* @param {array} array
* @returns {array} the new shuffled array
*/
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
* @description Show the card
*/
function openCard() {
	//starts the timer only on first click
	if(cardClicked) {
		startTimer();
		cardClicked = false;
	}

	this.classList.toggle('show');
    this.classList.toggle('open');
    this.classList.toggle('disable');
    this.classList.toggle('flipInY');
}

/**
* @description Compares the cards if the cards match then call match()
* else call unmatched() function
*/
function compareCards() {
	openedCards.push(this);
    if(openedCards.length === 2) {
        if(openedCards[0].innerHTML === openedCards[1].innerHTML) {      
           matched();
           moveCounter();
        } else {
           unmatched();
           moveCounter();
        }
	}
}

/**
* @description If cards match then cards should stay opened
*/
function matched() {
	openedCards[0].classList.add('matched', 'tada');
	openedCards[1].classList.add('matched', 'tada');
	openedCards[0].classList.remove('show', 'flipInY');
	openedCards[1].classList.remove('show', 'flipInY');

	openedCards = [];
	matchedPairs++;
}

/**
* @description If cards not match then cards should close
*/
function unmatched() {
	openedCards[0].classList.remove('flipInY');
	openedCards[1].classList.remove('flipInY');
	openedCards[0].classList.add('swing', 'unmatched');
	openedCards[1].classList.add('swing', 'unmatched');
	// openedCards[0].classList.toggle('unmatched');
	// openedCards[1].classList.toggle('unmatched');
	
	disable(); //disable all the other cards from clicking
	setTimeout( function() {
		openedCards[0].classList.remove('show', 'open', 'unmatched', 'swing');
		openedCards[1].classList.remove('show', 'open', 'unmatched', 'swing');
		openedCards = [];
		enable(); //enable cards to click again
	}, 1000);
}

/**
* @description disables all cards from click event
*/
function disable() {
	const cards = document.querySelectorAll('td');

	for(let card of cards) {
		card.classList.add('disable');
	}
}

/**
* @description enables unmatched cards to click event
*/
function enable() {
	const cards = document.querySelectorAll('td');

	for(let card of cards) {
		if(card.classList.contains('matched') == false) {
			card.classList.remove('disable');
		}
	}
}

/**
* @description Counts the moves
*/
function moveCounter() {
	const movesEl = document.querySelector('.moves');
	
	moves++;
	movesEl.innerHTML = moves + " ";
	if(moves >= 16 && moves <= 18) {
		rating(2);	
	}
	if(moves > 19) {
		rating(1);
	}
}

/**
* @description Handles the rating
* @param {number} index - The index of nodeList stars
*/
function rating(index) {
	const stars = document.querySelectorAll('.fa-star');
	const starToRemove = stars.item(index);
	
	if(starToRemove !== null) {
		starToRemove.className ='fa fa-star-o'; 
	}
}

/**
* @description If matchedPairs is 8 then game is over
*/
function gameOver() {
	if(matchedPairs === 8) {
		stopTimer();

		//wait 2 sec before zoom in the deck
		setTimeout(function () {
			deck.classList.add('zoomIn');
		}, 1000);
	
		setTimeout(function() {
			modalPopup();
		}, 3000);
	}
}


let sec = 0;
let min = 0;
let hours = 0;
let timer = document.querySelector('.timer');
let stopWatch;
/**
* @description The timer starts
*/
function startTimer() {
	stopWatch = setInterval(function() {
		timer.innerHTML = `${numberFormat(hours)}:${numberFormat(min)}:${numberFormat(sec)}`;
		sec++;
		if(sec === 60) {
			min++;
			sec = 0;
		}
		if(min === 60) {
			hours++;
			min = 0;
		}
	},1000);
}

/**
* @description Formats the number to two digits
* @param {number} num - The returned number from timer
*/
function numberFormat(num) {
	num = num.toString();
	if (num.length < 2) {
		num = '0'+num;
	}

	return num;
}

/**
* @description Stops the timer
*/
function stopTimer() {
	clearInterval(stopWatch);
}

/**
* @description Opens the modal
*/
function modalPopup(){
	const close = document.querySelector('.modal-close');
	
	displayResults();
	modal.style.visibility = 'visible';
	close.addEventListener('click', function() {
		modal.style.visibility = 'hidden';
	});
}

/**
* @description Displays the results for modal
*/
function displayResults() {
	const finalMoves = document.querySelector('.display-moves');
	const finalStars = document.querySelector('.display-stars');
	const finalTimer = document.querySelector('.display-timer');
	const stars = document.querySelectorAll('.fa-star');

	finalMoves.innerHTML = moves;
	finalStars.innerHTML = `${stars.length} stars`;
	finalTimer.innerHTML = `${numberFormat(hours)}:${numberFormat(min)}:${numberFormat(sec-1)}`;
}

/**
* @description restarts the game
*/
function restartGame() {
	startGame();
	modal.style.visibility = 'hidden';
}

/**
* @description If card clicked events happening
*/
function clickCard () {
	const cards = document.querySelectorAll('.card');

	for (let card of cards) {
	    card.addEventListener('click', openCard );
	    card.addEventListener('click', compareCards );
	    card.addEventListener('click', gameOver );
	}
}

/**
* @description Initialize the game
*/
function resetGame () {
	//remove the deck
	while (deck.firstChild) {
    	deck.removeChild(deck.firstChild);
	}
	deck.classList.remove('zoomIn');
	//reset moves to 0
	moves = 0; 
	const movesEl = document.querySelector('.moves');
	movesEl.innerHTML = 0 + ' ';
	//reset openedCards
	openedCards = [];
	//reset matchedPairs to 0
	matchedPairs = 0;
	//get all the stars back
	for (let i=0; i<3; i++) {
		stars[i].className = 'fa fa-star';
	}
	//reset the timer
	cardClicked = true;
	sec = 0;
	min = 0;
	hours = 0;
	stopTimer();
	timer.innerHTML = `${numberFormat(hours)}:${numberFormat(min)}:${numberFormat(sec)}`;
}

/**
* @description Starts the game
*/
function startGame() {
	resetGame();
	createDeck();
	shuffle(icons);
	addIcons();
	clickCard();
}

startGame();


	

