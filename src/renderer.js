function Rendered(viewport) {
    this.set('viewport', viewport);
}
Rendered.prototype = new Behavior('position');
Rendered.prototype.onentitytick = function(e, t, entity) {
    var position = entity.get('position')
    ,   color = entity.get('color')
    ,   size = 10
    ,   ctx = this.get('viewport').get('ctx')
    ;

    ctx.save();

    ctx.translate(position[0], position[1]);

    ctx.fillStyle = colorStyle(color);
    ctx.fillRect(-size/2, -size/2, size, size);

    ctx.restore();
};
Rendered.prototype.onbeforetick = function() {
    var ctx = this.get('viewport').get('ctx');
    ctx.save();

    ctx.scale(this.zoom, this.zoom);
    ctx.translate(this.x, this.y);

    ctx.fillStyle = colorStyle(this.get('backgroundcolor', [1, 1, 1, 0.3]));
    ctx.fillRect(-100, -100, 840, 680);
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
