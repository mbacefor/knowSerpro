import 'phaser';



// constants
const PATHS = {
	DOME: '0 0 0 250 19 250 20 231.9 25.7 196.1 36.9 161.7 53.3 129.5 74.6 100.2 100.2 74.6 129.5 53.3 161.7 36.9 196.1 25.7 231.9 20 268.1 20 303.9 25.7 338.3 36.9 370.5 53.3 399.8 74.6 425.4 100.2 446.7 129.5 463.1 161.7 474.3 196.1 480 231.9 480 250 500 250 500 0',
	DOME_LEFT: '0 0 0 500 250 500 250 480 231.9 480 196.1 474.3 161.7 463.1 129.5 446.7',
	DOME_RIGHT: '0 0 0 250 19 250 20 231.9 25.7 196.1 36.9 161.7 53.3 129.5 74.6 100.2 100.2 74.6 129.5 53.3 161.7 36.9 196.1 25.7 231.9 20 268.1 20 303.9 25.7 338.3 36.9 370.5 53.3 399.8 74.6 425.4 100.2 446.7 129.5 463.1 161.7 474.3 196.1 480 231.9 480 250 500 250 500 0 0 0',
	DROP_LEFT: '0 0 20 0 70 100 20 150 0 150 0 0',
	DROP_RIGHT: '50 0 68 0 68 150 50 150 0 100 50 0',
	APRON_LEFT: '0 0 180 120 0 120 0 0',
	APRON_RIGHT: '180 0 180 120 0 120 180 0'
};
const COLOR = {
	BACKGROUND: '#212529',
	OUTER: 0x495057,
	INNER: 0x15aabf,
	BUMPER: 0xfab005,
	BUMPER_LIT: 0xfff3bf,
	PADDLE: 0xe64980,
	PINBALL: 0xdee2e6
};
const GRAVITY = 0.75;
const WIREFRAMES = false;
const BUMPER_BOUNCE = 1.5;
const PADDLE_PULL = 0.002;
const MAX_VELOCITY = 50;

var game = null;

// shared variables
let currentScore, highScore;
let engine, world, render, pinball, stopperGroup;
let leftPaddle, leftUpStopper, leftDownStopper, isLeftPaddleUp;
let rightPaddle, rightUpStopper, rightDownStopper, isRightPaddleUp;

/**
 * Classe que representa a tela de quiz do game
 */
export default class PinballScene extends Phaser.Scene {


	constructor() {
		super('PinballScene')
		game = this;
	}

	reverseString(str) {
		return str.split("").reverse().join("");
	}

	preload() {
		/* this.load.scenePlugin({
		  key: 'rexuiplugin',
		  url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
		  sceneKey: 'rexUI'
		}); */

	}

	iniciar() {
		// engine (shared)
		game = this;
		//engine = Matter.Engine.create();
		engine = this.matter;

		// world (shared)
		world = engine.world;
		this.matter.world.setBounds(0, 0, 500, 800);

		// world.bounds = {
		//  	min: { x: 0, y: 0},
		//  	max: { x: 500, y: 800 }
		// };
		world.setGravity(0, GRAVITY); // simulate rolling on a slanted table
		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(COLOR.BACKGROUND);


		// render (shared)
		/* render = Matter.Render.create({
			element: $('.container')[0],
			engine: engine,
			options: {
				width: world.bounds.max.x,
				height: world.bounds.max.y,
				wireframes: WIREFRAMES,
				background: COLOR.BACKGROUND
			}
		}); */
		//Matter.Render.run(render);

		// runner
		//let runner = Matter.Runner.create();
		//Matter.Runner.run(runner, engine);

		// used for collision filtering on various bodies
		stopperGroup = engine.body.nextGroup(true);
		// Matter.Body.nextGroup(true);

		//engine

		// starting values
		currentScore = 0;
		highScore = 0;
		isLeftPaddleUp = false;
		isRightPaddleUp = false;
	}

