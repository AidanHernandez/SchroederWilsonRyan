
var platforms;

class StartMenu extends Phaser.Scene {
    constructor() {
        super('StartMenu'); // Scene key
    }

    preload() {
        // Load background images for both scenes here
        this.load.image('startMenu', '../img/bgHome.png');
        this.load.image('level1Bg', '../img/bgLevel1.png');
        this.load.image('ground', '../img/platform.svg');
    }

    create() {
        // Add start menu background
        this.add.image(0, 0, 'startMenu').setOrigin(0, 0);

        

        // platforms.create(600, 400, 'ground');

        /*  
            // Switch to Level1 scene when player clicks anywhere
            this.input.once('pointerdown', () => {
                this.scene.start('Level1');
            });

            // Optional: Add text to indicate action
            this.add.text(20, 20, 'Click to Start', {
                font: '24px Arial',
                fill: '#ffffff'
            });

        */
    }
}

class Level1 extends Phaser.Scene {
    constructor() {
        super('Level1'); // Scene key
    }

    create() {
        // Add level background
        this.add.image(0, 0, 'level1Bg').setOrigin(0, 0);

        // Optional: Add instruction text
        this.add.text(20, 20, 'Welcome to Level 1', {
            font: '24px Arial',
            fill: '#ffffff'
        });
    }
}




var config = {
    type: Phaser.AUTO,
    width: innerHeight - 10,
    height: innerHeight - 10,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [StartMenu, Level1]
};


// Launch game
var game = new Phaser.Game(config);

