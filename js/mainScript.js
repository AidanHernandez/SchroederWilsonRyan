

var playerOne;
var platforms;
var cursors;
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

let itPlayer = '';

let tagCooldown = 1000;
let lastTagTime = 0;





const COYOTE_TIME = 100;
const JUMP_BUFFER_TIME = 100;
const maxJumpTime = 300;
const jumpForce = -35;
const FIRST_JUMP_VELOCITY = -200;


let playerState1 = {
    isJumping: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    jumpTimer: 0
};

let playerState2 = {
    isJumping: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    jumpTimer: 0
};



//  Base scene with shared update logic
class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    update(time, delta) {
        delta = Math.max(delta, 16);



        // Handle Player 1 input and jumping
        handlePlayerMovement(playerOne, cursors, delta, playerState1);

        // Handle Player 2 input and jumping
        handlePlayerMovement(player2, wasdPLayer, delta, playerState2);

    }


    createPhysicsRect(x, y, width, height, color) {
        const rect = this.add.rectangle(x, y, width, height, color);
        this.physics.add.existing(rect, true);
        this.physics.add.collider(playerOne, rect);
        return rect;
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
        this.load.spritesheet('dude', '../phaser3-tutorial-src/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.physics.world.gravity.y = 1500; // Or whatever your intended gravity is
        this.add.image(0, 0, 'startMenu').setOrigin(0, 0);



        let bouncyPad = this.physics.add.staticGroup();
        bouncyPad.create(400, 950, 'bounce')
        bouncyPad.create(500, 450, 'bounce')
        bouncyPad.create(0, 500, 'bounce')

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



        playerOne = this.physics.add.sprite(2048, 929, 'dude');
        playerOne.setCollideWorldBounds(true);

        player2 = this.physics.add.sprite(2048 - 100, 929, 'dude'); // Slightly offset
        player2.setCollideWorldBounds(true);


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

        wasdPLayer = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });



        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(playerOne, platforms);
        this.physics.add.collider(playerOne, bigPlat);
        this.physics.add.collider(playerOne, platSmall);

        this.physics.add.collider(player2, platforms);
        this.physics.add.collider(player2, bigPlat);
        this.physics.add.collider(player2, platSmall);


        this.physics.add.collider(playerOne, bouncyPad, () => bouncePlayer(playerOne), null, this);
        this.physics.add.collider(player2, bouncyPad, () => bouncePlayer(player2), null, this);






        this.physics.add.overlap(playerOne, player2, tagged, null, this);




    }
}

function launchGame() {
    var config = {
        type: Phaser.AUTO,
        width: 1008,
        height: 1008,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 1500 },
                debug: false
            }
        },
        scene: [mapOne],
    
    };

    var game = new Phaser.Game(config);
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

function bouncePlayer(player) {
    if (player.body.blocked.down)
        {
        player.setVelocityY(-1250);
    }
}


// Helper function (can be inside or outside BaseScene)
function handlePlayerMovement(player, input, delta, state) {




    const onGround = player.body.touching.down;

    // Horizontal Movement

    let speed = (itPlayer === 'player1' && player === playerOne) || (itPlayer === 'player2' && player === player2)
        ? 400
        : 300;



    if (input.left.isDown) {
        player.setVelocityX(-speed);
        player.anims.play('left', true);
    } else if (input.right.isDown) {
        player.setVelocityX(speed);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }



    // Coyote Time
    if (onGround) {
        state.coyoteTimer = COYOTE_TIME;
    } else {
        state.coyoteTimer -= delta;
    }

    // Jump Buffering
    if (Phaser.Input.Keyboard.JustDown(input.up)) {
        state.jumpBufferTimer = JUMP_BUFFER_TIME;
    } else {
        state.jumpBufferTimer -= delta;
    }

    // Jump
    if (state.jumpBufferTimer > 0 && state.coyoteTimer > 0) {
        player.setVelocityY(FIRST_JUMP_VELOCITY);
        state.isJumping = true;
        state.jumpBufferTimer = 0;
        state.coyoteTimer = 0;
        state.jumpTimer = 0;
    }

    // Hold to jump higher
    if (state.isJumping && input.up.isDown) {
        if (state.jumpTimer < maxJumpTime) {
            player.setVelocityY(player.body.velocity.y + jumpForce);
            state.jumpTimer += delta;
        } else {
            state.isJumping = false;
        }
    }

    // Variable jump height (on release)
    if (state.isJumping && input.up.isUp && player.body.velocity.y < 0) {
        player.setVelocityY(player.body.velocity.y * 0.5);
        state.isJumping = false;
    }

    // Reset jump state when grounded
    if (onGround && player.body.velocity.y >= 0) {
        state.isJumping = false;
    }
}


function changeScene(name) {
    if (name === "homePage") {
        document.getElementById("homePage").classList.toggle("hide");

        document.getElementById("characterSelectMenu").classList.toggle("show");
        selectingCharacters = true
    }
    else if (name === "mapSelection") {
        selectingCharacters = false
        document.getElementById("characterSelectMenu").classList.toggle("hide");

        document.getElementById("levelSelect").classList.toggle("show");

    }
    else if (name === "mapOne") {

        // document.getElementById("homePage").classList.toggle("hide");
        document.getElementById("levelSelect").classList.toggle("hide");
        launchGame()

        playerOptions = playerOptions.filter(option => option !== "");


        let ran = Math.floor(Math.random() * playerOptions.length)

        if (ran === 0) {
            itPlayer = 'player1'
        }
        else if (ran === 1) {
            itPlayer = 'player2';
        }

    }
}
