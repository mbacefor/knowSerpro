import 'phaser';


export default class QuizScene extends Phaser.Scene {
  constructor() {
      super('QuizScene')
  }

  preload() { 
      this.load.scenePlugin({
          key: 'rexuiplugin',
          url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
          sceneKey: 'rexUI'
      });      
  }


  create() {
      var dialog = this.rexUI.add.dialog(
        {
          x: 400,
          y: 300,

          background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x3e2723),

          title: this.rexUI.add.label({
              background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x1b0000),
              text: this.add.text(0, 0, 'Pergunta 01', {
                  fontSize: '24px'
              }),
              space: {
                  left: 15,
                  right: 15,
                  top: 10,
                  bottom: 10
              }
          }),

          content: this.add.text(0, 0, 'Quantos empregados tem o SERPRO?', {
              fontSize: '24px'
          }),

          choices: [
              createLabel(this, '1.000'),
              createLabel(this, '2.000'),
              createLabel(this, '3.000'),
              createLabel(this, '12.000')
          ],

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
      })
          .layout()
          //.drawBounds(this.add.graphics(), 0xff0000)
          .popUp(1000);

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

  update() { }
}

var createLabel = function (scene, text, backgroundColor) {
  return scene.rexUI.add.label({
      background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x6a4f4b),

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

