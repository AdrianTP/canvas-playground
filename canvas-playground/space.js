/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();

"use strict";

/**
 * Vector
 * Stores values pertaining to position in space or speed along the listed axes
 * 
 * @returns object Vector
 */
var Vector = Class.extend({
	x: x,
	y: y,
	z: z
});

/**
 * Acceleration
 * Stores values pertaining to the change in speed and/or direction along any 
 * axis of motion
 * 
 * @returns object Acceleration
 */
var Acceleration = Class.extend({
	x: x,
	y: y,
	z: z,
	rx: rx,
	ry: ry,
	rz: rz
});

/**
 * MinMax
 * Stores the minimum and maximum values along a single axis
 * 
 * @returns object MinMax
 */
var MinMax = Class.extend({
	pos: 0,
	neg: 0
});

/**
 * Thrust
 * Stores values pertaining to the available power output along any axis of 
 * motion
 * 
 * @returns object Thrust
 */
var Thrust = Class.extend({ // TODO: Determine whether massless values or not (should I use degrees/metres or Newton-metres/Joules?)
	x: new MinMax(),  // metres/second
	y: new MinMax(),  // metres/second
	z: new MinMax(),  // metres/second
	rx: new MinMax(), // degrees/second
	ry: new MinMax(), // degrees/second
	rz: new MinMax()  // degrees/second
});

/**
 * Thing
 * Base class for any physical object - stores intrinsic physical properties 
 * describing that object and its behaviour and interaction with space and other
 * Thing instances
 * 
 * @returns object Thing
 */
var Thing = Class.extend({
	// Properties of Thing itself
	name: name,
	mass: 0,                          // +   mass of Thing in kilogrammes? tonnes? TODO: decide measurement
	density: 1,                       // +   ratio of mass to empty space within volume? amount of mass per cubic metre? TODO: decide density units
	volume: 1,                        // +   size of bounding box in cubic metres
	dimensions: {                     // +   size of bounding box in metres
		x: 0,
		y: 0,
		z: 0
	},
	terminalV: new Thrust(),          // +   maximum speed along any axis of motion

	// Properties of Thing in relation to space
	location: new Vector(0, 0, 0),    //     current location in space
	orientation: new Vector(0, 0, 0), // +/- current direction facing (degrees) ([0, 0, 0] = facing positive Y and perpendicular to both X and Z)
	velocity: new Vector(0, 0, 0),    // +/- current change in position (metres/second)
	acceleration: new Acceleration()  // +/- current change in velocity or orientation 
});

var Asteroid = new Thing("asteroid1");

/**
 * Ship
 * Extends the Thing class to include properties pertaining to self-powered 
 * objects in space
 * 
 * @type @call;Thing@call;extend
 * 
 * @returns Thing
 */
var Ship = Thing.extend({
	init: function() {
		this._super();
		// set ship properties here, such as mass and terminalV
	},
	thrust: new Thrust(),             // +   power output along any axis of motion
	acceleration: new Thrust(),
	accelerating: false,
	turning: false,
	firing: {
		primary: false,
		secondary: false
	}
});
