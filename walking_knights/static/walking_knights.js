let start_square = null;  // Optional<Int>
let end_square = null;  // Optional<Int>

document.getElementById('btn-select-start').addEventListener('click', onSelectStart);
document.getElementById('btn-select-end').addEventListener('click', onSelectEnd);
document.getElementById('btn-calculate').addEventListener('click', onCalculate)
document.getElementById('btn-calculate-longest').addEventListener('click', onCalculateLongest)
document.getElementById('btn-calculate-longest-dp').addEventListener('click', onCalculateLongestDP)

let sqs = Array.from(document.getElementsByClassName('board-square'));

sqs.forEach(sq => {
    sq.addEventListener('click', onSelect);
})

function onSelectStart() {
    clearMovesOnBoard();
    sqs.forEach(sq => {
        sq.classList.add('start-hover');
        sq.classList.remove('end-hover');
        sq.classList.remove('start-square');
    });
}

function onSelectEnd() {
    clearMovesOnBoard();
    sqs.forEach(sq => {
        sq.classList.remove('end-square');
        sq.classList.remove('start-hover');
        sq.classList.add('end-hover');
    });
}

function onSelect(event) {
    let sq_elem = event.target;
    if (sq_elem.classList.contains('start-hover')) {
        sq_elem.classList.add('start-square');
        start_square = parseInt(sq_elem.id);
    } else if (sq_elem.classList.contains('end-hover')) {
        sq_elem.classList.add('end-square');
        end_square = parseInt(sq_elem.id);
    }

    sqs.forEach(sq => {
        sq.classList.remove('start-hover');
        sq.classList.remove('end-hover');
    })
}

function addMessage(text) {
    document.getElementById('output-msg').textContent = text;
}

function addError(text) {
    document.getElementById('error-msg').textContent = text;
}

function onCalculate() {
    clearMovesOnBoard();
    addMessage('');
    addError('');
    if (!start_square || !end_square) {
        addError('Select a start and end square!');
    } else {
        sendMoveRequest(start_square, end_square);
    }
}

// moves: Array<Int>
function addMovestoBoard(moves) {
    for (let i = 0; i < moves.length; i++) {
        document.getElementById(moves[i].toString()).innerText = i;
    }
    document.getElementById('output-msg').innerText = "Going from square " + moves[0].toString() + " to " + moves[moves.length - 1].toString() + " takes " + (moves.length-1).toString();
    if (moves.length > 2) {
        document.getElementById('output-msg').innerText += " moves!"
    } else {
        document.getElementById('output-msg').innerText += " move!"
    }
}

function clearMovesOnBoard() {
    sqs.forEach(sq => {
        sq.innerText = "";
    });
}

function clearSquareSelection() {
    sqs.forEach(sq => {
        sq.classList.remove('start-square');
        sq.classList.remove('end-square');
    })
}

function clearEverything() {
    clearMovesOnBoard();
    clearSquareSelection();
    addMessage('');
    addError('');
}

function addWalkToBoard(moves) {
    document.getElementById(moves[0].toString()).classList.add('start-square');
    document.getElementById(moves[moves.length-1].toString()).classList.add('end-square');
    addMovestoBoard(moves);
}

function sendMoveRequest(startSquare, endSquare) {
    const requestBody = {
        start_square: startSquare,
        end_square: endSquare
    };

    fetch('/knight_walk_move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            addMovestoBoard(data.moves);
        })
        .catch((error) => {
            addError(error)
        });
}

function onCalculateLongest() {
    clearEverything();
    addMessage("Calculating...")

    const requestBody = {
        use_cache: false,
    };

    fetch('/knight_walk_longest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            addWalkToBoard(data.moves);
            addMessage("Took " + data.time + " seconds!")
        })
        .catch((error) => {
            addError(error)
        });
}

function onCalculateLongestDP() {
    clearEverything();
    addMessage("Calculating...")

    const requestBody = {
        use_cache: true,
    };

    fetch('/knight_walk_longest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            addWalkToBoard(data.moves);
            addMessage("Took " + data.time + " seconds using DP!")
        })
        .catch((error) => {
            addError(error)
        });
}
