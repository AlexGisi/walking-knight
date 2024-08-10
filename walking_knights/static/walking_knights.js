let start_square = null;  // Optional<Int>
let end_square = null;  // Optional<Int>

document.getElementById('btn-select-start').addEventListener('click', onSelectStart);
document.getElementById('btn-select-end').addEventListener('click', onSelectEnd);
document.getElementById('btn-calculate').addEventListener('click', onCalculate)

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
}

function clearMovesOnBoard() {
    sqs.forEach(sq => {
        sq.innerText = "";
    })
}

function sendMoveRequest(startSquare, endSquare) {
    // Create the request body
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