	// matter.js has a built in random range function, but it is deterministic
	rand(min, max) {
		return Math.random() * (max - min) + min;
	}

	// outer edges of pinball table
	boundary(x, y, width, height) {
		var poly = this.add.rectangle(x, y, width, height, COLOR.OUTER);
		return this.matter.add.gameObject(poly, {
			isStatic: true,
			shape: {
				type: 'rectangle',
				x: x,
				y: y,
				width: width,
				height: height,
				flagInternal: false
			},
			render: {
				fillStyle: COLOR.OUTER,
				lineColor: COLOR.OUTER
			}
		},
		);


		// return this.matter.add.rectangle(x, y, width, height, {
		// 	//engine.bodies.rectangle(x, y, width, height, {
		// 	//Matter.Bodies.rectangle(x, y, width, height, {
		// 	isStatic: true,
		// 	render: {
		// 		fillStyle: COLOR.OUTER,
		// 		fillColor: COLOR.OUTER
		// 	}
		// });
	}

	// wall segments
	wall(x, y, width, height, color, angle = 0) {

		//  32px radius on the corners
		var graphics = this.add.graphics();
		graphics.fillStyle(color, 1);
		var poly = graphics.fillRoundedRect(-width/2, -height/2, width, height, 10);
		//var poly = this.add.rectangle(x, y, width, height, color);
		return this.matter.add.gameObject(poly, {
			isStatic: true,
			angle: angle,
			chamfer: { radius: 10 },
			shape: {
				type: 'rectangle',
				x: x,
				y: y,
				width: width,
				height: height,
				flagInternal: false
			},
			render: {
				fillStyle: color,
				lineColor: color
			}
		},
		);
		//return Matter.Bodies.rectangle(x, y, width, height, {
		// return this.matter.add.rectangle(x, y, width, height, {
		// 	angle: angle,
		// 	isStatic: true,
		// 	chamfer: { radius: 10 },
		// 	render: {
		// 		fillStyle: color,
		// 		fillColor: color,
		// 		wireframes: false

		// 	}
		// });
	}

	// bodies created from SVG paths
	path(x, y, path) {
		//let vertices = Matter.Vertices.fromPath(path);
		let vertices = this.matter.vertices.fromPath(path);
		var poly = this.add.polygon(x, y, path, COLOR.OUTER);

		return this.matter.add.gameObject(poly, {
			isStatic: true,
			shape: {
				type: 'fromVerts',
				verts: path,
				flagInternal: false
			},
			render: {
				fillColor: COLOR.OUTER,
				lineColor: COLOR.OUTER,
				fillOpacity: 1,
				wireframes: false,

				// add stroke and line width to fill in slight gaps between fragments
				strokeStyle: COLOR.OUTER,
				lineWidth: 3
			}
		},
		);
		//return Matter.Bodies.fromVertices(x, y, vertices, {
		// return this.matter.add.fromVertices(x, y, vertices, {
		// 	isStatic: true,
		// 	render: {
		// 		fillColor: COLOR.OUTER,
		// 		lineColor: COLOR.OUTER,
		// 		fillOpacity: 1,
		// 		wireframes: false,

		// 		// add stroke and line width to fill in slight gaps between fragments
		// 		strokeStyle: COLOR.OUTER,
		// 		lineWidth: 3
		// 	}
		// });
	}

	// round bodies that repel pinball
	bumper(x, y) {
		var poly = this.add.circle(x, y, 25, COLOR.BUMPER);
		let bumper = this.matter.add.gameObject(poly, {
			isStatic: true,
			shape: {
				type: 'circle',
				x: x,
				y: y,
				radius: 25,
				flagInternal: false
			},
			render: {
				fillStyle: COLOR.BUMPER,
				lineColor: COLOR.BUMPER
			}
		},
		);
		//let bumper = Matter.Bodies.circle(x, y, 25, {
		// let bumper = this.matter.add.circle(x, y, 25, {
		// 	label: 'bumper',
		// 	isStatic: true,
		// 	render: {
		// 		fillStyle: COLOR.BUMPER
		// 	}
		// });

		// // for some reason, restitution is reset unless it's set after body creation
		// bumper.restitution = BUMPER_BOUNCE;
		return bumper;
	}

