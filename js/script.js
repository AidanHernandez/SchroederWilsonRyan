
var player;
var stars;
var bombs;
var platforms;
var cursors = null;
var score = 0;
var gameOver = false;
var scoreText;
var gravity = 200;
let step = 1


//  Base scene with shared update logic
class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    update() {

        if (!(cursors === null)) {
            console.log(player.x)
            if (cursors.left.isDown) {
                player.setVelocityX(-160);

                player.anims.play('left', true);
            }
            else if (cursors.right.isDown) {
                player.setVelocityX(160);

                player.anims.play('right', true);
            }
            else {
                player.setVelocityX(0);

                player.anims.play('turn');
            }

            if (cursors.up.isDown && player.body.touching.down) {
                player.setVelocityY(-330);
            }
        } else {


            if (step === 1 && player.y === 929) {
                player.setVelocityX(-160);
                player.anims.play('left', true);
                if (player.x <= 626) {
                    player.setVelocityY(-330);
                }
            }

            if (player.y === 675.5 && player.x <= 140 && step === 1) {
                step = 2
                player.setVelocityX(160);
                player.anims.play('right', true);

            }

            if (player.x >= 142 && player.y === 675.5 && step === 2) {
                player.setVelocityY(-360);
            }

            if (player.x >= 839 && step === 2) {
                step = 3
                player.setVelocityX(-160);
                player.anims.play('left', true);
            }

            if (player.x <= 17 && step === 3) {
                player.setVelocityX(0);
                player.setVelocityY(-360);
                if (player.y <= 696.5) {
                    player.setVelocityX(160);
                    player.anims.play('right', true);
                    step = 4
                }

            }

            if(player.x <=992 && step === 4 && player.y === 929){
                step = 1
            }




            // Optional: Turn animation when idle
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
        this.load.image('level1Bg', '../img/bgLevel1.png');
        this.load.image('ground', '../img/top.svg');
    }

    create() {
        this.add.image(0, 0, 'startMenu').setOrigin(0, 0);

        platforms = this.physics.add.staticGroup();


        platforms.create(505, innerHeight - 50, 'ground')







        player = this.physics.add.sprite(innerWidth, 929, 'dude');


        player.setBounce(0.2);
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

        // var rect = this.add.rectangle(241, 714.5, 290, 30, 0x3B561C);
        // var rect2 = this.add.rectangle(500, 456, 290, 30, 0x3B561C);

        this.createPhysicsRect(241, 714.5, 290, 30, `00FFFFFF`);
        this.createPhysicsRect(765, 714.5, 290, 30, `00FFFFFF`);
        this.createPhysicsRect(505, 456, 375, 30, `00FFFFFF`);



        // cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(player, platforms);

    }
}

//  Level 1 Scene
class Level1 extends BaseScene {
    constructor() {
        super('Level1');
    }

    create() {
        this.add.image(0, 0, 'level1Bg').setOrigin(0, 0);
        this.add.text(20, 20, 'Welcome to Level 1', {
            font: '24px Arial',
            fill: '#ffffff'
        });

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
    }
}

//  Game Config
var config = {
    type: Phaser.AUTO,
    width: innerHeight - 10,
    height: innerHeight - 10,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: gravity },
            debug: false
        }
    },
    scene: [StartMenu, Level1]
};

//  Launch game
var game = new Phaser.Game(config);
