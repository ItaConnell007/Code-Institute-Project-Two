// Select all the memory cards on the page
// Resource: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
const memoryCards = document.querySelectorAll(".card-memory");

let cardFlipped = false; // tracks if a card has been flipped
let blockBoard = false; // used to prevent further moves when two cards are flipped
let initialCard; // the first card that gets flipped
let finalCard; // the second card that gets flipped
let tally = 0; // keeps track of the number of matched pairs

// Immediately Invoked Function Expression (IIFE) to randomize the order of the cards when the page loads
// Resource: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
(function randomize() {
	memoryCards.forEach(card => {
		// Math.random generates a random number between 0 and 1
		// We multiply by 12 to get a number between 0 and 11, then round down to the nearest whole number
		// Resource: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
		let randomNumber = Math.floor(Math.random() * 12);
		// The order CSS property sets the order of the flex items
		// Resource: https://developer.mozilla.org/en-US/docs/Web/CSS/order
		card.style.order = randomNumber;
	});
})();

// Function that handles the logic when a card is clicked
function cardFlip () {
	if (blockBoard) return; // if the board is blocked, do nothing
	if (this === initialCard) return; // if the card that was clicked is the first card, do nothing
	this.classList.add("flipped"); // add the "flipped" class to the card that was clicked
	if (!cardFlipped) {
		// If no card has been flipped yet, this is the first card
		cardFlipped = true;
		initialCard = this;
		return;
	} 
	// If a card has been flipped, this is the second card
	finalCard = this;
	verifyMatch(); // check if the two cards match
	checkWin(); // check if the game has been won
}

// Function to check if the two flipped cards match
function verifyMatch () {
	// If the data-card attribute of the first card matches the data-card attribute of the second card, deactivate the cards
	// Else, flip the cards back over
	// Resource: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
	(initialCard.dataset.card === finalCard.dataset.card) ? deactivateCards() : revertFlippedCards();
}

// Function to deactivate the cards if they match
function deactivateCards () {
	initialCard.removeEventListener("click", cardFlip); // remove the click event listener from the first card
	finalCard.removeEventListener("click", cardFlip); // remove the click event listener from the second card
	resetPlay(); // reset the game state
	tally ++; // increment the tally
}

// Function to flip the cards back over if they don't match
function revertFlippedCards () {
	blockBoard = true; // block the board
	setTimeout(() => {
		// After 1 second, remove the "flipped" class from the two cards and reset the game state
		// Resource: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
		initialCard.classList.remove("flipped");
		finalCard.classList.remove("flipped");
		resetPlay();
	}, 1000);
}

// Function to reset the game state
// This is done by setting the variables cardFlipped and blockBoard to false and initialCard and finalCard to null
// Resource: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
function resetPlay () {
	[cardFlipped, blockBoard] = [false, false];
	[initialCard, finalCard] = [null, null];
}

// Function to check if the game has been won
// If the tally is 6 (meaning all card pairs have been found), display a win message after a short delay
// Resource: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
function checkWin () {
	if (tally === 6) {
		setTimeout(() => {
			// Use getElementById to find the win message element and change its display style to "flex"
			// Resource: https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
			document.getElementById("winMessage").style.display = "flex";
		}, 300);
	}
}

// Attach an event listener to each memory card
// When a card is clicked, the cardFlip function will be called
// Resource: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
memoryCards.forEach(card => card.addEventListener("click", cardFlip));
