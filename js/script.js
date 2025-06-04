
var playerTut;
var playerOne;
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
let player2;
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


let tagCooldown = 1000;
let lastTagTime = 0;

let playerNumber = ["", "", "", ""];

const JUMP_VELOCITY = -750;
const COYOTE_TIME = 100;
const JUMP_BUFFER_TIME = 100;
const maxJumpTime = 0;
const jumpForce = 0;
const FIRST_JUMP_VELOCITY = -1000;

const playerState1 = {
    isJumping: false,
    jumpStartTime: 0,
    lastOnGroundTime: 0,
    lastJumpPressTime: 0,
};

const playerState2 = {
    isJumping: false,
    jumpStartTime: 0,
    lastOnGroundTime: 0,
    lastJumpPressTime: 0,
};


// Helper function (can be inside or outside BaseScene)
function handlePlayerMovement(player, input, state, scene) {
    const onGround = player.body.touching.down;
    const now = scene.time.now;

    const COYOTE_TIME = 100;
    const JUMP_BUFFER_TIME = 100;
    const FAST_FALL_GRAVITY = 1600;
    const NORMAL_GRAVITY = 1000;
    const JUMP_CUT_MULTIPLIER = 0.5;

    const speed = (itPlayer === 'player1' && player === playerOne) || (itPlayer === 'player2' && player === player2)
        ? 400 : 300;

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
            handlePlayerMovement(playerOne, cursors, playerState1, this);
            handlePlayerMovement(player2, wasdPLayer, playerState2, this);

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


        this.load.image('thimble', '../img/characters/thimble.png');
        this.load.image('tony', '../img/characters/tony.png');
        this.load.image('basketballGod', '../img/characters/basketBallGod.png');
        this.load.image('hatsuneMiku', '../img/characters/miku.png');
        this.load.image('teddie', '../img/characters/teddie.png');
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


        // playerOne = this.physics.add.sprite(0, 800, "thimble");
        // player2 = this.physics.add.sprite(0, 800, "basketballGod");
        playerTut = this.physics.add.sprite(500, 800, "dude");

        for (let i = 0; i < playerNumber.length; i++) {

            if (playerNumber[i] === "Online") {

                if (i === 0) {
                    playerOne = this.physics.add.sprite(100, 800, playerOptions[i]);
                    playerOne.setScale(0.35);  // Scales the sprite to 50% size
                } else if (i === 1) {
                    player2 = this.physics.add.sprite(200, 800, playerOptions[i]);
                    player2.setScale(0.35);  // Scales the sprite to 50% size
                } else if (i === 2) {
                    playerTut = this.physics.add.sprite(300, 800, playerOptions[i]);
                    playerTut.setName("playerTut");
                }
            }
        }





        playerOne.setCollideWorldBounds(true);


        player2.setCollideWorldBounds(true);




        wasdPLayer = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });



        cursorUse = true
        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(playerOne, platforms);
        this.physics.add.collider(playerOne, bigPlat);
        this.physics.add.collider(playerOne, platSmall);

        this.physics.add.collider(player2, platforms);
        this.physics.add.collider(player2, bigPlat);
        this.physics.add.collider(player2, platSmall);


        this.physics.add.collider(playerOne, bouncyPad, (p, pad) => bouncePlayer(p, pad));

        this.physics.add.collider(player2, bouncyPad, (p, pad) => bouncePlayer(p, pad));






        this.physics.add.overlap(playerOne, player2, tagged, null, this);




        this.physics.add.collider(playerTut, platforms);
        this.physics.add.collider(playerTut, bigPlat);
        this.physics.add.collider(playerTut, platSmall);

        this.physics.add.collider(playerTut, platforms);
        this.physics.add.collider(playerTut, bigPlat);
        this.physics.add.collider(playerTut, platSmall);

        itText1 = this.add.text(16, 16, 'P1 Time: 0.0s', { fontSize: '24px', fill: '#ffffff' }).setScrollFactor(0);
        itText2 = this.add.text(16, 48, 'P2 Time: 0.0s', { fontSize: '24px', fill: '#ffffff' }).setScrollFactor(0);

        itTimer1 = 0;
        itTimer2 = 0;

    }

    update(time, delta) {
        // Add time to whoever is "it"
        if (itPlayer === 'player1') {
            itTimer1 += delta;
        } else if (itPlayer === 'player2') {
            itTimer2 += delta;
        }

        // Update timer text
        itText1.setText('P1 Time: ' + (itTimer1 / 1000).toFixed(1) + 's');
        itText2.setText('P2 Time: ' + (itTimer2 / 1000).toFixed(1) + 's');

        // Call your movement logic here if needed
         if (cursorUse) {
        this.physics.world.gravity.y = GRAVITY;
        handlePlayerMovement(playerOne, cursors, playerState1, this);
        handlePlayerMovement(player2, wasdPLayer, playerState2, this);
    }
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
            debug: true
        }
    },
    scene: [StartMenu, characterSelection, levelSelect, mapOne],

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



        const randomIndex = Math.floor(Math.random() * playerOptionsLength);
        if (randomIndex === 0) {
            itPlayer = 'player1';
        } else {
            itPlayer = 'player2';
        }

    }
}






function tagged(p1, p2) {

    const now = Date.now();
    if (now - lastTagTime < tagCooldown) {
        return; // Still in cooldown, ignore tag
    }

    lastTagTime = now;


    if (itPlayer === 'player1') {
        console.log("Player 1 tagged Player 2!");
        itPlayer = 'player2';
        p2.setTint(0xff0000);
        p1.clearTint();



    } else {
        console.log("Player 2 tagged Player 1!");
        itPlayer = 'player1';
        p1.setTint(0xff0000);
        p2.clearTint();
    }



}

function bouncePlayer(player, pad) {
    const touchingDown = player.body.touching.down || player.body.blocked.down;
    if (touchingDown) {
        player.setVelocityY(-1540);
    }
}
