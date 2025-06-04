
var playerTut;

var stars;
var bombs;
var platforms;
var cursors;
let cursorUse = false;
var score = 0;
var gameOver = false;
var scoreText;
var gravity = 200;
let step = 1
let isTouchingWallLeft = false;
let isTouchingWallRight = false;
let isWallSliding = false;
let sceneChange = false;
let gameStart = false;
let bigPlat;
let platSmall;

let wasdPLayer;
let isJumping2 = false;
let coyoteTimer2 = 0;
let jumpBufferTimer2 = 0;
let jumpTimer2 = 0;
let coyoteTimer = 0;
let jumpBufferTimer = 0;
let isJumping = false;
let jumpTimer = 0;
let GRAVITY = 1500;
let itPlayer = '';

let itTimer1 = 0;
let itTimer2 = 0;
let itText1, itText2;

let players = [];
let playerInputs = [];
let playerStates = [];
let itTimers = [0, 0, 0, 0];
let itTexts = [];


let playerEliminated = {}; // key: player slot (0–3), value: true/false


let tagCooldown = 1000;
let lastTagTime = 0;

let playerNumber = ["", "", "", ""];

const JUMP_VELOCITY = -750;
const COYOTE_TIME = 100;
const JUMP_BUFFER_TIME = 100;
const FIRST_JUMP_VELOCITY = -750;




// Helper function (can be inside or outside BaseScene)
function handlePlayerMovement(player, input, state, scene, playerId) {

    const onGround = player.body.touching.down;
    const now = scene.time.now;

    const COYOTE_TIME = 100;
    const JUMP_BUFFER_TIME = 100;
    const FAST_FALL_GRAVITY = 1600;
    const NORMAL_GRAVITY = 1000;
    const JUMP_CUT_MULTIPLIER = 0.5;

    const speed = (itPlayer === playerId) ? 400 : 300;

    // Track grounded time
    if (onGround) {
        state.lastOnGroundTime = now;
    }

    // Horizontal movement
    if (input.left.isDown) {
        player.setVelocityX(-speed);
        // player.anims.play('left', true);
    } else if (input.right.isDown) {
        player.setVelocityX(speed);
        // player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        // player.anims.play('turn');
    }

    // Jump buffer
    if (Phaser.Input.Keyboard.JustDown(input.up)) {
        state.lastJumpPressTime = now;
    }

    const canJump = onGround || (now - state.lastOnGroundTime <= COYOTE_TIME);
    const bufferedJump = now - state.lastJumpPressTime <= JUMP_BUFFER_TIME;

    if (bufferedJump && canJump) {
        player.setVelocityY(FIRST_JUMP_VELOCITY);  // should be negative, e.g., -500
        state.isJumping = true;
        state.lastJumpPressTime = 0;
    }

    // Variable jump height — cut jump if key released
    if (state.isJumping && input.up.isUp && player.body.velocity.y < 0) {
        player.setVelocityY(player.body.velocity.y * JUMP_CUT_MULTIPLIER);
        state.isJumping = false;
    }

    // Fast fall — increase gravity if falling
    if (player.body.velocity.y > 0) {
        player.body.setGravityY(FAST_FALL_GRAVITY);
    } else {
        player.body.setGravityY(NORMAL_GRAVITY);
    }

    // Reset jump state
    if (onGround && player.body.velocity.y >= 0) {
        state.isJumping = false;
    }
}





