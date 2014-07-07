createjs.Sprite.prototype.reverse = function() {
    var currentFrame = this._currentFrame;
    var numFrames = this.spriteSheet.getNumFrames(this.currentAnimation);
    if (currentFrame <= 0) { 
        currentFrame = numFrames - 1;
    } else {
        -- currentFrame;
    }
    
    this.gotoAndStop(currentFrame);//_goto(this.currentAnimation, currentFrame);
};

createjs.Sprite.prototype.forward = function() {
    var currentFrame = this._currentFrame;
    var numFrames = this.spriteSheet.getNumFrames(this.currentAnimation);
    if (currentFrame >= numFrames) { 
        currentFrame = 0;
    } else {
        ++ currentFrame;
    }
    
    this.gotoAndStop(currentFrame);//_goto(this.currentAnimation, currentFrame);
};

//createjs.Sprite.prototype.layer = {
//	bringForward: function() {
//		this.parent.setChildIndex(this, this.parent.getChildIndex() + 1);
//		return this.parent.getChildIndex(this);
//	},
//	bringToFront: function() {
//		this.parent.setChildIndex(this, this.parent.getNumChildren() - 1);
//		return this.parent.getChildIndex(this);
//	},
//	sendBackward: function() {
//		this.parent.setChildIndex(this, this.parent.getChildIndex() - 1);
//		return this.parent.getChildIndex(this);
//	},
//	sendToBack: function() {
//		this.parent.setChildIndex(this, 0);
//		return this.parent.getChildIndex(this);
//	}
//};

//createjs.Sprite.prototype.bringForward = function() {
//	this.parent.setChildIndex(this, this.parent.getChildIndex() + 1);
//	return this.parent.getChildIndex(this);
//};
//
//createjs.Sprite.prototype.bringToFront = function() {
//	this.parent.setChildIndex(this, this.parent.getNumChildren() - 1);
//	return this.parent.getChildIndex(this);
//};
//
//createjs.Sprite.prototype.sendBackward = function() {
//	this.parent.setChildIndex(this, this.parent.getChildIndex() - 1);
//	return this.parent.getChildIndex(this);
//};
//
//createjs.Sprite.prototype.sendToBack = function() {
//	this.parent.setChildIndex(this, 0);
//	return this.parent.getChildIndex(this);
//};

var Cursor = function() {
    var sprite;
    
    var drawSprite = function() {
        sprite = new createjs.Shape();
        sprite.graphics.clear().s("#FFFFFF").f("#000000").mt(0,0).lt(0,32).lt(7,24).lt(22,22).lt(0,0).es().ef();
        return sprite;
    };
    
    return {
        sprite: drawSprite(),
        updatePosition: function(x, y) {
            sprite.x = x;
            sprite.y = y;
            return {
                x: sprite.x,
                y: sprite.y
            };
        }
    };
};

var DisplayObjectWrapper = function(cjsDO) {
    var DO = cjsDO();
    
    return {
        wrappedObject: DO,
        updatePosition: function(x, y) {
            DO.x = x;
            DO.y = y;
            return {
                x: DO.x,
                y: DO.y
            };
        },
        bringToFront: function() {
            DO.parent.setChildIndex(DO, DO.parent.getNumChildren() - 1);
            return DO.parent.getChildIndex(DO);
        },
        bringForward: function() {
            DO.parent.setChildIndex(DO, DO.parent.getChildIndex(DO) + 1);
            return DO.parent.getChildIndex(DO);
        },
        sendToBack: function() {
            DO.parent.setChildIndex(DO, 0);
            return DO.parent.getChildIndex(DO);
        },
        sendBackward: function() {
            DO.parent.setChildIndex(DO, DO.parent.getChildIndex(DO) - 1);
            return DO.parent.getChildIndex(DO);
        }
    };
};