	// invisible bodies to constrict paddles
	stopper(x, y, side, position) {
		// determine which paddle composite to interact with
		let attracteeLabel = (side === 'left') ? 'paddleLeftComp' : 'paddleRightComp';

		return Matter.Bodies.circle(x, y, 40, {
			isStatic: true,
			render: {
				visible: false,
			},
			collisionFilter: {
				group: stopperGroup
			},
			plugin: {
				attractors: [
					// stopper is always a, other body is b
					function (a, b) {
						if (b.label === attracteeLabel) {
							let isPaddleUp = (side === 'left') ? isLeftPaddleUp : isRightPaddleUp;
							let isPullingUp = (position === 'up' && isPaddleUp);
							let isPullingDown = (position === 'down' && !isPaddleUp);
							if (isPullingUp || isPullingDown) {
								return {
									x: (a.position.x - b.position.x) * PADDLE_PULL,
									y: (a.position.y - b.position.y) * PADDLE_PULL,
								};
							}
						}
					}
				]
			}
		});
	}

	// contact with these bodies causes pinball to be relaunched
	reset(x, width) {
		//return Matter.Bodies.rectangle(x, 781, width, 2, {
		return engine.bodies.rectangle(x, 781, width, 2, {
			label: 'reset',
			isStatic: true,
			render: {
				fillStyle: '#fff'
			}
		});
	}

	createStaticBodies() {
		//Matter.World.add(world, [
		let invertSTR = this.reverseString(PATHS.DOME);

		engine.world.add(world, [
			// table boundaries (top, bottom, left, right)
			this.boundary(250, -30, 500, 100),
			this.boundary(250, 830, 500, 100),
			this.boundary(-30, 400, 100, 800),
			this.boundary(530, 400, 100, 800),

			// dome
			this.path(250, 86, PATHS.DOME),

			//pegs (left, mid, right)
			this.wall(140, 140, 20, 40, COLOR.INNER),
			this.wall(225, 140, 20, 40, COLOR.INNER),
			this.wall(310, 140, 20, 40, COLOR.INNER),

			// top bumpers (left, mid, right)
			this.bumper(105, 250),
			this.bumper(225, 250),
			this.bumper(345, 250),

			// bottom bumpers (left, right)
			this.bumper(165, 340),
			this.bumper(285, 340),

			// shooter lane wall
			this.wall(440, 520, 20, 560, COLOR.OUTER),

			// drops (left, right)
			this.path(25, 360, PATHS.DROP_LEFT),
			this.path(425, 360, PATHS.DROP_RIGHT),

			// slingshots (left, right)
			this.wall(120, 510, 20, 120, COLOR.INNER),
			this.wall(330, 510, 20, 120, COLOR.INNER),

			// out lane walls (left, right)
			this.wall(60, 529, 20, 160, COLOR.INNER),
			this.wall(390, 529, 20, 160, COLOR.INNER),

			// flipper walls (left, right);
			this.wall(93, 624, 20, 98, COLOR.INNER, -0.96),
			this.wall(357, 624, 20, 98, COLOR.INNER, 0.96),

			// aprons (left, right)
			this.path(79, 740, PATHS.APRON_LEFT),
			this.path(371, 740, PATHS.APRON_RIGHT),

			// reset zones (center, right)
			this.reset(225, 50),
			this.reset(465, 30)
		]);
	}


	create() {
		//var graphics = this.add.graphics();


		this.iniciar();
		this.createStaticBodies();
	}

	update() {


	}

}