//  Base scene with shared update logic
class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    update() {
        if (cursorUse) {
            GRAVITY = 1500;
            this.physics.world.gravity.y = GRAVITY;
            handlePlayerMovement(playerOne, wasdPLayer, playerState1, this);
            handlePlayerMovement(player2, cursors, playerState2, this);

        } else if (cursorUse === false) {
            // Your scripted intro behavior (unchanged)
            GRAVITY = 200;
            this.physics.world.gravity.y = GRAVITY;
            if (step === 1 && playerTut.y === 929) {
                playerTut.setVelocityX(-160);
                playerTut.anims.play('left', true);
                if (playerTut.x <= 626) {
                    playerTut.setVelocityY(-330);
                }
            }

            if (playerTut.y === 675.5 && playerTut.x <= 140 && step === 1) {
                step = 2;
                playerTut.setVelocityX(160);
                playerTut.anims.play('right', true);
            }

            if (playerTut.x >= 142 && playerTut.y === 675.5 && step === 2) {
                playerTut.setVelocityY(-360);
            }

            if (playerTut.x >= 839 && step === 2) {
                step = 3;
                playerTut.setVelocityX(-160);
                playerTut.anims.play('left', true);
            }

            if (playerTut.x <= 17 && step === 3) {
                playerTut.setVelocityX(0);
                playerTut.setVelocityY(-360);
                if (playerTut.y <= 696.5) {
                    playerTut.setVelocityX(160);
                    playerTut.anims.play('right', true);
                    step = 4;
                }
            }

            if (playerTut.x === 992 && step === 4 && playerTut.y === 929) {
                step = 1;
            }

            if (playerTut.body.velocity.x === 0) {
                playerTut.anims.play('turn');
            }
        }
    }


    createPhysicsRect(x, y, width, height, color) {
        const rect = this.add.rectangle(x, y, width, height, color);
        this.physics.add.existing(rect, true);
        this.physics.add.collider(playerTut, rect);
        return rect;
    }
}


//  Start Menu Scene
class StartMenu extends BaseScene {
    constructor() {
        super('StartMenu');
    }

    preload() {
        this.load.spritesheet('dude', '../phaser3-tutorial-src/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('startMenu', '../img/bgHome.png');
        this.load.image('ground', '../img/top.svg');
    }

    create() {
        this.add.image(0, 0, 'startMenu').setOrigin(0, 0);
        platforms = this.physics.add.staticGroup();
        platforms.create(505, 1018 - 50, 'ground')

        playerTut = this.physics.add.sprite(2048, 929, 'dude');
        playerTut.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.createPhysicsRect(241, 714.5, 290, 30, `00FFFFFF`);
        this.createPhysicsRect(765, 714.5, 290, 30, `00FFFFFF`);
        this.createPhysicsRect(505, 456, 375, 30, `00FFFFFF`);

        cursorUse = false

        this.physics.add.collider(playerTut, platforms);
    }
}



class characterSelection extends BaseScene {
    constructor() {
        super('characterSelection');
    }

    preload() {

        this.load.image('startMenu', '../img/bgHome.png');
        this.load.image('ground', '../img/top.svg');
    }

    create() {
        this.add.image(0, 0, 'startMenu').setOrigin(0, 0);



        this.createPhysicsRect(0, 1018 - 25, 2048, 30, `0x56421C`);

        platforms = this.physics.add.staticGroup();
        platforms.create(505, 1018 - 50, 'ground')






        cursorUse = null


    }
}

class levelSelect extends BaseScene {
    constructor() {
        super('levelSelect');
    }

    preload() {

        this.load.image('startMenu', '../img/bgHome.png');
        this.load.image('ground', '../img/top.svg');
    }

    create() {
        this.add.image(0, 0, 'startMenu').setOrigin(0, 0);



        this.createPhysicsRect(0, 1018 - 25, 2048, 30, `0x56421C`);

        platforms = this.physics.add.staticGroup();
        platforms.create(505, 1018 - 50, 'ground')






        cursorUse = null


    }
}






class mapOne extends BaseScene {
    constructor() {
        super('mapOne');
    }

