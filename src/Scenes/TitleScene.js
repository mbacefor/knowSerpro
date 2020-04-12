import 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

var text = null;
var  grd;


export default class TitleScene extends Phaser.Scene {

  constructor() {
    super('Title');
  }

  create() {

    this.add.image(400, 300, 'fundoGame');
    // Game
    this.gameButton = new Button(this, config.width / 4, config.height / 2 - 10, 'blueButton1', 'blueButton2', 'Jogar', 'Game');

    // Options
    this.optionsButton = new Button(this, config.width / 4, config.height / 2 + 70, 'blueButton1', 'blueButton2', 'Opções', 'Options');

    // Credits
    this.creditsButton = new Button(this, config.width / 4, config.height / 2 + 150, 'blueButton1', 'blueButton2', 'Créditos', 'Credits');

    this.createNomeJogo();

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }

  centerButton(gameObject, offset = 0) {
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(config.width / 2, config.height / 2 - offset * 100, config.width, config.height)
    );
  }

  centerButtonText(gameText, gameButton) {
    Phaser.Display.Align.In.Center(
      gameText,
      gameButton
    );
  }

  createNomeJogo() {

    text = this.add.text(config.width / 8, config.height / 14 , "- Know SERPRO -");
    //text.anchor.setTo(0);

    text.setFontFamily('Fontdiner Swanky');
    text.setFontSize(60);

    //  If we don't set the padding the font gets cut off
    //  Comment out the line below to see the effect
    text.setPadding(10, 16);

    grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    text.fill = grd;

    text.setAlign('center');
    text.setStroke('#000000');
    //text.strokeThickness = 2;
    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    text.inputEnabled = true;
    //text.input.enableDrag();

    //text.events.onInputOver.add(over, this);
    //text.events.onInputOut.add(out, this);

  }

};