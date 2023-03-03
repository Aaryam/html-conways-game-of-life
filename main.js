const main = document.getElementById('main');
const bound = 19;

var cellProperties = [];
var isTriggered = false

function createBoard(bound) {
    if (bound % 2 == 1) {
        for (let h = 0; h < bound; h++) {
            const row = document.createElement('div');
            row.classList.add('row');
            main.appendChild(row);
        }

        for (let x = 0; x < document.getElementsByClassName('row').length; x++) {
            const row = document.getElementsByClassName('row')[x];

            for (let i = 0; i < bound; i++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                row.appendChild(cell);

                cell.id = ((x + 1) * bound + i) - bound + 1;
                cell.addEventListener('click', function (e) {
                    if (!cell.classList.contains('active')) {
                        cell.classList.add('active');
                        getCellProperties(cell.id).isDead = false;
                    }
                }); 

                cell.addEventListener('contextmenu', function (e) {
                    if (cell.classList.contains('active')) {
                        e.preventDefault();
                        cell.classList.remove('active');
                        getCellProperties(cell.id).isDead = true;
                    }
                }); 

                const mid = bound - (bound - 1)/2;

                cell.id = mid - (cell.id - (x) * bound) + "," + ((bound - 1) / 2 - x);

                if (cell.id == '0,0') {
                    cell.style.backgroundColor = 'gray';
                }

                let cellProperty = {
                    id: cell.id,
                    lifeSpan: 1,
                    isDead: true,
                };

                cellProperties.push(cellProperty);

                if (Math.random() > 1) {
                    cell.classList.add('active');
                    getCellProperties(cell.id).isDead = false;
                }
            }
        }
    }
    else {
        return;
    }
}

document.body.addEventListener('keydown', function (e) {
    if (e.key == 'c') {
        isTriggered = true;
    }
})

function computeAutomata() {

    for (let i = 0; i < document.getElementsByClassName('cell').length; i++) {
        const cell = document.getElementsByClassName('cell')[i];
        const property = getCellProperties(cell.id);

        var isActive = cell.classList.contains('active');
        var neighbors = getCellNeighbors(cell.id);

        if (cell.classList.contains('active')) {
            property.isDead ?? cell.classList.remove('active');

            if (property.isDead) {
                if (cell.classList.contains('active')) {
                    cell.classList.remove('active');
                }
            }
        }
        else {
            if (!property.isDead) {
                if (!cell.classList.contains('active')) {
                    cell.classList.add('active');
                }
            }
        }
    }

    for (let i = 0; i < document.getElementsByClassName('cell').length; i++) {
        const cell = document.getElementsByClassName('cell')[i];
        const property = getCellProperties(cell.id);

        var isActive = cell.classList.contains('active');
        var neighbors = getCellNeighbors(cell.id);

        if (!isActive && neighbors.length == 3) {
            // cell.classList.add('active');
            property.isDead = false;
        }
        else if (neighbors.length < 2 || neighbors.length > 3) {
            if (isActive) {
                // cell.classList.remove('active');
                property.isDead = true;
            }
        }
    }
}

function getCellNeighbors(cellID) {
    var cellX = getX(cellID);
    var cellY = getY(cellID);

    var currentNeighbors = [];
    var finalNeighbors = [];

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            let currentCell = (cellX + x) + "," + (cellY + y);

            if (currentCell != cellID) {
                currentNeighbors.push(currentCell);
            }
        }
    }

    for (let i = 0; i < currentNeighbors.length; i++) {
        const neighbor = currentNeighbors[i];

        if (document.getElementById(neighbor) != null) {
            if (document.getElementById(neighbor).classList.contains('active')) {
                finalNeighbors.push(neighbor);
            }
        }
    }

    return finalNeighbors;
}

function getCellProperties(cellID) {
    for (let i = 0; i < cellProperties.length; i++) {
        const cellProperty = cellProperties[i];

        if (cellProperty.id == cellID) {
            return cellProperty;
        }
    }
}

function getX(cellID) {
    return parseInt(cellID.split(",")[0]);
}

function getY(cellID) {
    return parseInt(cellID.split(",")[1]);
}

function tick() {
    if (isTriggered) {
        computeAutomata();
    }
}

setInterval(function () {
    tick();
}, 100)

createBoard(bound);