    preload() {

        this.load.image('platBig', '../img/platBig.svg');
        this.load.image('platSmall', '../img/platSmall.svg');
        this.load.image('startMenu', '../img/bgHome.png');
        this.load.image('ground', '../img/top.svg');
        this.load.image('bounce', '../img/bouncePad.svg');


        this.load.image('thimble', '../img/charactersPlayableSize/thimble.png');
        this.load.image('tony', '../img/charactersPlayableSize/tony.png');
        this.load.image('basketballGod', '../img/charactersPlayableSize/basketBallGod.png');
        this.load.image('hatsuneMiku', '../img/charactersPlayableSize/miku.png');
        this.load.image('teddie', '../img/charactersPlayableSize/teddie.png');
        // this.load.spritesheet('dude', '../phaser3-tutorial-src/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {

        this.add.image(0, 0, 'startMenu').setOrigin(0, 0);



        let bouncyPad = this.physics.add.staticGroup();
        bouncyPad.create(400, 950, 'bounce')
        bouncyPad.create(500, 500, 'bounce')
        bouncyPad.create(10, 520, 'bounce')


        bigPlat = this.physics.add.staticGroup();
        bigPlat.create(800, 850, 'platBig')
        bigPlat.create(220, 850, 'platBig')
        bigPlat.create(500, 700, 'platBig')
        bigPlat.create(200, 540, 'platBig')


        platSmall = this.physics.add.staticGroup();

        platSmall.create(850, 400, 'platSmall')
        platSmall.create(450, 150, 'platSmall')


        this.createPhysicsRect(0, 1018 - 25, 2048, 30, `0x56421C`);

        platforms = this.physics.add.staticGroup();
        platforms.create(505, 1018 - 50, 'ground')




        for (let i = 0; i < playerNumber.length; i++) {
            if (playerNumber[i] === "Online") {
                const newPlayer = this.physics.add.sprite(100 + (i * 100), 800, playerOptions[i]);
                newPlayer.setCollideWorldBounds(true);
                players.push(newPlayer);
                playerEliminated[i] = false;


                // Input setup: Player 0 uses WASD, Player 1 uses cursors, etc.
                if (i === 0) {
                    playerInputs.push(this.input.keyboard.addKeys({
                        up: Phaser.Input.Keyboard.KeyCodes.W,
                        left: Phaser.Input.Keyboard.KeyCodes.A,
                        down: Phaser.Input.Keyboard.KeyCodes.S,
                        right: Phaser.Input.Keyboard.KeyCodes.D
                    }));
                } else if (i === 1) {
                    playerInputs.push(this.input.keyboard.createCursorKeys());
                } else if (i === 2) {
                    playerInputs.push(this.input.keyboard.addKeys({
                        up: Phaser.Input.Keyboard.KeyCodes.T,
                        left: Phaser.Input.Keyboard.KeyCodes.F,
                        down: Phaser.Input.Keyboard.KeyCodes.G,
                        right: Phaser.Input.Keyboard.KeyCodes.H
                    }));
                } else if (i === 3) {
                    playerInputs.push(this.input.keyboard.addKeys({
                        up: Phaser.Input.Keyboard.KeyCodes.I,
                        left: Phaser.Input.Keyboard.KeyCodes.J,
                        down: Phaser.Input.Keyboard.KeyCodes.K,
                        right: Phaser.Input.Keyboard.KeyCodes.L
                    }));
                }


                // Initialize state
                playerStates.push({
                    isJumping: false,
                    jumpStartTime: 0,
                    lastOnGroundTime: 0,
                    lastJumpPressTime: 0,
                });

                // Colliders
                this.physics.add.collider(newPlayer, platforms);
                this.physics.add.collider(newPlayer, bigPlat);
                this.physics.add.collider(newPlayer, platSmall);
                this.physics.add.collider(newPlayer, bouncyPad, (p, pad) => bouncePlayer(p, pad));
            }
        }















        cursorUse = true
        // cursors = this.input.keyboard.createCursorKeys();

        // this.physics.add.collider(playerOne, platforms);
        // this.physics.add.collider(playerOne, bigPlat);
        // this.physics.add.collider(playerOne, platSmall);

        // this.physics.add.collider(player2, platforms);
        // this.physics.add.collider(player2, bigPlat);
        // this.physics.add.collider(player2, platSmall);


        // this.physics.add.collider(playerOne, bouncyPad, (p, pad) => bouncePlayer(p, pad));

        // this.physics.add.collider(player2, bouncyPad, (p, pad) => bouncePlayer(p, pad));






        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                this.physics.add.overlap(players[i], players[j], tagged, null, this);
            }
        }





