var renderer;

(function(){
    renderer = new Behavior('position');
    
    renderer.x = 0;
    renderer.y = 0;
    renderer.zoom = 1;

    renderer.bind('entitytick', function(e, t, entity) {
        var position = entity.get('position')
        ,   color = entity.get('color')
        ,   size = 10
        ;

        ctx.save();

        ctx.translate(position[0], position[1]);

        ctx.fillStyle = colorStyle(color);
        ctx.fillRect(-size/2, -size/2, size, size);

        ctx.restore();
    });
    renderer.bind('beforetick', function() {
        ctx.save();

        ctx.scale(this.zoom, this.zoom);
        ctx.translate(this.x, this.y);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, 0, 640, 480);
    });
    renderer.bind('aftertick', function() {
        ctx.restore();
    });

    // render utilities
    function colorStyle(color) {
        if (color.length === 3)
            return ['rgb(', parseInt(color[0]*255), ', ', parseInt(color[1]*255), ', ', parseInt(color[2]*255), ')'].join('');
        else
            return ['rgba(', parseInt(color[0]*255), ', ', parseInt(color[1]*255), ', ', parseInt(color[2]*255), ', ', parseInt(color[3]*255), ')'].join('');
    }
})();
