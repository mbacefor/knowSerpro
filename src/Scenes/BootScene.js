import 'phaser';
import logo from '../../assets/logo-serpro_display.png';
import background from '../../assets/background.png';


export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  preload () {
    //Carregar imagens da tela pre-load
    this.load.image('logo', logo);
    this.load.image('background', background);

  }

  create () {
    this.scene.start('Preloader');
  }
};