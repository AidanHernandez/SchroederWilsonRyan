const playerOne = document.getElementById("readyPlayerOne")
const playerTwo = document.getElementById("readyPlayerTwo")

const wasd = document.getElementById("wasd")
const arrow = document.getElementById("arrow")


const homePage = document.getElementById("homePage")

const menuSize = 1008 + `px`

homePage.style.width = menuSize
homePage.style.height = menuSize


const characterSelectMenu = document.getElementById("characterSelectMenu")

characterSelectMenu.style.width = menuSize
characterSelectMenu.style.height = menuSize


let characters = [
    ['thimble', 'tony', 'basketballGod', 'hatsune miku', 'teddie'],
    ['thimble', 'tony', 'basketballGod', 'hatsune miku', 'teddie']
]

let playerOptions = []

let playerIndexes = [0, 0];

let characterNumber = 0;


document.addEventListener('keydown', function (event) {


    switch (event.key) {
        case 'w':
            if (wasd.classList.contains("wasdOnline")) {

                playerOne.classList.add("playerOneSelected")
                playerOne.classList.remove("showPlayerOne")

                wasd.classList.add("wasdSelected")

            }
            else if (characterSelectMenu.classList.contains("show")) {

                showCharacter(playerOne)


                playerOne.classList.add("showPlayerOne")



                wasd.classList.add("wasdOnline")
                wasd.classList.remove("notOnline")

            }
            break;
        case 'd':
            if (playerOne.classList.contains("showPlayerOne")) {

                characterScroll(playerOne)
            }
            break;
        case 's':
            if (wasd.classList.contains("wasdSelected")) {
                playerOne.classList.remove("playerOneSelected")
                playerOne.classList.add("showPlayerOne")


                wasd.classList.remove("wasdSelected")

            }
            else if (characterSelectMenu.classList.contains("show")) {


                removeCharacter(playerOne)
                playerOne.classList.remove("showPlayerOne")


                wasd.classList.remove("wasdOnline")
                wasd.classList.add("notOnline")
            }
            break;
        case 'ArrowUp':
            if (arrow.classList.contains("arrowPlayerSelectingCharacter")) {

                arrow.classList.add("arrowPlayerLocked")

                playerTwo.classList.add("playerTwoSelected")
                playerTwo.classList.remove("showplayerTwo")

            }
            else if (characterSelectMenu.classList.contains("show")) {

                showCharacter(playerTwo)

                //shows the player
                playerTwo.classList.add("showplayerTwo")

                //arrowkeys
                arrow.classList.add("arrowPlayerSelectingCharacter")
                arrow.classList.remove("arrowNoPLayer")

            }
            break;
        case 'ArrowDown':
            if (arrow.classList.contains("arrowPlayerLocked")) {
                arrow.classList.remove("arrowPlayerLocked")

                playerTwo.classList.remove("playerTwoSelected")
                playerTwo.classList.add("showplayerTwo")

            }
            else if (characterSelectMenu.classList.contains("show")) {

                removeCharacter(playerTwo)

                playerTwo.classList.remove("showplayerTwo")

                arrow.classList.remove("arrowPlayerSelectingCharacter")
                arrow.classList.add("arrowNoPLayer")
            }
            break;
        case 'ArrowRight':
            if (playerTwo.classList.contains("showplayerTwo")) {

                characterScroll(playerTwo)
            }
            break;
    }



});



function showCharacter(player) {


    let character = characters[1][0]




    showCharacterByName(player, character)



    switch (player) {
        case playerOne:
            playerOptions[0] = character

            break;
        case playerTwo:
            playerOptions[1] = character
            break;
        // case playerOne:
        //     playerOptions[0] = character
        //     break;
        // case playerOne:
        //     playerOptions[0] = character
        //     break;

    }

    for (i = characters[1].length; i >= 0; i--) {

        if (characters[1][i] === character) {
            characters[1].splice(i, 1)
        }
    }

    console.log(characters)

}

function removeCharacter(player) {


    switch (player) {
        case playerOne:
            playerOptions[0] = ""

            break;
        case playerTwo:
            playerOptions[1] = ""

            break;
    }

    addPlayer()

    player.src = "../img/characters/placeholder.png"
}

function showCharacterByName(player, character) {
    switch (character) {
        case 'thimble':

            player.src = "../img/characters/thimble.png";
            switch (player) {
                case playerOne:
                    removeColors(wasd)
                    wasd.classList.add("thimble")


                break;
            }
            break;
        case 'tony':
            player.src = "../img/characters/tony.png";
            if (player = playerOne) {
                wasd.classList.add("tony")
            }
            break;
        case 'basketballGod':
            player.src = "../img/characters/basketballgod.png";
            if (player = playerOne) {
                wasd.classList.add("basketball")
            }
            break;
        case 'hatsune miku':
            player.src = "../img/characters/miku.png";
            if (player = playerOne) {
                wasd.classList.add("miku")
            }
            break;
        case 'teddie':
            player.src = "../img/characters/teddie.png";
            if (player = playerOne) {
                wasd.classList.add("teddie")
            }
            break;
        default:
            player.src = "../img/characters/placeholder.png";
            break;
    }
}



function addPlayer() {
    // Clear current list of available characters
    characters[1] = [];

    // Re-add characters from the master list, excluding ones currently selected by players
    for (let i = 0; i < characters[0].length; i++) {
        const character = characters[0][i];
        if (!playerOptions.includes(character)) {
            characters[1].push(character);
        }
    }
}


function characterScroll(player) {
    let playerIndex = (player === playerOne) ? 0 : 1;
    let currentCharacter = playerOptions[playerIndex];

    // Rebuild the character pool with everything
    addPlayer();

    // Remove the currently selected character from pool
    let currentIndex = characters[1].indexOf(currentCharacter);
    if (currentIndex !== -1) {
        characters[1].splice(currentIndex, 1);
    }

    // Find the next character that's not taken
    let attempts = 0;
    do {
        playerIndexes[playerIndex] = (playerIndexes[playerIndex] + 1) % characters[0].length;
        var nextCharacter = characters[0][playerIndexes[playerIndex]];
        attempts++;
    } while (playerOptions.includes(nextCharacter) && attempts < characters[0].length);

    // Assign new character
    playerOptions[playerIndex] = nextCharacter;
    showCharacterByName(player, nextCharacter);

    // Refresh character pool without duplicates
    addPlayer();
}

['thimble', 'tony', 'basketballGod', 'hatsune miku', 'teddie']

function removeColors(keys){
    for(i = 0; i < characters[0].length; i++){
        keys.classList.remove("thimble")
    }
    
    
}