        for (let i = 0; i < players.length; i++) {
            itTexts.push(this.add.text(16, 16 + i * 32, `P${i + 1} Time: 0.0s`, { fontSize: '24px', fill: '#ffffff' }).setScrollFactor(0));
        }
    }

    update(time, delta) {
        // Add time to whoever is "it"
        for (let i = 0; i < players.length; i++) {
            if (itPlayer === `player${i + 1}`) {
                if (itTimers[i] >= 30000) {
                    eliminatePlayer(i);
                    return;
                }
                else {
                    itTimers[i] += delta;
                    players[i].setTint(0xff0000);
                    itTexts[i].setText(`P${i + 1} Time: ${(itTimers[i] / 1000).toFixed(1)}s`);
                }


            }




        }
        

        console.log(itTimers[0])

        // Call your movement logic here if needed
        if (cursorUse) {
            this.physics.world.gravity.y = GRAVITY;
            for (let i = 0; i < players.length; i++) {
                const playerKey = `player${i + 1}`;
                handlePlayerMovement(players[i], playerInputs[i], playerStates[i], this, playerKey);
            }

        }
    }
}

class WinScreen extends Phaser.Scene {
    constructor() {
        super('WinScreen');
    }

    create(data) {
        this.add.rectangle(504, 504, 1008, 1008, 0x000000, 0.7);

        this.add.text(504, 200, `🏆 Player ${data.winner} Wins!`, {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        const playAgainButton = this.add.text(504, 400, '🔁 Play Again', {
            fontSize: '36px',
            color: '#00ff00',
            backgroundColor: '#222',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive();

        const homeButton = this.add.text(504, 500, '🏠 Home Screen', {
            fontSize: '36px',
            color: '#ffffff',
            backgroundColor: '#444',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive();

        playAgainButton.on('pointerdown', () => {
            this.scene.start('mapOne');
        });

        homeButton.on('pointerdown', () => {
            
            this.scene.start('StartMenu');
        });
    }
}


//  Game Config
var config = {
    type: Phaser.AUTO,
    width: 1008,
    height: 1008,
    plugins: {
        scene: [{
            key: 'DebugBodyColorsPlugin',
            plugin: PhaserDebugBodyColorsPlugin,
            mapping: 'debugBodyColors'
        }]
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GRAVITY },
            debug: false
        }
    },
    scene: [StartMenu, characterSelection, levelSelect, mapOne, WinScreen],

};

//  Launch game
var game = new Phaser.Game(config);


function changeScene(name) {
    if (name === "homePage") {
        document.getElementById("homePage").classList.toggle("hide");

        game.scene.keys['StartMenu'].scene.start('characterSelection');

        game.scene.stop('StartMenu');

        document.getElementById("characterSelectMenu").classList.toggle("show");
    }
    else if (name === "mapSelection") {
        document.getElementById("characterSelectMenu").classList.toggle("hide");

        game.scene.keys['characterSelection'].scene.start('levelSelect');
        game.scene.stop('characterSelection');

        document.getElementById("levelSelect").classList.toggle("show");

    }
    else if (name === "mapOne") {
        // document.getElementById("homePage").classList.toggle("hide");
        document.getElementById("levelSelect").classList.toggle("hide");
        game.scene.keys['levelSelect'].scene.start('mapOne');

        game.scene.stop('levelSelect');

        let playerOptionsLength = 0

        for (let i = 0; i < playerOptions.length; i++) {

            if (!(playerOptions[i] === "")) {
                playerOptionsLength++

                playerNumber[i] = "Online";

            }
            else {
                playerNumber[i] = "";
            }



        }



        const onlineIndices = playerNumber.map((val, idx) => val === "Online" ? idx : -1).filter(idx => idx !== -1);

        spinWheel(game.scene.keys['mapOne'], onlineIndices, (chosenIndex) => {
            itPlayer = `player${chosenIndex + 1}`;
            console.log(`🎯 Player ${chosenIndex + 1} is IT!`);
        });


    }
}






function tagged(p1, p2) {
    const now = Date.now();
    if (now - lastTagTime < tagCooldown) return;
    lastTagTime = now;

    const idx1 = players.indexOf(p1);
    const idx2 = players.indexOf(p2);
    if (idx1 === -1 || idx2 === -1) return;

    const player1Tag = `player${idx1 + 1}`;
    const player2Tag = `player${idx2 + 1}`;

    // Clear tints
    players.forEach(p => p.clearTint());

    if (itPlayer === player1Tag) {
        console.log(`Player ${idx1 + 1} (it) tagged Player ${idx2 + 1}`);
        itPlayer = player2Tag;
        players[idx2].setTint(0xff0000);
    } else if (itPlayer === player2Tag) {
        console.log(`Player ${idx2 + 1} (it) tagged Player ${idx1 + 1}`);
        itPlayer = player1Tag;
        players[idx1].setTint(0xff0000);
    } else {
        console.log(`Neither player is 'it'. No tag occurred.`);
    }
}




function bouncePlayer(player, pad) {
    if (player.body.blocked.down) {
        player.setVelocityY(-1100);
    }
}

function eliminatePlayer(i) {
    console.log(`Player ${parseInt(i) + 1} has been eliminated!`);

    // Mark as eliminated
    playerEliminated[i] = true;

    // Remove from scene
    players[i].disableBody(true, true);

    // Optional: Remove their "it" status
    if (itPlayer === `player${parseInt(i) + 1}`) {
        const remainingPlayers = Object.keys(players).filter(j => !playerEliminated[j]);
        if (remainingPlayers.length > 0) {
            const nextIt = Phaser.Math.RND.pick(remainingPlayers);
            itPlayer = `player${parseInt(nextIt) + 1}`;
        } else {
            itPlayer = null; // No one left
        }
    }


    itTexts[i].setColor('#888888');
    itTexts[i].setText(`P${parseInt(i) + 1} Eliminated`);


    const remaining = Object.keys(players).filter(j => !playerEliminated[j]);

    if (remaining.length === 1) {
        const winnerIndex = remaining[0];
        console.log(`🎉 Player ${parseInt(winnerIndex) + 1} wins!`);
        game.scene.keys['mapOne'].scene.start('WinScreen', { winner: parseInt(winnerIndex) + 1 });
    }
    

}


function spinWheel(scene, playerIndices, onComplete) {
    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;
    const radius = 150;

    const segmentAngle = 360 / playerIndices.length;

    const spinnerContainer = scene.add.container(centerX, centerY).setDepth(10);

    // Draw wheel segments with player labels
    playerIndices.forEach((index, i) => {
        const startAngle = Phaser.Math.DegToRad(i * segmentAngle);
        const endAngle = Phaser.Math.DegToRad((i + 1) * segmentAngle);

        const graphics = scene.add.graphics();
        graphics.fillStyle(0xFFFFFF * Math.random(), 1);
        graphics.slice(0, 0, radius, startAngle, endAngle, false);
        graphics.fillPath();

        const midAngle = (startAngle + endAngle) / 2;
        const labelX = Math.cos(midAngle) * (radius * 0.6);
        const labelY = Math.sin(midAngle) * (radius * 0.6);

        const label = scene.add.text(labelX, labelY, `P${index + 1}`, {
            fontSize: '20px',
            color: '#000',
        }).setOrigin(0.5);

        const segment = scene.add.container(0, 0, [graphics, label]);
        spinnerContainer.add(segment);
    });

    // Add pointer arrow at top
    const arrow = scene.add.triangle(centerX, centerY - radius - 30, 0, 30, 15, 0, 30, 30, 0xff0000).setOrigin(0.5).setRotation(Phaser.Math.DegToRad(180)).setDepth(11);

    // Spin the wheel
    const randomIndex = Phaser.Math.Between(0, playerIndices.length - 1);
    const fullSpins = Phaser.Math.Between(3, 5);
    const targetAngle = 360 * fullSpins + (segmentAngle * randomIndex) + segmentAngle / 2;

    scene.tweens.add({
        targets: spinnerContainer,
        angle: targetAngle,
        duration: 4000,
        ease: 'Cubic.easeOut',
        onComplete: () => {
            spinnerContainer.destroy();
            arrow.destroy();
            onComplete(playerIndices[randomIndex]);
        }
    });
}
