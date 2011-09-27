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

    privates = (function(){
        var key = 1;
        function next_private_key() {
            key += 1;
            return key;
        }
        function privates(owner, obj) {
            if (typeof owner.__privates === 'undefined') {
                owner.__privates = {};
            }
            if (typeof obj.__private_key === 'undefined') {
                obj.__private_key = next_private_key();
            }
            if (typeof owner.__privates[obj.__private_key] === 'undefined') {
                owner.__privates[obj.__private_key] = {};
            }
                   
            return owner.__privates[obj.__private_key];
        }
        return privates;
    })();
})();
