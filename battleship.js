let isSunk = false;
let guesses = 0;
let hits = 0;
let location1 = 3,
	location2 = 4,
	location3 = 5;
let guess;
while (isSunk === false) {
	guess = prompt('Ready, aim, fire! Enter a number from 0-6');
	if (guess < 0 || guess > 6) guess = prompt('Enter a valid number');
	else {
		guesses++;
		if (guess == location1 || guess == location2 || guess == location3) {
			alert('HIT!');
			hits++;
			if (hits === 3) {
				isSunk = true;
				alert('Battleship has sunk!');
			}
		} else {
			alert('MISS!');
		}
	}
}
let stats = `You took ${guesses} guesses to sink the battleship, which means your shooting acccuracy was ${(3 /
	guesses) *
	100}%`;
alert(stats);
