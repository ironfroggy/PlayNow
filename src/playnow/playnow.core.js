(function(){

    if (window.setImmediate) {
        if (window.msSetImmediate) {
            window.setImmediate = window.msSetImmediate;
        } else if (window.MozSetImmediate) {
            window.setImmediate = window.MozSetImmediate;
        } else if (window.msSetImmediate) {
            window.setImmediate = window.WebkitSetImmediate;
        } else if (window.msSetImmediate) {
            window.setImmediate = window.msSetImmediate;
        } else {
            window.setImmediate = function(f) {
                window.setTimeout(f, 0);
            };
        }
    }

    // from http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimFrame = (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        (function(callback, element){
            window.setTimeout(callback, 1000 / 60);
        })
    );

})();
