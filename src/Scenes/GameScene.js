import 'phaser';
//import skyImg from "./assets/sky.png";


export default class GameScene extends Phaser.Scene {
  constructor () {
    super('Game');
  }

  preload () {
    // load images
    this.load.image('logo', 'assets/logo.png');
    this.load.image('sky', 'assets/sky.png');
  }

  create () {
    this.add.image(400, 300, 'logo');
  }
};
