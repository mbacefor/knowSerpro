import 'phaser';
//import skyImg from "./assets/sky.png";

var players = new Array();
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

export default class GameScene extends Phaser.Scene {


  constructor() {
    super('Game');
  }

  preload() {
    // load images
    //this.load.image('logo', 'assets/logo.png');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('pessoas', 'assets/pessoas.png', { frameWidth: 48, frameHeight: 48 });

  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // The player and its settings

    players.push(this.physics.add.sprite(100, 450, 'dude'));
    players.push(this.physics.add.sprite(200, 450, 'pessoas'));
    players.push(this.physics.add.sprite(300, 450, 'pessoas'));
    players.push(this.physics.add.sprite(400, 450, 'pessoas'));
    players.push(this.physics.add.sprite(500, 450, 'pessoas'));

    //  Player physics properties. Give the little guy a slight bounce.
    players.forEach(function (item, indice, array) {
      console.log(item, indice);
      item.setBounce(0.2);
      item.setCollideWorldBounds(true);
    });

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: 'left0',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn0',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right0',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: 'left1',
      frames: this.anims.generateFrameNumbers('pessoas', { start: 15, end: 17 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn1',
      frames: [{ key: 'pessoas', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right1',
      frames: this.anims.generateFrameNumbers('pessoas', { start: 27, end: 29 }),
      frameRate: 10,
      repeat: -1
    });



    /***************************************************************************************
     * Nova personagem, jhudsonsg
     ***************************************************************************************/
    this.anims.create({
      key: 'left2',
      frames: this.anims.generateFrameNumbers('pessoas', { start: 18, end: 20 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn2',
      frames: [{ key: 'pessoas', frame: 7 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right2',
      frames: this.anims.generateFrameNumbers('pessoas', { start: 30, end: 32 }),
      frameRate: 10,
      repeat: -1
    });
    /*************************************************************************************** */

    /*************************************************************************************** */
    //Novo personagem, Júlio
    /*************************************************************************************** */
    this.anims.create({
      key: 'left3',
      frames: this.anims.generateFrameNumbers('pessoas', { start: 63, end: 65 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn3',
      frames: [{ key: 'pessoas', frame: 53 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right3',
      frames: this.anims.generateFrameNumbers('pessoas', { start: 75, end: 77 }),
      frameRate: 10,
      repeat: -1
    });

    /*************************************************************************************** */
    //Novo personagem, Rubens
    /*************************************************************************************** */
    this.anims.create({
      key: 'left4',
      frames: this.anims.generateFrameNumbers('pessoas', { start: 21, end: 23 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn4',
      frames: [{ key: 'pessoas', frame: 11 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right4',
      frames: this.anims.generateFrameNumbers('pessoas', { start: 33, end: 35 }),
      frameRate: 10,
      repeat: -1
    });
    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

      //  Give each star a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(bombs, bombs);

    for (var i = 0; i < players.length; i++) {
      var item = players[i];
      console.log(item, i, this);
      this.physics.add.collider(item, platforms);
      this.physics.add.overlap(item, stars, this.collectStar, null, this);
      this.physics.add.collider(item, bombs, this.hitBomb, null, this);
      this.physics.add.overlap(item, stars, this.collectStar, null, this);
      this.physics.add.collider(item, bombs, this.hitBomb, null, this);
    }
  }
  
  update() {
    if (gameOver) {
      this.scene.stop('Game');
      this.scene.start('Title');
    }
  
    if (cursors.left.isDown) {
  
      players.forEach(function (item, indice, array) {
        console.log(item, indice);
        item.setVelocityX(-160);
        item.anims.play('left' + indice, true);
      });
  
    }
    else if (cursors.right.isDown) {
  
      players.forEach(function (item, indice, array) {
        console.log(item, indice);
        item.setVelocityX(160);
        item.anims.play('right' + indice, true);
      });
  
    }
  
    else {
      players.forEach(function (item, indice, array) {
        console.log(item, indice);
        item.setVelocityX(0);
        item.anims.play('turn' + indice, true);
      });
  
    }
  
  
    if (cursors.up.isDown) {
  
      players.forEach(function (item, indice, array) {
        if (item.body.touching.down){
          console.log(item, indice);
          item.setVelocityY(-330);
        }
        
      });
  
    }
  }
  
  collectStar(player, star) {
    star.disableBody(true, true);
  
    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);
  
    if (stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
  
      });
  
      var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  
      var bomb = bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
  
    }
  }
  
  hitBomb(player1, bomb) {
    this.physics.pause();
  
    player1.setTint(0xff0000);
  
    players.forEach(function (item, indice, array) {
      if (player1 == item)
      player1.anims.play('turn'+indice);  
    });
    gameOver = true;
  }  
};