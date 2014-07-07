var createjs = createjs || {};

(function() {
    var Container = function() {
        this.initialize();
    };
    var p = Container.prototype = new createjs.Container();
    
    /**
     * Changes the depth of the specified child. Fails silently if the child is not a child of this container, or the index is out of range.
     * @param {DisplayObject} child
     * @param {Number} index  
     * @method setChildIndex
     **/
    p.bringChildToFront = function(child, index) {
        
        child.parent.setChildIndex(child, child.parent.getNumChildren - 1);
    };
    
    // p.setChildIndex = function(child, index) {
    //     var kids = this.children,
    //         l = kids.length;
    //     if (child.parent != this || index < 0 || index >= l) {
    //         return;
    //     }
    //     for (var i = 0; i < l; i++) {
    //         if (kids[i] == child) {
    //             break;
    //         }
    //     }
    //     if (i == l || i == index) {
    //         return;
    //     }
    //     kids.splice(i, 1);
    //     kids.splice(index, 0, child);
    // };
    createjs.Container = Container;
})();