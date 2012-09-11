function ViewPort(canvas_id) {
    var that = this;
    this.set('canvas', document.getElementById(canvas_id));
    this.set('ctx', this.get('canvas').getContext('2d'));
    this.set('renderer', new Rendered(this));

    this.update({
        x: 0,
        y: 0,
        zoom: 1
    });

    this.propagate('mouse', 'scene', function(eventname, coord, fromcoord) {
        var canvas = this.get('canvas');
        coord[0] -= canvas.offsetLeft;
        coord[1] -= canvas.offsetTop;
        if (typeof fromcoord !== 'undefined') {
            fromcoord[0] -= canvas.offsetLeft;
            fromcoord[1] -= canvas.offsetTop;
        }
        return arguments;
    });
    
    this.propagate('key', 'scene');

    var viewport = this
    ,   canvas = this.get('canvas')
    ,   mevents = {
            mousemove: 'mouse.move'
        ,   mousedown: 'mouse.down'
        ,   mouseup:   'mouse.up'
        ,   click:     'mouse.click'
        ,   mousewheel:'mouse.wheel'
        }
    ;

    function adjusted_coords(e) {
        var coord
        ,   offset_x = that.get('x')
        ,   offset_y = that.get('y')
        ,   zoom = that.get('zoom')
        ;

        return new V(
            e.clientX/zoom + offset_x
        ,   e.clientY/zoom + offset_y
        )
    }

    if (typeof window.nowplayviewports === "undefined") {
        window.nowplayviewports = [];
        window.onkeyup = window.onkeypress = window.onkeydown = function(e) {
            var t = e.type.split("key");
            t[0] = 'key';
            t = t.join('.');
            for (var i = 0; i < window.nowplayviewports.length; i++) {
                window.nowplayviewports[i].trigger(t, e.keyCode);
            }
        };
    }
    window.nowplayviewports.push(this);

    var fromcoord, isdown;
    for (var mevent in mevents) {
        (function(mevent){
            if (mevent === 'mousemove') {
                this.get('canvas')['on' + mevent] = function(e) {
                    if (isdown) {
                        viewport.trigger('mouse.drag', adjusted_coords(e), fromcoord);
                    } else {
                        viewport.trigger(mevents[mevent], adjusted_coords(e), fromcoord);
                    }
                    fromcoord = adjusted_coords(e);
                }
            } else if (mevent === 'mousewheel') {
                function onmousewheel(e) {
                    var delta = 0;
                    if (e.wheelDelta) {
                        delta = e.wheelDelta / 120;
                    } else if (e.detail) {
                        delta = -e.detail / 3;
                    }
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    e.returnValue = false;

                    viewport.trigger(mevents[mevent], adjusted_coords(e), delta);
                }
                if (window.addEventListener) {
                    window.addEventListener('DOMMouseScroll', onmousewheel, false);
                } else {
                    // ???
                }
            } else {
                console.log('setting up canvas event', mevent);
                this.get('canvas')['on' + mevent] = function(e) {
                    if (mevent === 'mousedown') {
                        isdown = true;
                    } else if (mevent === 'mouseup') {
                        isdown = false;
                    }
                    viewport.trigger(mevents[mevent], adjusted_coords(e));
                }
                console.log(this.get('canvas')['on' + mevent]);
            }
        }).call(this, mevent);
    }
}
ViewPort.prototype = new Entity();
ViewPort.prototype.onsetscene = function(e, scene) {
    var renderer = this.get('renderer');

    scene.set('viewport', this);

    renderer.bind('ready', function() {
        scene.run();
        renderer.renderFrame();
    });
    renderer.prepareScene(scene);
};
