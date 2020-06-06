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
		var poly = graphics.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
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
			label: 'bumper',
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
		bumper.restitution = BUMPER_BOUNCE;
		return bumper;
	}

	// invisible bodies to constrict paddles
	stopper(x, y, side, position) {
		// determine which paddle composite to interact with
		let attracteeLabel = (side === 'left') ? 'paddleLeftComp' : 'paddleRightComp';
		var poly = this.add.circle(x, y, 40, COLOR.BUMPER);
		return this.matter.add.gameObject(poly, {
			shape: {
				type: 'circle',
				x: x,
				y: y,
				radius: 25,
				flagInternal: false
			},
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
		// return Matter.Bodies.circle(x, y, 40, {
		// 	isStatic: true,
		// 	render: {
		// 		visible: false,
		// 	},
		// 	collisionFilter: {
		// 		group: stopperGroup
		// 	},
		// 	plugin: {
		// 		attractors: [
		// 			// stopper is always a, other body is b
		// 			function (a, b) {
		// 				if (b.label === attracteeLabel) {
		// 					let isPaddleUp = (side === 'left') ? isLeftPaddleUp : isRightPaddleUp;
		// 					let isPullingUp = (position === 'up' && isPaddleUp);
		// 					let isPullingDown = (position === 'down' && !isPaddleUp);
		// 					if (isPullingUp || isPullingDown) {
		// 						return {
		// 							x: (a.position.x - b.position.x) * PADDLE_PULL,
		// 							y: (a.position.y - b.position.y) * PADDLE_PULL,
		// 						};
		// 					}
		// 				}
		// 			}
		// 		]
		// 	}
		// });
	}

	// contact with these bodies causes pinball to be relaunched
	reset(x, width) {
		//return Matter.Bodies.rectangle(x, 781, width, 2, {
		var poly = this.add.rectangle(x, 781, width, 2, 0xfff);
		return this.matter.add.gameObject(poly, {
			isStatic: true,
			label: 'reset',
			shape: {
				type: 'rectangle',
				x: x,
				y: 781,
				width: width,
				height: 2,
				flagInternal: false
			},
			render: {
				fillStyle: 0xfff,
				lineColor: 0xfff
			}
		},
		);

		// return engine.bodies.rectangle(x, 781, width, 2, {
		// 	label: 'reset',
		// 	isStatic: true,
		// 	render: {
		// 		fillStyle: '#fff'
		// 	}
		// });
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

	createPaddles() {
		// these bodies keep paddle swings contained, but allow the ball to pass through
		leftUpStopper = this.stopper(160, 591, 'left', 'up');
		leftDownStopper = this.stopper(140, 743, 'left', 'down');
		rightUpStopper = this.stopper(290, 591, 'right', 'up');
		rightDownStopper = this.stopper(310, 743, 'right', 'down');
		//Phaser.Physics.Matter.Matter.World.add(world, [leftUpStopper, leftDownStopper, rightUpStopper, rightDownStopper]);
		engine.world.add(world, [leftUpStopper, leftDownStopper, rightUpStopper, rightDownStopper]);

		// this group lets paddle pieces overlap each other
		let paddleGroup = Phaser.Physics.Matter.Matter.Body.nextGroup(true);

		// Left paddle mechanism
		let paddleLeft = {};

		paddleLeft.paddle = this.matter.add.image(170, 660, "paddleL",
			{
				label: 'paddleLeft' //,
				//isStatic: true
			});
		
		paddleLeft.paddle.setBody({
			type: 'rectangle',
			//x: 172, 
			//y: 672,
			//width: 80,
			//height: 40
			},
			{
				//angle: 1.62,
				//chamfer: {},
				render: {
					visible: true
				}
			}
		);
		
		//paddleLeft.paddle.setIgnoreGravity(false);
		var poly2 = this.add.circle(142, 660, 5, COLOR.BUMPER);
		paddleLeft.hinge = this.matter.add.gameObject(poly2, {
			isStatic: true,
			label: 'bumper',
			shape: {
				type: 'circle',
				x: 142,
				y: 660,
				radius: 5,
				flagInternal: false,
				group: paddleGroup
			},
			render: {
				fillStyle: COLOR.BUMPER,
				lineColor: COLOR.BUMPER
			}
		},
		).body;
		this.matter.add.spring(paddleLeft.paddle,
			paddleLeft.hinge,
			0,
			0,
			{
			 pointA: { x: -29.5, y: -8.5 },
			});

		//Phaser.Physics.Matter.Matter.Body.rotate(paddleLeft.comp, 0.57, { x: 142, y: 660 });

		//paddleLeft.paddle =  Phaser.Physics.Matter.Matter.Bodies.trapezoid(170, 660, 20, 80, 0.33, {
		/*paddleLeft.paddle = this.matter.add.trapezoid(170, 660, 20, 80, 0.33, {
			isStatic: false,
			label: 'paddleLeft',
			angle: 1.57,
			chamfer: {},
			render: {
				fillStyle: COLOR.PADDLE,
				fillColor: COLOR.PADDLE,
				lineColor: COLOR.PADDLE
			}
		});*/



		//  However, you can tell it to create any size rectangle you like, such as this one:
		//paddleLeft.paddle.setBody(paddleLeft.brick);


		/*		var poly1 = this.add.rectangle(172, 672, 40, 80, COLOR.OUTER);
				paddleLeft.brick = this.matter.add.gameObject(poly1, {
					//isStatic: false,
					angle: 1.62,
					chamfer: {},
					shape: {
						type: 'rectangle',
						x: 172,
						y: 672,
						width: 40,
						height: 80,
						flagInternal: false
					},
					render: {
						fillStyle: COLOR.OUTER,
						lineColor: COLOR.OUTER
					}
				},
				).body;
				//poly1.setOrigin(0.5, 1);
				//paddleLeft.brick.setOrigin(0.5, 0);
				engine.world.add(world, [paddleLeft.paddle, paddleLeft.brick]);
		
				/* 
						paddleLeft.brick = this.matter.add.rectangle(172, 672, 40, 80, {
							isStatic: false,
							angle: 1.62,
							chamfer: {},
							render: {
								visible: true
							}
						}); */


		//		paddleLeft.comp = paddleLeft.paddle.setExistingBody(paddleLeft.hinge);
		/*
				paddleLeft.comp = this.matter.body.create({
					isStatic: true,
					label: 'paddleLeftComp',
					parts: [paddleLeft.paddle, paddleLeft.brick],
					inertia: Infinity
				});*/

		

		/*paddleLeft.hinge = this.matter.add.circle(142, 660, 5, {
			isStatic: true,
			render: {
				visible: true
			}
		}); */
		//Object.values(paddleLeft).forEach((piece) => {
		//	piece.collisionFilter.group = paddleGroup
		//});
		//paddleLeft.con = Phaser.Physics.Matter.Matter.Constraint.create({
		/* paddleLeft.con = this.matter.constraint.create({
			bodyA: paddleLeft.comp,
			pointA: { x: -29.5, y: -8.5 },
			bodyB: paddleLeft.hinge,
			length: 0,
			stiffness: 0
		}); */

		//  A spring, because length > 0 and stiffness < 0.9
		
		//Phaser.Physics.Matter.Matter.World.add(world, [paddleLeft.comp, paddleLeft.hinge, paddleLeft.con]);
		//		engine.world.add(world, [paddleLeft.comp, paddleLeft.hingen]);
		//this.scene.physics.add.existing(paddleLeft.comp);
		//Phaser.Physics.Matter.Matter.Body.rotate(paddleLeft.comp, 0.57, { x: 142, y: 660 });
		//engine.body.rotate(paddleLeft.comp, 0.57, { x: 142, y: 660 });

		// right paddle mechanism
		let paddleRight = {};
		paddleRight.paddle = this.matter.add.trapezoid(280, 660, 20, 80, 0.33, {
			isStatic: true,
			label: 'paddleRight',
			angle: -1.57,
			chamfer: {},
			render: {
				fillStyle: COLOR.PADDLE,
				fillColor: COLOR.PADDLE,
				lineColor: COLOR.PADDLE
			}
		});
		paddleRight.brick = this.matter.add.rectangle(278, 672, 40, 80, {
			isStatic: true,
			angle: -1.62,
			chamfer: {},
			render: {
				visible: true
			}
		});
		paddleRight.comp = this.matter.body.create({
			isStatic: true,
			label: 'paddleRightComp',
			parts: [paddleRight.paddle, paddleRight.brick]
		});
		paddleRight.hinge = this.matter.add.circle(308, 660, 5, {
			isStatic: true,
			render: {
				visible: true
			}
		});
		Object.values(paddleRight).forEach((piece) => {
			piece.collisionFilter.group = paddleGroup
		});
		paddleRight.con = this.matter.constraint.create({
			bodyA: paddleRight.comp,
			pointA: { x: 29.5, y: -8.5 },
			bodyB: paddleRight.hinge,
			length: 0,
			stiffness: 0
		});
		//Phaser.Physics.Matter.Matter.World.add(world, [paddleRight.comp, paddleRight.hinge, paddleRight.con]);
		engine.world.add(world, [paddleRight.comp, paddleRight.hinge, paddleRight.con]);
		//Phaser.Physics.Matter.Matter.Body.rotate(paddleRight.comp, -0.57, { x: 308, y: 660 });
		//engine.body.rotate(paddleRight.comp, -0.57, { x: 308, y: 660 });
	}
	createPinball() {
		// x/y are set to when pinball is launched
		//pinball = Phaser.Physics.Matter.Matter.Bodies.circle(0, 0, 14, {
		pinball = engine.add.circle(0, 0, 14, {
			label: 'pinball',
			collisionFilter: {
				group: stopperGroup
			},
			render: {
				fillStyle: COLOR.PINBALL,
				fillColor: COLOR.PINBALL,
				lineColor: COLOR.PINBALL
			}
		});
		//Phaser.Physics.Matter.Matter.World.add(world, pinball);
		engine.world.add(world, pinball);
		this.launchPinball();
	}

	launchPinball() {
		this.updateScore(0);
		//Phaser.Physics.Matter.Matter.Body.setPosition(pinball, { x: 465, y: 765 });
		engine.body.setPosition(pinball, { x: 465, y: 765 });
		//Phaser.Physics.Matter.Matter.Body.setVelocity(pinball, { x: 0, y: -25 + rand(-2, 2) });
		engine.body.setVelocity(pinball, { x: 0, y: -25 + this.rand(-2, 2) });
		//Phaser.Physics.Matter.Matter.Body.setAngularVelocity(pinball, 0);
		engine.body.setAngularVelocity(pinball, 0);
	}

	pingBumper(bumper) {
		this.updateScore(currentScore + 10);

		// flash color
		bumper.render.fillStyle = COLOR.BUMPER_LIT;
		setTimeout(function () {
			bumper.render.fillStyle = COLOR.BUMPER;
		}, 100);
	}

	updateScore(newCurrentScore) {
		currentScore = newCurrentScore;
		//$currentScore.text(currentScore);

		highScore = Math.max(currentScore, highScore);
		//$highScore.text(highScore);
	}

	// matter.js has a built in random range function, but it is deterministic
	rand(min, max) {
		return Math.random() * (max - min) + min;
	}

	createEvents() {
		// events for when the pinball hits stuff
		//Phaser.Physics.Matter.Matter.Events.on(engine, 'collisionStart', function(event) {
		engine.world.on('collisionstart', function (event) {
			let pairs = event.pairs;
			pairs.forEach(function (pair) {
				if (pair.bodyB.label === 'pinball') {
					switch (pair.bodyA.label) {
						case 'reset':
							game.launchPinball();
							break;
						case 'bumper':
							game.pingBumper(pair.bodyA);
							break;
					}
				}
			});
		});

		// regulate pinball
		engine.world.on('beforeupdate', function (event) {
			// bumpers can quickly multiply velocity, so keep that in check
			Phaser.Physics.Matter.Matter.Body.setVelocity(pinball, {
				x: Math.max(Math.min(pinball.velocity.x, MAX_VELOCITY), -MAX_VELOCITY),
				y: Math.max(Math.min(pinball.velocity.y, MAX_VELOCITY), -MAX_VELOCITY),
			});

			// cheap way to keep ball from going back down the shooter lane
			if (pinball.position.x > 450 && pinball.velocity.y > 0) {
				Phaser.Physics.Matter.Matter.Body.setVelocity(pinball, { x: 0, y: -10 });
			}
		});

		// // mouse drag (god mode for grabbing pinball)
		// Phaser.Physics.Matter.Matter.World.add(world, Phaser.Physics.Matter.Matter.MouseConstraint.create(engine, {
		// 	mouse: Phaser.Physics.Matter.Matter.Mouse.create(render.canvas),
		// 	constraint: {
		// 		stiffness: 0.2,
		// 		render: {
		// 			visible: false
		// 		}
		// 	}
		// }));

		// keyboard paddle events
		//$('body').on('keydown', function(e) {
		this.input.keyboard.on('keydown', function (e) {
			if (e.which === 37) { // left arrow key
				isLeftPaddleUp = true;
			} else if (e.which === 39) { // right arrow key
				isRightPaddleUp = true;
			}
		});
		//$('body').on('keyup', function(e) {
		this.input.keyboard.on('keyup', function (e) {
			if (e.which === 37) { // left arrow key
				isLeftPaddleUp = false;
			} else if (e.which === 39) { // right arrow key
				isRightPaddleUp = false;
			}
		});

		// // click/tap paddle events
		// $('.left-trigger')
		// 	.on('mousedown touchstart', function(e) {
		// 		isLeftPaddleUp = true;
		// 	})
		// 	.on('mouseup touchend', function(e) {
		// 		isLeftPaddleUp = false;
		// 	});
		// $('.right-trigger')
		// .on('mousedown touchstart', function(e) {
		// 		isRightPaddleUp = true;
		// 	})
		// 	.on('mouseup touchend', function(e) {
		// 		isRightPaddleUp = false;
		// 	});
	}

	create() {
		//var graphics = this.add.graphics();
		this.iniciar();
		this.createStaticBodies();
		this.createPaddles();
		this.createPinball();
		this.createEvents();
	}

	update() {


	}

}