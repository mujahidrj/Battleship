// View is in charge of showing Hits/Misses and displaying the Message in the Top Left Hand Corner
let view = {
	displayMessage: function(msg) {
		let messageArea = document.getElementById('messageArea');
		messageArea.innerHTML = msg;
	},
	displayHit: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute('class', 'hit');
	},
	displayMiss: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute('class', 'miss');
	},
};

// Model keeps track of the current state of the game, including ship locations, what has
// been hit, and how many ships have been sunk
let model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,

	// Initial array with locations of the ships
	ships: [
		{ locations: [0, 0, 0], hits: ['', '', ''] },
		{ locations: [0, 0, 0], hits: ['', '', ''] },
		{ locations: [0, 0, 0], hits: ['', '', ''] },
	],

	// Turning the guess in to a hit or miss
	fire: function(guess) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			let index = ship.locations.indexOf(guess);
			// Hit
			if (index >= 0) {
				ship.hits[index] = 'hit';
				view.displayHit(guess);
				view.displayMessage('HIT!');
				// If the hit ends up sinking a ship
				if (this.isSunk(ship)) {
					view.displayMessage('Battleship Sunk');
					this.shipsSunk++;
				}
				return true;
			}
		}
		// Miss
		view.displayMiss(guess);
		view.displayMessage('You missed.');
		return false;
	},

	// Checks to see if the hit ends up sinking any of the ships
	isSunk: function(ship) {
		for (let i = 0; i < this.numShips; i++) {
			if (ship.hits[i] !== 'hit') {
				return false;
			}
		}
		return true;
	},

	// Generates all the ship's locations with the help of generateShip
	generateShipLocations: function() {
		let locations;
		for (let i = 0; i < this.numShips; i++) {
			// Used a do while because there can't be a collision on the first location generated
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	// Helper function for generateShipLocations that generates random locations for a ship
	generateShip: function() {
		let row, col;
		let direction = Math.floor(Math.random() * 2);

		// Horizontal Ship
		if (direction) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
		}
		// Vertical Ship
		else {
			row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
			col = Math.floor(Math.random() * this.boardSize);
		}

		let newShipLocations = [];
		for (let i = 0; i < this.shipLength; i++) {
			if (direction) {
				// Push the string made up of row and column plus shiplength to generate the full ship
				newShipLocations.push(row + '' + (col + i));
			} else {
				newShipLocations.push(row + i + '' + col);
			}
		}
		return newShipLocations;
	},

	// Determines if there is a collision on any of the generated ship locations
	collision: function(locations) {
		// Goes through all of the ships
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			// Checks if any of the new ships locations array clashes with an existing ships location
			for (let j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) return true;
			}
		}
		return false;
	},
};

// Controller gets the guess, processes it, and sends it to the model object
// Also keeps track of guesses and when the game is over
let controller = {
	guesses: 0,

	// Gets the guess and sends it to the model once it's parsed
	processGuess: function(guess) {
		let location = parseGuess(guess);
		if (location) {
			this.guesses++;
			let hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips)
				view.displayMessage(`All battleships sunk in ${this.guesses} guesses.`);
		}
	},
};

// Goes through the guess and decodes it
function parseGuess(guess) {
	let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

	// Guess Validation
	if (guess === null || guess.length !== 2) alert('Please enter a letter and number on the board');
	else {
		let first = guess.charAt(0);
		let row = alphabet.indexOf(first);
		let column = guess.charAt(1);

		// More Validation
		if (isNaN(row) || isNaN(column)) alert("That isn't on the board");
		else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize)
			alert("Oops that's off the board!");
		else return row + column; // Concatenation of Row and Column if valid move
	}
	return null;
}

// Generate the ship locations and adds click handler for button and keypress handler for input
function init() {
	let fireButton = document.getElementById('fireButton');
	fireButton.onclick = handleFireButton;
	let guessInput = document.getElementById('guessInput');
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}
// Handler for Fire Button
function handleFireButton() {
	let guessInput = document.getElementById('guessInput');
	let guess = guessInput.value.toUpperCase(); // Allows the guess to be case insensitive with chaining
	controller.processGuess(guess);
	guessInput.value = '';
}
// Allows user to hit enter instead of having to click fire every time
function handleKeyPress(e) {
	let fireButton = document.getElementById('fireButton');
	if (e.keyCode === 13) {
		// key code for return/enter
		fireButton.click();
		return false;
	}
}

window.onload = init;
