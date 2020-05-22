import 'phaser';

export default {
  type: Phaser.AUTO,
    width: 500,
    height: 800,
    backgroundColor: '#4d4d4d',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        wireframes: false,
        matter: {
            enableSleeping: false,
            plugins: {
                attractors: true
            },
            gravity: {
                y: 0
            },
            debug: {},
            render: {
                wireframes: false
            },
            wireframes: false,
            debugWireframes: true
        }
    }
};
