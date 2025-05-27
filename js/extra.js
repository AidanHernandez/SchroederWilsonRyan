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
    ['thimble', 'tony', 'basketball god', 'hatsune miku', 'teddie'],
    ['thimble', 'tony', 'basketball god', 'hatsune miku', 'teddie']
]

let playerOptions = []
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
    }



});
['thimble', 'tony', 'basketball god', 'hatsune miku', 'teddie']

function showCharacter(player) {
    characterNumber++
    let character = characters[1][0]



    if (character === 'thimble') {
        player.src = "../img/characters/thimble.png"
        characters[1].splice(0, 1);
    } else if (character === 'tony') {
        player.src = "../img/characters/tony.png"
        characters[1].splice(0, 1);
    }

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


}

function removeCharacter(player) {


    switch (player) {
        case playerOne:
            characters[1].splice(0, 0, playerOptions[0]);
            playerOptions[0] = ""
            
            break;
        case playerTwo:
            characters[1].splice(0, 0, playerOptions[1]);
            playerOptions[1] = ""
            break;
    }

    characterNumber--

    player.src = "../img/characters/placeholder.png"
}
