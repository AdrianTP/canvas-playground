var App = App || {
    canvas: null,
        stage: null,
        bgSrc: new Image(),
        bg: null,
        btnSrc: new Image(),
        btn: null,
        centerX: 275,
        centerY: 150,
        gfxLoaded: 0,

    init: function init() {
        this.canvas = document.querySelector("#stage");
        this.stage = new createjs.Stage(this.canvas);
        this.stage.mouseEventsEnabled = true;
        this.loadAssets();
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener(this.stage);
    },

    loadAssets: function loadAssets() {
        this.bgSrc.src = 'bg.png';
        this.bgSrc.name = 'bg';
        this.bgSrc.onload = App.loadGfx;

        this.btnSrc.src = 'button.png';
        this.btnSrc.name = 'button';
        this.btnSrc.onload = App.loadGfx;
    },
    
    loadGfx: function loadGfx(e) {
        debugger;
        if (e.target.name = 'bg') {
            App.bg = new createjs.Bitmap(App.bgSrc);
        }
        if (e.target.name = 'button') {
            App.btn = new createjs.Bitmap(App.btnSrc);
        }
    
        App.gfxLoaded++;
    
        /* Display graphics until all of them are loaded */
    
        if (App.gfxLoaded == 2) {
            App.buildInterface();
        }
    },
    
    buildInterface: function buildInterface() {
        this.btn.x = this.centerX - 40;
        this.btn.y = this.centerY - 12;

        this.stage.addChild(this.bg, this.btn);
        this.stage.update(); // Very Important

        /* Add button listener */

        this.btn.onPress = App.showText;
    },
    
    showText: function showText() {
        debugger;
        console.log('This works like trace!');
    
        /* Remove Listener */
    
        App.btn.onPress = null;
    
        /* Create Text */
    
        var msg = new createjs.Text('Hello World!', 'Bold 25px Arial', '#EEE');
    
        msg.x = App.centerX - 70;
        msg.y = App.centerY;
    
        App.stage.addChild(msg);
        msg.alpha = 0;
    
        /* Animation */
    
        createjs.Tween.get(App.btn).to({
            y: App.centerY + 50
        }, 300);
        createjs.Tween.get(msg).wait(400).to({
            alpha: 1
        }, 400);
    },
    
    main: function() {
        debugger;
        this.init();
    }
};