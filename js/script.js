



var config = {
    type: Phaser.AUTO,
    width: innerHeight - 10,
    height: innerHeight-10,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var platforms;

function preload (){
    this.load.image('startMenu', '../img/bgHome.png')
}

function create(){
    this.add.image(400, 300, 'skystartMenu');
}

function update(){

}