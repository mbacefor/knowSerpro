import 'phaser';
import { Dialog } from 'phaser3-rex-plugins/templates/ui/ui-components.js';


export default class QuizScene extends Phaser.Scene {

  constructor() {
    super('QuizScene')
    this.quizFase = [];
    this.numeroTentativas = 0
    this.quantidadePerguntas = 3;
    this.dialog = undefined;
  }

  preload() {
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });
  }


/**
 * Escolhe a perguntas que serão utilizados no quiz
 */
  escolhePerguntas() {
    this.model = this.sys.game.globals.model;
    var quizSelecao = null;
    var choiceTextArray = this.model.quiz;
    for (var i = 0; i < this.quantidadePerguntas && choiceTextArray != null && choiceTextArray.length > 0; i++) {
      let choiceQuiz = choiceTextArray[0];
      if (choiceQuiz != null) {
        choiceTextArray.shift();
        this.quizFase.push(choiceQuiz);
      } else {
        exit()
      }
    }
  }

  create() {
    this.add.image(400, 300, 'fundoGame');
    this.escolhePerguntas();
    this.createDialog();
  }

  update() { }

/**
 * Cria a dialog
 */
  createDialog() {

    var quizModel = this.quizFase[this.numeroTentativas];

    this.dialog = this.rexUI.add.dialog(
      {
        x: 400,
        y: 300,

        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

        title: this.rexUI.add.label({
          background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),
          text: this.add.text(0, 0, 'Pergunta:'+(this.numeroTentativas+1)+' - Selecione uma resposta!', {
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
    var choices = this.dialog.getElement('choices');
    var choiceText = null;
    for (var i = 0, cnt = choices.length; i < cnt; i++) {
      choiceText = choiceTextArray[i];
      if (choiceText != null) {
        this.dialog.showChoice(i);
        choices[i].text = choiceText;
      } else {
        this.dialog.hideChoice(i);
      }
    }
    this.add.existing(this.dialog);
    this.dialog.layout()
    this.dialog.popUp(1000);
    this.print = this.add.text(0, 0, '');
    this.dialog
      .on('button.click', function (button, groupName, index) {
        this.print.text += index + ': ' + button.text + '\n';
        this.verificaReposta(button.text);
      }, this)
      .on('button.over', function (button, groupName, index) {
        button.getElement('background').setStrokeStyle(1, 0xffffff);
      })
      .on('button.out', function (button, groupName, index) {
        button.getElement('background').setStrokeStyle();
      });
  }

  /**
   * 
   * @param {*} button 
   */
  verificaReposta(respostaEscolhida){
    let quizmodel = this.quizFase[this.numeroTentativas]
    if(respostaEscolhida == quizmodel.resposta){
      this.print.text += 'Acertou \n';
    } else{
      this.print.text += 'Errou \n'
    }
    this.numeroTentativas++;
    this.dialog.scaleDownDestroy(100);
    this.dialog = undefined;
    if (this.numeroTentativas<this.quantidadePerguntas)
      this.createDialog();
    else{
      Alert(this, 'Alerta', 'Acabou!');
    }  
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

var CreateAlertDialog = function (scene) {
  var dialog = scene.rexUI.add.dialog({
      width: 300,
      background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

      title: scene.rexUI.add.label({
          background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x003c8f),
          text: scene.add.text(0, 0, '', {
              fontSize: '24px'
          }),
          space: {
              left: 15,
              right: 15,
              top: 10,
              bottom: 10
          }
      }),

      content: scene.add.text(0, 0, '', {
          fontSize: '24px'
      }),

      actions: [
          scene.rexUI.add.label({
              background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x5e92f3),

              text: scene.add.text(0, 0, 'OK', {
                  fontSize: '24px'
              }),

              space: {
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 10
              }
          })
      ],

      space: {
          title: 25,
          content: 25,
          action: 15,

          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
      },

      align: {
          actions: 'center', // 'center'|'left'|'right'
      },

      expand: {
          content: false,  // Content is a pure text object
      }
  })
      .on('button.over', function (button, groupName, index, pointer, event) {
          button.getElement('background').setStrokeStyle(1, 0xffffff);
      })
      .on('button.out', function (button, groupName, index, pointer, event) {
          button.getElement('background').setStrokeStyle();
      });

  return dialog;
}

var SetAlertDialog = function (dialog, title, content) {
  if (title === undefined) {
      title = '';
  }
  if (content === undefined) {
      content = '';
  }
  dialog.getElement('title').text = title;
  dialog.getElement('content').text = content;
  return dialog;
}

var AlertDialog;
var Alert = function (scene, title, content, x, y) {
  if (x === undefined) {
      x = 400;
  }
  if (y === undefined) {
      y = 300;
  }
  if (!AlertDialog) {
      AlertDialog = CreateAlertDialog(scene)
  }
  SetAlertDialog(AlertDialog, title, content);
  AlertDialog
      .setPosition(x, y)
      .setVisible(true)
      .layout();

  return AlertDialog
      .moveFromPromise(1000, undefined, '-=400', 'Bounce')
      .then(function () {
          return scene.rexUI.waitEvent(AlertDialog, 'button.click');
      })
      .then(function () {
          return AlertDialog.moveToPromise(1000, undefined, '-=400', 'Back');
      })
      .then(function () {
          AlertDialog.setVisible(false);
          return Promise.resolve();
      })
}
