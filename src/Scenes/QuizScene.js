import 'phaser';
import { Dialog } from 'phaser3-rex-plugins/templates/ui/ui-components.js';


export default class QuizScene extends Phaser.Scene {

  constructor() {
    super('QuizScene')
    this.quizFase = [];
    this.numeroTentativas = 0
    const quantidadePerguntas = 1;
  }

  preload() {
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });
  }

  escolhePerguntas() {
    this.model = this.sys.game.globals.model;
    var quizSelecao = null;
    this.model.quiz.forEach(function (quiz) {
      quizSelecao = quiz;
    });
    this.quizFase.push(quizSelecao);
  }

  create() {

    this.add.image(400, 300, 'fundoGame');
    this.escolhePerguntas();
    this.createDialog();
  }

  update() { }

  createDialog() {

    var quizModel = this.quizFase[0];

    var dialog = this.rexUI.add.dialog(
      {
        x: 400,
        y: 300,

        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

        title: this.rexUI.add.label({
          background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),
          text: this.add.text(0, 0, 'Pergunta - Selecione uma resposta!', {
            fontSize: '24px'
          }),
          space: {
            left: 15,
            right: 15,
            top: 10,
            bottom: 10
          }
        }),

        content: this.add.text(0, 0, quizModel.pergunta, {
          fontSize: '24px'
        }),

        choices: [createLabel(this, '1'),
        createLabel(this, '2'),
        createLabel(this, '3'),
        createLabel(this, '4'),
        createLabel(this, '5'),
        createLabel(this, '6')]
        ,

        space: {
          title: 25,
          content: 25,
          choice: 15,
          left: 25,
          right: 25,
          top: 25,
          bottom: 25,
        },

        expand: {
          content: false,  // Content is a pure text object
        }
      });

    var choiceTextArray = quizModel.opcoes;
    var choices = dialog.getElement('choices');
    var choiceText = null;
    for (var i = 0, cnt = choices.length; i < cnt; i++) {
      choiceText = choiceTextArray[i];
      if (choiceText != null) {
        dialog.showChoice(i);
        choices[i].text = choiceText;
      } else {
        dialog.hideChoice(i);
      }
    }
    this.add.existing(dialog);
    dialog.layout()
    dialog.popUp(1000);
    this.print = this.add.text(0, 0, '');
    dialog
      .on('button.click', function (button, groupName, index) {
        this.print.text += index + ': ' + button.text + '\n';
      }, this)
      .on('button.over', function (button, groupName, index) {
        button.getElement('background').setStrokeStyle(1, 0xffffff);
      })
      .on('button.out', function (button, groupName, index) {
        button.getElement('background').setStrokeStyle();
      });
  }


}

var createLabel = function (scene, text, backgroundColor) {
  return scene.rexUI.add.label({
    background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),

    text: scene.add.text(0, 0, text, {
      fontSize: '24px'
    }),

    space: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    }
  });
}