function Rendered(viewport) {
    this.set('viewport', viewport);
}
Rendered.prototype = new Behavior('position');
Rendered.prototype.onentitytick = function(e, t, entity) {
    var position = entity.get('position')
    ,   color = entity.get('color')
    ,   scale = entity.get('scale', 1.0)
    ,   ctx = this.get('viewport').get('ctx')
    ;

    ctx.save();

    ctx.translate(position[0], position[1]);
    ctx.rotate(entity.get('rotation', 0));
    ctx.scale(scale, scale);

    ctx.fillStyle = colorStyle(color);
    ctx.fillRect(-10/2, -10/2, 10, 10);

    ctx.restore();
};
Rendered.prototype.onbeforetick = function() {
    var viewport = this.get('viewport')
    ,   ctx = viewport.get('ctx')
    ,   zoom = viewport.get('zoom')
    ,   offset_x = viewport.get('x')
    ,   offset_y = viewport.get('y')
    ;

    if (viewport.get('scene').get('clearEachFrame')) {
        ctx.save();

        ctx.scale(zoom, zoom);
        ctx.translate(offset_x, offset_y);

        ctx.fillStyle = colorStyle(this.get('backgroundcolor', [1, 1, 1, 0.3]));
        ctx.fillRect(-100, -100, 840, 680);
    }
};
Rendered.prototype.onaftertick = function() {
    var ctx = this.get('viewport').get('ctx');
    ctx.restore();
};

// render utilities
function colorStyle(color) {
    if (color.length === 3)
        return ['rgb(', parseInt(color[0]*255), ', ', parseInt(color[1]*255), ', ', parseInt(color[2]*255), ')'].join('');
    else
        return ['rgba(', parseInt(color[0]*255), ', ', parseInt(color[1]*255), ', ', parseInt(color[2]*255), ', ', color[3], ')'].join('');
}