var DisplayManager = function(stage) {
    // var DOs = {},
    //     stage = stage;
    
    return {
        DOs: {},
        stage: stage,
        add: function(name, item) {
            return this.DOs[name] = item;
        },
        get: function() {
            return this.DOs;
        },
        getByName: function(name) {
            return this.DOs[name];
        }
    };
};

var input = {
    map: {
        generic: {
            up: false,
            down: false,
            left: false,
            right: false,
            space: false,
            enter: false,
            esc: false
        },
        functions: {
            ship: {
                thrust: {
                    pressed: false,
                    keys: ["up", "w"]
                },
                brake: {
                    pressed: false,
                    keys: ["down", "s"]
                },
                rotate_acw: {
                    pressed: false,
                    keys: ["left", "a"]
                },
                rotate_cw: {
                    pressed: false,
                    keys: ["right", "d"]
                },
                fire_primary: {
                    pressed: false,
                    keys: ["space"]
                }
            },
            system: {
                menu: {
                    pressed: false,
                    keys: ["esc"]
                },
                confirm: {
                    pressed: false,
                    keys: ["enter"]
                }
            }
        }
    },
    keycodes: {
        up: 38,
        down: 40,
        left: 37,
        right: 39,
        w: 87,
        a: 65,
        s: 83,
        d: 68,
        space: 32,
        enter: 13,
        esc: 27
    },
    updateMap: function(e, value) {
        var functions = input.map.functions;
        for (var key in functions) { // ship, system
            if (functions.hasOwnProperty(key)) {
                var section = functions[key];
                for (var key2 in section) {
                    if (section.hasOwnProperty(key2)) {
                        var fn = section[key2];
                        if (fn.hasOwnProperty("keys")) {
                            for (var item in fn.keys) {
                                if (input.keycodes.hasOwnProperty(fn.keys[item])) {
                                    if (fn.hasOwnProperty("pressed") && e.keyCode === input.keycodes[fn.keys[item]]) {
                                        fn.pressed = value;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
		
		var out = {
			functions: input.map.functions,
			shuttleFrame: App.getSprites().getByName("shuttle").wrappedObject.currentFrame * 10
		};
		
		document.querySelector("#log").innerText = JSON.stringify(out, null, 4);
    },
    keydown: function(e) {
        e.preventDefault();
        
        input.updateMap(e, true);
        
        return false;
    },
    keyup: function(e) {
        e.preventDefault();
        
        input.updateMap(e, false);
        
        return false;
    }
};

var manifest = [
    // {id:"walksequence_spritesheet", src:"walksequence_spritesheet.png"},
    {id:"shuttle_spritesheet", src:"shuttle_spritesheet.png"}
];

//var loop = function() {
//    App.handleMouseEvents();
//    App.getSprites().getByName("fpsText").wrappedObject.text = Math.round(createjs.Ticker.getMeasuredFPS() * 100) / 100;
//    // App.update();
//    App.render();
//};
var c = 0;
var App = App || (function() {
    var preload,
        canvas,
        stage,
        // cursor = new Cursor(),
        sprites = new DisplayManager,
        _this = this;
    
    return {
		gridCoords: {
			x: 0,
			y: 0
		},
        getSprites: function() {
            return sprites;
        },
        getStage: function() {
            return stage;
        },
        init: function() {
            preload = new createjs.LoadQueue();
            // preload.installPlugin(createjs.Sound);
            preload.addEventListener("complete", App.doneLoading); // add an event listener for when load is completed
            preload.addEventListener("progress", App.updateLoading);
            preload.loadManifest(manifest);
            canvas = document.querySelector("#stage");
            stage = new createjs.Stage(canvas);
            sprites = new DisplayManager(stage);
            stage.enableMouseOver();
        },
        updateLoading: function() {
            console.log("Loading " + (preload.progress*100|0) + "%");
        },
        doneLoading: function(e) {
            console.log(e);
            createjs.Ticker.addEventListener("tick", App.loop);
            createjs.Ticker.setFPS(30);
            App.getStage().on("click", function(e) {
				var thing = App.getSprites().getByName("shuttle").wrappedObject.clone();
                App.getSprites().add("shuttle"+c, new DisplayObjectWrapper(function() {
                    return thing;
                }));
                var ref = App.getSprites().getByName("shuttle"+c);
                App.getStage().addChild(ref.wrappedObject);
                ref.updatePosition(App.gridCoords.x * 48 + 24, App.gridCoords.y * 48 + 24);
				console.log("ref", App.getStage().mouseX, ref.wrappedObject.x, App.getStage().mouseY, ref.wrappedObject.y);
                console.log(e, thing, App.getSprites().getByName("shuttle"+c));
                App.getSprites().getByName("cursor").bringToFront();
            });
            App.makeSprites();
            App.initSprites();
            App.getSprites().getByName("cursor").wrappedObject.bringToFront();
        },
        loop: function(e) {
			App.gridCoords.x = Math.round((stage.mouseX - 24) / 48);
			App.gridCoords.y = Math.round((stage.mouseY - 24) / 48);
            App.getSprites().getByName("fpsText").wrappedObject.text = Math.round(createjs.Ticker.getMeasuredFPS() * 100) / 100;
			App.getSprites().getByName("gridCoordsText").wrappedObject.text = JSON.stringify(App.gridCoords);
			App.getSprites().getByName("gridCoordsText").wrappedObject.x = App.getStage().canvas.width - App.getSprites().getByName("gridCoordsText").wrappedObject.getMeasuredWidth() - 5;
			App.getSprites().getByName("gridCoordsText").wrappedObject.y = App.getStage().canvas.height - App.getSprites().getByName("gridCoordsText").wrappedObject.getMeasuredHeight() - 5 - 12;
			App.getSprites().getByName("rawCoordsText").wrappedObject.text = JSON.stringify({
				x: App.getStage().mouseX,
				y: App.getStage().mouseY
			});
			App.getSprites().getByName("rawCoordsText").wrappedObject.x = App.getStage().canvas.width - App.getSprites().getByName("rawCoordsText").wrappedObject.getMeasuredWidth() - 5;
			App.getSprites().getByName("rawCoordsText").wrappedObject.y = App.getStage().canvas.height - App.getSprites().getByName("rawCoordsText").wrappedObject.getMeasuredHeight() - 5;
            App.update();
            App.render(e);
        },
        handleMouseEvents: function() {
            this.updateCursor();
        },
        findInArray: function(arr, value) {
            var out = 0;
            for (var key in arr) {
                if (arr[key] === value) {
                    out = parseInt(key, 10);
                }
            }
            return out;
        },
        handleKeyboardEvents: function() {
            var shuttle = App.getSprites().getByName("shuttle").wrappedObject,
                acw = shuttle.spriteSheet._data.spin_anticlockwise.frames,
                cw = shuttle.spriteSheet._data.spin_clockwise.frames;
            
            shuttle.frame = shuttle.frame || 0;
            
            if ((input.map.functions.ship.rotate_acw.pressed && input.map.functions.ship.rotate_cw.pressed) || (!input.map.functions.ship.rotate_acw.pressed && !input.map.functions.ship.rotate_cw.pressed)) {
                shuttle.stop();
            }
            
            if (input.map.functions.ship.rotate_acw.pressed && !input.map.functions.ship.rotate_cw.pressed) {
                if (shuttle.currentAnimation === "spin_anticlockwise") {
                    shuttle.frame = App.findInArray(cw, shuttle.currentFrame);
                    if (shuttle.paused) {
                        shuttle.play();
                    }
                } else {
                    shuttle._goto("spin_anticlockwise", shuttle.frame);//App.findInArray(acw, shuttle.currentFrame));
                }
            }
            
            if (input.map.functions.ship.rotate_cw.pressed && !input.map.functions.ship.rotate_acw.pressed) {
                if (shuttle.currentAnimation === "spin_clockwise") {
                    shuttle.frame = App.findInArray(acw, shuttle.currentFrame);
                    if (shuttle.paused) {
                        shuttle.play();
                    }
                } else {
                    shuttle._goto("spin_clockwise", shuttle.frame);// App.findInArray(cw, shuttle.currentFrame));
                }
            }
        },
        update: function() {
            this.handleMouseEvents();
            this.handleKeyboardEvents();
        },
        render: function(e) {
            stage.update(e);
        },
        updateCursor: function() {
            sprites.getByName("cursor").updatePosition(stage.mouseX, stage.mouseY);
            // cursor.x = stage.mouseX;
            // cursor.y = stage.mouseY;
        },
        
        makeSprites: function() {
            // sprites.cursor = new Cursor();
            
            sprites.add("cursor", new DisplayObjectWrapper(function() {
                var cursor = new createjs.Shape();
                cursor.graphics.clear().s("#FFFFFF").f("#000000").mt(0,0).lt(0,32).lt(9,22).lt(22,22).lt(0,0).es().ef();
//				var blurFilter = new createjs.BlurFilter(5, 5, 1);
//				cursor.filters = [blurFilter];
//				var bounds = blurFilter.getBounds();
//				cursor.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);
                return cursor;
            }));
            
            // sprites.add("runningMan", new DisplayObjectWrapper(function() {
            //     var sheet = new createjs.SpriteSheet({
            //         // images: ["walksequence_spritesheet.png"],
            //         images: [preload.getResult("walksequence_spritesheet")],
            //         frames: {
            //             regX: 0,
            //             regY: 0,
            //             height: 296,
            //             width: 240,
            //             count: 30
            //         },
            //         animations: {
            //             walk: [0, 29]
            //         }
            //     });
                
            //     var char = new createjs.Sprite(sheet, "walk");
            //     char.x = (stage.canvas.width / 2) - (char.spriteSheet._frameWidth / 2);
            //     char.y = (stage.canvas.height / 2) - (char.spriteSheet._frameHeight / 2);
            //     char.play();
            //     char.on("mouseover", function(e) {
            //         console.log("over", e);
            //         e.target.paused = true;
            //     });
            //     char.on("mouseout", function(e) {
            //         console.log("out", e);
            //         e.target.paused = false;
            //     });
                
            //     return char;
            // }));
            
            sprites.add("shuttle", new DisplayObjectWrapper(function() {
                var sheet = new createjs.SpriteSheet({
                    // images: ["shuttle_spritesheet.png"],
                    images: [preload.getResult("shuttle_spritesheet")],
                    framerate: 15,
                    frames: {
                        regX: 36,
                        regY: 36,
                        height: 72,
                        width: 72,
                        count: 36
                    },
                    animations: {
                        "spin_clockwise": {
                            frames: (function(a, b) {
                                var out = [];
                                for (var i = a; i <= b; ++ i) {
                                    out.push(i);
                                }
                                return out;
                            })(0, 35),
                            // speed: 2
                        },
                        // "spin_anticlockwise": [35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
                        "spin_anticlockwise": {
                            frames: (function(a, b) {
                                var out = [];
                                for (var i = a; i >= b; -- i) {
                                    out.push(i);
                                }
                                return out;
                            })(35, 0)
                        }
                    }
                });
                
                var char = new createjs.Sprite(sheet);
                char.currentFrame = 0;
                char.x = (stage.canvas.width / 2);
                char.y = (stage.canvas.height / 2);
                
				char.thrusting = false;
				char.firing = {
					primary: false,
					secondary: false
				};
				
                return char;
            }));
            
            sprites.add("fpsText", new DisplayObjectWrapper(function() {
                return new createjs.Text();
            }));
			
			sprites.add("gridCoordsText", new DisplayObjectWrapper(function() {
                var t = new createjs.Text();
				t.y = 12;
				return t;
            }));
			
			sprites.add("rawCoordsText", new DisplayObjectWrapper(function() {
                var t = new createjs.Text();
				t.y = 24;
				return t;
            }));
			
			sprites.add("atom", new DisplayObjectWrapper(function() {
				var grad = new createjs.Shape();
				grad.graphics.clear().setStrokeStyle(10).beginRadialGradientFill(["#FFF","#555"], [0,1], 0, 0, 0, 0, 0, 100).drawCircle(0, 0, 80)
				  .beginFill(null).beginStroke("#AAA").drawCircle(0, 0, 100);
				grad.x = 100,
				grad.y = 100;
				grad.scaleX = 0.24;
				grad.scaleY = 0.24;
//				var blurFilter = new createjs.BlurFilter(5, 5, 1);
//				grad.filters = [blurFilter];
//				var bounds = blurFilter.getBounds();
//				grad.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);
				return grad;
			}));
        },
        initSprites: function() {
            for (var key in sprites.get()) {
                var child = sprites.getByName(key).wrappedObject;
                stage.addChild(child);//sprites[key].sprite);
                stage.update();
            }
        }
    };
})();

function init() {
    App.init();
    
    document.addEventListener("keydown", input.keydown);
    document.addEventListener("keyup", input.keyup);
}

// var canvas, stage;

// var init = function() {
//     canvas = document.querySelector("#stage");
//     stage = new createjs.Stage(canvas);
//     stage.enableMouseOver();
    
//     createjs.Ticker.addEventListener("tick", loop);
//     renderMenu();
//     drawRectangle();
//     drawImage();
//     makeChar();
//     renderCursor();
// };

// var cursor;
// var renderCursor = function() {
//     cursor = new createjs.Shape();
//     cursor.graphics.clear().s("#FFFFFF").f("#000000").mt(0,0).lt(0,32).lt(7,24).lt(18,26).lt(0,0).es().ef();
//     stage.addChild(cursor);
//     cursor.x = stage.canvas.width * 2;
//     cursor.y = stage.canvas.height * 2;
//     cursor.bringToFront();
//     stage.update();
//     // for (var i = 0; i < stage.children.length; ++ i) {
//     //     stage.children[i].on("mouseover", function(e) {
//     //         console.log(e.target);
//     //     });
//     // }
// };

// var renderMenu = function() {
//     var titleText = new createjs.Text("Hello World", "20px Arial", "#ff7700");
//     stage.addChild(titleText);
// };

// var loop = function() {
//     // rect.x = stage.mouseX - (rect.getBounds().width / 2);
//     // rect.y = stage.mouseY - (rect.getBounds().height / 2);
//     cursor.x = stage.mouseX;
//     cursor.y = stage.mouseY;
//     stage.update();
// };



// // stuff

// var drawImage = function() {
//     var img = new createjs.Bitmap("button.png");
//     stage.addChild(img);
//     img.shadow = new createjs.Shadow("#000000", 5, 10, 15);
// };

// // var moveToTop = function(child) {
// //     stage.setChildIndex(child, stage.getNumChildren - 1);
// // };





// var makeSpriteSheet = function() {
//     // 1440 x 1480
//     // 6 x 5
//     var sheet = new createjs.SpriteSheet({
//         images: ["walksequence_spritesheet.png"],
//         frames: {
//             regX: 0,
//             regY: 0,
//             height: 296,
//             width: 240,
//             count: 30
//         },
//         animations: {
//             walk: [0, 29]
//         }
//     });
//     return sheet;
// };
// var char;
// var makeChar = function() {
//     char = new createjs.Sprite(makeSpriteSheet(), "walk");
//     char.framerate = 30;
//     char.x = (stage.canvas.width / 2) - (char.spriteSheet._frameWidth / 2);
//     char.y = (stage.canvas.height / 2) - (char.spriteSheet._frameHeight / 2);
//     stage.addChild(char);
//     char.play();
//     char.on("mouseover", function(e) {
//         console.log("over");
//     });
//     char.on("mouseout", function(e) {
//         console.log("out");
//     });
// };
// var rect;
// function drawRectangle(){
//  rect = new createjs.Shape();
//  rect.graphics.beginFill("#000").drawRect(0, 0, 100, 100);
//  rect.setBounds(0, 0, 100, 100);
//  stage.addChild(rect);
// //  rect.addEventListener("mousedown", function(e) {
// //      console.log(rect.x, rect.y);
// //     //  rect.x = e.stageX - (rect.width / 2);
// //     //  rect.y = e.stageY - (rect.height / 2);
// //     //  console.log(e.stageX, e.stageY, rect.x, rect.y);
// //  });
// }

// function drawCircle(){
//  var circle = new createjs.Shape();
//  circle.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)").drawCircle(160,60,40);
//  stage.addChild(circle);
    
// }

// function drawLine(){
//   var line = new createjs.Shape();
//   line.graphics.moveTo(220,60).setStrokeStyle(1).beginStroke("#00ff00").lineTo(300,60);
//   stage.addChild(line);
    
// }

// function drawPolystar(){
//     var polystar = new createjs.Shape();
//     polystar.graphics.setStrokeStyle(1).beginStroke("#0000ff").drawPolyStar(360,60,10,5,6,20);
//     stage.addChild(polystar);
    
    
// }

// function drawLinearGradient(){
//     var gradient = new createjs.Shape();
//     gradient.graphics.beginLinearGradientFill(["rgba(255,198,255,1)", "rgba(0,255,0,1)"], [0, 1], 0, 50, 0,   130).drawRoundRect(430, 10, 90, 90,10);
//     stage.addChild(gradient);
    
    
// }

// var App = App || (function(window) {
    // var canvas,
    //     stage,
    //     bgSrc = new Image(),
    //     bg,
    //     btnSrc = new Image(),
    //     btn,
    //     centerX = 275,
    //     centerY = 150,
    //     gfxLoaded = 0;

    // var init = function init() {
    //     canvas = document.querySelector("#stage");
    //     stage = new createjs.Stage(canvas);
    //     stage.mouseEventsEnabled = true;
    //     loadAssets();
    //     createjs.Ticker.setFPS(30);
    //     createjs.Ticker.addEventListener(stage);
    // };

    // var loadAssets = function loadAssets() {
    //     bgSrc.src = 'bg.png';
    //     bgSrc.name = 'bg';
    //     bgSrc.onload = loadGfx;

    //     btnSrc.src = 'button.png';
    //     btnSrc.name = 'button';
    //     btnSrc.onload = loadGfx;
    // };
    
    // var loadGfx = function loadGfx(e) {
    //     if (e.target.name = 'bg') {
    //         bg = new createjs.Bitmap(bgSrc);
    //     }
    //     if (e.target.name = 'button') {
    //         btn = new createjs.Bitmap(btnSrc);
    //     }
    
    //     gfxLoaded++;
    
    //     /* Display graphics until all of them are loaded */
    
    //     if (gfxLoaded == 2) {
    //         buildInterface();
    //     }
    // };
    
    // var buildInterface = function buildInterface() {
    //     btn.x = centerX - 40;
    //     btn.y = centerY - 12;

    //     stage.addChild(bg, btn);
    //     stage.update(); // Very Important

    //     /* Add button listener */

    //     btn.addEventListener("mousedown", showText);// = showText;
    // };
    
    // var showText = function showText() {
    //     console.log('This works like trace!');
    
    //     /* Remove Listener */
    
    //     btn.onPress = null;
    
    //     /* Create Text */
    
    //     var msg = new createjs.Text('Hello World!', 'Bold 25px Arial', '#EEE');
    
    //     msg.x = centerX - 70;
    //     msg.y = centerY;
    
    //     stage.addChild(msg);
    //     msg.alpha = 0;
    
    //     /* Animation */
    
    //     createjs.Tween.get(btn).to({
    //         y: centerY + 50
    //     }, 300);
    //     createjs.Tween.get(msg).wait(400).to({
    //         alpha: 1
    //     }, 400);
    // };

    // return {
    //     main: function main() {
    //         init();
    //     }
    // };
// })(window);