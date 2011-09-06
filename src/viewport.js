function ViewPort(canvas_id) {
    this.set('canvas', document.getElementById(canvas_id));
    this.set('ctx', this.get('canvas').getContext('2d'));
    this.set('renderer', new Rendered(this));

    this.update({
        x: 0,
        y: 0,
        zoom: 1
    });

    this.propagate('mouse', 'scene', function(eventname, coord) {
        var canvas = this.get('canvas');
        coord[0] -= canvas.offsetLeft;
        coord[1] -= canvas.offsetTop;
        return arguments;
    });

    var viewport = this;
    this.get('canvas').onclick = function(e) {
        console.log(e.clientX, e.clientY);
        viewport.trigger('mouse.click', new V(e.clientX, e.clientY));
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
};
