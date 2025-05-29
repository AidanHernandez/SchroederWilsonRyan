const playerOne = document.getElementById("readyPlayerOne");
const playerTwo = document.getElementById("readyPlayerTwo");
const playerThree = document.getElementById("readyPlayerThree");
const playerFour = document.getElementById("readyPlayerFour");

const wasd = document.getElementById("wasd");
const arrow = document.getElementById("arrow");
const tfgh = document.getElementById("tfgh");
const ijkl = document.getElementById("ijkl");



const homePage = document.getElementById("homePage")

const menuSize = 1008 + `px`

homePage.style.width = menuSize
homePage.style.height = menuSize


const characterSelectMenu = document.getElementById("characterSelectMenu")

characterSelectMenu.style.width = menuSize
characterSelectMenu.style.height = menuSize


let characters = [
    ['thimble', 'tony', 'basketballGod', 'hatsuneMiku', 'teddie'],
    ['thimble', 'tony', 'basketballGod', 'hatsuneMiku', 'teddie']
]

let playerOptions = ["", "", "", ""];
let playerIndexes = [0, 0, 0, 0];


const players = [playerOne, playerTwo, playerThree, playerFour];
const controls = [wasd, arrow, tfgh, ijkl];




document.addEventListener('keydown', function (event) {
    switch (event.key) {

        case 'w': handleJoinOrLock(0); break;
        case 'a': handleScroll(0, -1); break;
        case 'd': handleScroll(0, 1); break;
        case 's': handleUnjoinOrUnlock(0); break;


        case 'ArrowUp': handleJoinOrLock(1); break;
        case 'ArrowLeft': handleScroll(1, -1); break;
        case 'ArrowRight': handleScroll(1, 1); break;
        case 'ArrowDown': handleUnjoinOrUnlock(1); break;


        case 't': handleJoinOrLock(2); break;
        case 'f': handleScroll(2, -1); break;
        case 'h': handleScroll(2, 1); break;
        case 'g': handleUnjoinOrUnlock(2); break;


        case 'i': handleJoinOrLock(3); break;
        case 'j': handleScroll(3, -1); break;
        case 'l': handleScroll(3, 1); break;
        case 'k': handleUnjoinOrUnlock(3); break;

        case ' ': if(canStartGame()){changeScene("mapSelection")} break;

    }
});











function handleJoinOrLock(index) {
    const player = players[index];
    const control = controls[index];

    if (!player.classList.contains("showPlayer")) {
        showCharacter(player);
        player.classList.add("showPlayer");
        control.style.opacity = 0.5;
        control.classList.add("online");
        control.classList.remove("notOnline");
    } else {
        player.classList.add("selected");
        control.classList.remove("online");
        control.classList.add("locked");
        control.style.opacity = 1;
    }

    if (canStartGame()) {

        document.getElementById("characterSelectMenuText").innerText = "Press Space To Start"

    }
    else {
        document.getElementById("characterSelectMenuText").innerText = "Choose Your Character"
    }
}




function handleUnjoinOrUnlock(index) {
    const player = players[index];
    const control = controls[index];

    if (control.classList.contains("locked")) {
        control.classList.remove("locked");
        control.classList.add("online");
        player.classList.remove("selected");
        control.style.opacity = 0.5;
    } else {
        removeCharacter(player);
        player.classList.remove("showPlayer");
        control.classList.remove("online");
        control.classList.add("notOnline");
        control.style.opacity = 1;
        removeColors(control);
    }

    if (canStartGame()) {
        console.log("Ready to start the game!");
        // Optionally call startGame(); or enable a "Start" button here
    }
}




function handleScroll(index, direction) {
    const player = players[index];
    const control = controls[index];


    if (player.classList.contains("showPlayer") && !control.classList.contains("locked")) {
        characterScroll(player, direction);
    }
}




function showCharacter(player) {
    let index = players.indexOf(player);
    let character = characters[1][0];
    showCharacterByName(player, character);
    playerOptions[index] = character;

    characters[1] = characters[1].filter(c => c !== character);
}





function removeCharacter(player) {
    let index = players.indexOf(player);
    playerOptions[index] = "";
    addPlayer();
    player.src = "../img/characters/placeholder.png";
}





function addPlayer() {
    characters[1] = [];
    for (let i = 0; i < characters[0].length; i++) {
        const character = characters[0][i];
        if (!playerOptions.includes(character)) {
            characters[1].push(character);
        }
    }
}





function characterScroll(player, direction = 1) {



    let index = players.indexOf(player);
    let currentCharacter = playerOptions[index];

    addPlayer();
    let currentIndex = characters[1].indexOf(currentCharacter);
    if (currentIndex !== -1) characters[1].splice(currentIndex, 1);

    let attempts = 0;
    let nextCharacter;
    do {
        playerIndexes[index] = (playerIndexes[index] + direction + characters[0].length) % characters[0].length;
        nextCharacter = characters[0][playerIndexes[index]];
        attempts++;
    } while (playerOptions.includes(nextCharacter) && attempts < characters[0].length);

    playerOptions[index] = nextCharacter;
    showCharacterByName(player, nextCharacter);
    addPlayer();
}



function showCharacterByName(player, character) {
    const index = players.indexOf(player);
    const control = controls[index];

    switch (character) {
        case 'thimble':
            player.src = "../img/characters/thimble.png";
            break;
        case 'tony':
            player.src = "../img/characters/tony.png";
            break;
        case 'basketballGod':
            player.src = "../img/characters/basketballgod.png";
            break;
        case 'hatsuneMiku':
            player.src = "../img/characters/miku.png";
            break;
        case 'teddie':
            player.src = "../img/characters/teddie.png";
            break;
        default:
            player.src = "../img/characters/placeholder.png";
            break;
    }

    removeColors(control);
    control.classList.add(character);
}



function removeColors(control) {
    for (let i = 0; i < characters[0].length; i++) {
        control.classList.remove(characters[0][i]);
    }
}

function canStartGame() {
    let lockedCount = 0;
    let choosing = 0
    for (let i = 0; i < controls.length; i++) {
        if (controls[i].classList.contains("locked")) {
            lockedCount++;
        }
        if (controls[i].classList.contains("online")) {
            choosing++
        }
    }

    if (lockedCount >= 2 && choosing === 0) {
        return true
    }

}
