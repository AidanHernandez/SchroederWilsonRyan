const playerOne = document.getElementById("readyPlayerOne")
const wasd = document.getElementById("wasd")


const homePage = document.getElementById("homePage")

const menuSize = innerHeight - 10 + `px`

homePage.style.width = menuSize
homePage.style.height = menuSize


const characterSelectMenu = document.getElementById("characterSelectMenu")

characterSelectMenu.style.width = menuSize
characterSelectMenu.style.height = menuSize


let characters = ['thimble', 'tony', 'basketball god', 'hatsune miku', 'teddie']

document.addEventListener('keydown', function(event) {
    if (event.key === 'w') {
        if(wasd.classList.contains("wasdOnline")){
            
            wasd.classList.add("wasdSelected")
            
        }
        else if(characterSelectMenu.classList.contains("show")){
            playerOne.src = "../img/characters/thimble.png"
            wasd.classList.add("wasdOnline")
            
        }
      
     
    }

    if (event.key === 's') {
        if(wasd.classList.contains("wasdSelected")){
            
            wasd.classList.remove("wasdSelected")
            
        }
        else if(characterSelectMenu.classList.contains("show")){
            playerOne.src = "../img/characters/placeholder.png"
            wasd.classList.remove("wasdOnline")
            
        }
      
     
    }
  });

