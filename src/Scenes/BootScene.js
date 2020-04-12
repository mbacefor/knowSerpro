import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  preload () {
    //Carregar imagens da tela pre-load
    this.load.image('logo', 'assets/logo-serpro_display.png');
    this.load.image('background', 'assets/background.png');

  }

  create () {
    this.scene.start('Preloader');
  }
};