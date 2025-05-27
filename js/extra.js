const playerOne = document.getElementById("readyPlayerOne")
const playerTwo = document.getElementById("readyPlayerOne")

const wasd = document.getElementById("wasd")

const arrow = document.getElementById("arrow")


const homePage = document.getElementById("homePage")

const menuSize = innerHeight - 10 + `px`

homePage.style.width = menuSize
homePage.style.height = menuSize


const characterSelectMenu = document.getElementById("characterSelectMenu")

characterSelectMenu.style.width = menuSize
characterSelectMenu.style.height = menuSize


let characters = ['thimble', 'tony', 'basketball god', 'hatsune miku', 'teddie']

document.addEventListener('keydown', function (event) {
    if (event.key === 'w') {
        if (wasd.classList.contains("wasdOnline")) {

            playerOne.classList.add("playerOneSelected")
            playerOne.classList.remove("showPlayerOne")
            wasd.classList.add("wasdSelected")

        }
        else if (characterSelectMenu.classList.contains("show")) {
            playerOne.src = "../img/characters/thimble.png"
            playerOne.classList.add("showPlayerOne")



            wasd.classList.add("wasdOnline")
            wasd.classList.remove("notOnline")

        }


    }

    if (event.key === 's') {
        if (wasd.classList.contains("wasdSelected")) {
            playerOne.classList.remove("playerOneSelected")
             playerOne.classList.add("showPlayerOne")
            wasd.classList.remove("wasdSelected")

        }
        else if (characterSelectMenu.classList.contains("show")) {
            playerOne.src = "../img/characters/placeholder.png"

            playerOne.classList.remove("showPlayerOne")


            wasd.classList.remove("wasdOnline")
            wasd.classList.add("notOnline")
        }


    }

    if (event.key === 'ArrowUp') {
        
        if (arrow.classList.contains("arrowPlayerSelectingCharacter")) {

            
            arrow.classList.add("arrowPlayerLocked")

        }
        else if (characterSelectMenu.classList.contains("show")) {
            



            arrow.classList.add("arrowPlayerSelectingCharacter") 
            arrow.classList.remove("arrowNoPLayer")

        }

    }








});

