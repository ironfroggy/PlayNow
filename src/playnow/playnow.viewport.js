function ViewPort(canvas_id) {
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

    var fromcoord, isdown;
    for (var mevent in mevents) {
        (function(mevent){
            if (mevent === 'mousemove') {
                this.get('canvas')['on' + mevent] = function(e) {
                    if (isdown) {
                        viewport.trigger('mouse.drag', new V(e.clientX, e.clientY), fromcoord);
                    } else {
                        viewport.trigger(mevents[mevent], new V(e.clientX, e.clientY), fromcoord);
                    }
                    fromcoord = new V(e.clientX, e.clientY);
                }
            } else {
                this.get('canvas')['on' + mevent] = function(e) {
                    if (mevent === 'mousedown') {
                        isdown = true;
                    } else if (mevent === 'mouseup') {
                        isdown = false;
                    }
                    viewport.trigger(mevents[mevent], new V(e.clientX, e.clientY));
                }
            }
        }).call(this, mevent);
    }
}
ViewPort.prototype = new Entity();
ViewPort.prototype.onsetscene = function(e, scene) {
    var renderer = this.get('renderer');
    scene.bind('aftertick', function(e) {
        renderer.trigger('aftertick');
    });
    scene.bind('beforetick', function(e) {
        renderer.trigger('beforetick');
    });
    scene.bind('tickentity', function(e, t, entity) {
        renderer.trigger('entitytick', t, entity);
    });

    scene.set('viewport', this);

    renderer.bind('ready', function() {
        scene.run();
    });
    renderer.prepareScene(scene);
};
