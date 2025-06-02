

var player;
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



const JUMP_VELOCITY = -750;
const GRAVITY = 1500;
const COYOTE_TIME = 100;
const JUMP_BUFFER_TIME = 100;

let coyoteTimer = 0;
let jumpBufferTimer = 0;
let isJumping = false;


//  Base scene with shared update logic
class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    update(time, delta) {
        if (cursorUse) {
            const onGround = player.body.touching.down;

            // Left/Right Movement (your existing logic)
            if (cursors.left.isDown) {
                player.setVelocityX(-200);
                player.anims.play('left', true);
            } else if (cursors.right.isDown) {
                player.setVelocityX(200);
                player.anims.play('right', true);
            } else {
                player.setVelocityX(0);
                player.anims.play('turn');
            }

            // Coyote time
            if (onGround) {
                coyoteTimer = COYOTE_TIME;
            } else {
                coyoteTimer -= delta;
            }

            // Jump buffering
            if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
                jumpBufferTimer = JUMP_BUFFER_TIME;
            } else {
                jumpBufferTimer -= delta;
            }

            // Jump
            if (jumpBufferTimer > 0 && coyoteTimer > 0) {
                player.setVelocityY(JUMP_VELOCITY);
                isJumping = true;
                jumpBufferTimer = 0;
                coyoteTimer = 0;
            }

            // Variable jump height: gentler cut or disable
            if (isJumping && !cursors.up.isDown && player.body.velocity.y < 0) {
                // Try 0.8 or comment out this line for less floaty jumps:
                player.setVelocityY(player.body.velocity.y * 0.8);
                isJumping = false;
            }

            // Faster falling (optional)
            // if (player.body.velocity.y > 0) {
            //     player.body.velocity.y += GRAVITY * 0.15 * (delta / 16);
            // }

            if (onGround) {
                isJumping = false;
            }

        } else if (cursorUse === false) {
            // Your scripted intro behavior (unchanged)
            gravity = 200;
            if (step === 1 && player.y === 929) {
                player.setVelocityX(-160);
                player.anims.play('left', true);
                if (player.x <= 626) {
                    player.setVelocityY(-330);
                }
            }

            if (player.y === 675.5 && player.x <= 140 && step === 1) {
                step = 2;
                player.setVelocityX(160);
                player.anims.play('right', true);
            }

            if (player.x >= 142 && player.y === 675.5 && step === 2) {
                player.setVelocityY(-360);
            }

            if (player.x >= 839 && step === 2) {
                step = 3;
                player.setVelocityX(-160);
                player.anims.play('left', true);
            }

            if (player.x <= 17 && step === 3) {
                player.setVelocityX(0);
                player.setVelocityY(-360);
                if (player.y <= 696.5) {
                    player.setVelocityX(160);
                    player.anims.play('right', true);
                    step = 4;
                }
            }

            if (player.x === 992 && step === 4 && player.y === 929) {
                step = 1;
            }

            if (player.body.velocity.x === 0) {
                player.anims.play('turn');
            }
        }
    }


    createPhysicsRect(x, y, width, height, color) {
        const rect = this.add.rectangle(x, y, width, height, color);
        this.physics.add.existing(rect, true);
        this.physics.add.collider(player, rect);
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

        player = this.physics.add.sprite(2048, 929, 'dude');
        player.setCollideWorldBounds(true);

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

        this.physics.add.collider(player, platforms);
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
        this.load.spritesheet('dude', '../phaser3-tutorial-src/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {

        this.add.image(0, 0, 'startMenu').setOrigin(0, 0);







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



        player = this.physics.add.sprite(2048, 929, 'dude');
        player.setCollideWorldBounds(true);

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


        cursorUse = true
        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(player, bigPlat);
        this.physics.add.collider(player, platSmall);
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
    scene: [StartMenu, characterSelection, levelSelect, mapOne],

};

//  Launch game
var game = new Phaser.Game(config);


function changeScene(name) {
    if (name === "homePage") {
        document.getElementById("homePage").classList.toggle("hide");
        game.scene.keys['StartMenu'].scene.start('characterSelection');
        document.getElementById("characterSelectMenu").classList.toggle("show");
    }
    else if (name === "mapSelection") {
        document.getElementById("characterSelectMenu").classList.toggle("hide");
        game.scene.keys['characterSelection'].scene.start('levelSelect');
        document.getElementById("levelSelect").classList.toggle("show");

    }
    else if (name === "mapOne") {
        document.getElementById("homePage").classList.toggle("hide");
        document.getElementById("levelSelect").classList.toggle("hide");
        game.scene.keys['levelSelect'].scene.start('mapOne');
        console.log(playerOptions)

    }
}


