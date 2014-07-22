/* Simple JavaScript Inheritance for ES 5.1
 * based on http://ejohn.org/blog/simple-javascript-inheritance/
 *  (inspired by base2 and Prototype)
 * MIT Licensed.
 */
(function(global) {
  "use strict";
  var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  function BaseClass(){}

  // Create a new Class that inherits from this class
  BaseClass.extend = function(props) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    var proto = Object.create(_super);

    // Copy the properties over onto the new prototype
    for (var name in props) {
      // Check if we're overwriting an existing function
      proto[name] = typeof props[name] === "function" && 
        typeof _super[name] == "function" && fnTest.test(props[name]) ?
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
        })(name, props[name]) :
        props[name];
    }

    // The new constructor
    var newClass = typeof proto.init === "function" ?
      proto.init : // All construction is actually done in the init method
      function(){};

    // Populate our constructed prototype object
    newClass.prototype = proto;

    // Enforce the constructor to be what we expect
    proto.constructor = newClass;

    // And make this class extendable
    newClass.extend = BaseClass.extend;

    return newClass;
  };

  // export
  global.Class = BaseClass;
})(this);

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

var Helper = {
    getType: function(q) {
        return Object.prototype.toString.call(q);
    },
    regexps: {
        obj: /object\sobject/i,
        arr: /object\sarray/i,
        num: /object\snumber/i,
        str: /object\sstring/i,
        bool: /object\sboolean/i,
        und: /object\sundefined/i,
        nul: /object\snull/i
    },
    isObject: function(q) { return this.regexps.obj.test(this.getType(q)); },
    isArray: function(q) { return this.regexps.arr.test(this.getType(q)); },
    isNumber: function(q) { return this.regexps.num.test(this.getType(q)); },
    isString: function(q) { return this.regexps.str.test(this.getType(q)); },
    isBoolean: function(q) { return this.regexps.bool.test(this.getType(q)); },
    isUndefined: function(q) { return this.regexps.und.test(this.getType(q)); },
    isNull: function(q) { return this.regexps.nul.test(this.getType(q)); },
    merge: function() {
        var out = {},
            args = Array.prototype.slice.call(arguments);
        for (var i = 0; i < args.length; ++ i) {
            var obj = args[i];
            if (this.isObject(obj)) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        out[prop] = obj[prop];
                    }
                }
            }
        }
        return out;
    }
};

/**
 * Vector
 * Stores values pertaining to position in space or speed along the listed axes
 * 
 * @returns object Vector
 */
var Vector = Class.extend({
    init: function(obj) {
        var obj = Helper.merge({
            x: this.x,
            y: this.y,
            z: this.z
        }, obj);
        this.x = obj.x;
        this.y = obj.y;
        this.z = obj.z;
    },
    x: 0,
    y: 0,
    z: 0
});

/**
 * Acceleration
 * Stores values pertaining to the change in speed and/or direction along any 
 * axis of motion
 * 
 * @returns object Acceleration
 */
var Acceleration = Vector.extend({
    init: function(obj) {
        var obj = Helper.merge({
            x: this.x,
            y: this.y,
            z: this.z,
            rx: this.rx,
            ry: this.ry,
            rz: this.rz
        }, obj);
        this._super(obj);
        this.rx = obj.rx;
        this.ry = obj.ry;
        this.rz = obj.rz;
    },
    rx: 0,
    ry: 0,
    rz: 0
});

/**
 * Range
 * Stores the minimum and maximum values along a single axis
 * 
 * @returns object Range
 */
var Range = Class.extend({
    init: function(obj) {
        var obj = Helper.merge({
            min: this.max,
            min: this.max
        }, obj);
        this.min = obj.min;
        this.max = obj.max;
    },
    max: 0,
    min: 0
});

/**
 * Thrust
 * Stores values pertaining to the available power output along any axis of 
 * motion
 * 
 * @returns object Thrust
 */
var Thrust = Class.extend({ // TODO: Determine whether massless values or not (should I use degrees/metres or Newton-metres/Joules?)
    init: function() {
        
    },
    x: new Range(),  // metres/second
    y: new Range(),  // metres/second
    z: new Range(),  // metres/second
    rx: new Range(), // degrees/second
    ry: new Range(), // degrees/second
    rz: new Range()  // degrees/second
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
    dimensions: new Vector(),         // +   size of bounding box in metres -- not strictly a Vector, but why not reuse code?
    terminalV: new Thrust(),          // +   maximum speed along any axis of motion

    // Properties of Thing in relation to space
    location: new Vector(),    //     current location in space
    orientation: new Vector(), // +/- current direction facing (degrees) ([0, 0, 0] = facing positive Y and perpendicular to both X and Z)
    velocity: new Vector(),    // +/- current change in position (metres/second)
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
        // this._super(); // Only call this if Thing has an init() method defined
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
