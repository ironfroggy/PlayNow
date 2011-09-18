function Rendered(viewport) {
    this.set('viewport', viewport);

    this._images = {};
}
Rendered.prototype = new Behavior('position');

Rendered.prototype.renderFrame = function() {
    // Before entities
    var viewport = this._components['viewport']
    ,   scene = viewport._components['scene']
    ,   ctx = viewport._components['ctx']
    ,   zoom = viewport._components['zoom']
    ,   offset_x = viewport._components['x']
    ,   offset_y = viewport._components['y']
    ,   background_color = scene._components['clearEachFrame'] || [1, 1, 1]
    ;

    if (background_color && background_color.length === 3) {
        background_color.push(scene._components['clearEachFrameTranslucent'] || 0.3);
    }

    if (background_color) {
        ctx.save();

        ctx.scale(zoom, zoom);
        ctx.translate(offset_x, offset_y);

        ctx.fillStyle = colorStyle(background_color);
        ctx.fillRect(-100, -100, 840, 680);
    }

    // Entities
    for (var i=0,l=scene.entities.length; i<l; i++) {
        var entity = scene.entities[i]
        ,   position = entity._components['position']
        ,   color = entity._components['color']
        ,   image = entity._components['image']
        ,   scale = entity._components['scale'] || 1.0
        ,   alpha = entity._components['alpha']
        ,   alpha = typeof alpha === 'undefined' ? 1.0 : alpha
        ;

        if (typeof position === 'undefined') {
            continue;
        }

        ctx.save();

        ctx.translate(position[0], position[1]);
        ctx.rotate(entity._components['rotation'] || 0);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;

        if (image) {
            ctx.drawImage(
                image,
                0, 0
            )
        } else {
            ctx.fillStyle = colorStyle(color);
            ctx.fillRect(-10/2, -10/2, 10, 10);
        }

        ctx.restore();
    }

    // Cleanup
    var ctx = this.get('viewport').get('ctx');
    ctx.restore();

    var renderer = this;
    setTimeout(function() {
        renderer.renderFrame();
    }, 40);
};

Rendered.prototype.prepareScene = function(scene) {
    var entity, image, image_src
    ,   images_loading = 0
    ,   self = this
    ;
    this._image = {};

    for (var i=0,l=scene.entities.length; i<l; i++) {
        entity = scene.entities[i];
        image_src = entity.get('image', null);
        if (image_src !== null) {
            if (typeof this._image[image_src] === 'undefined') {
                images_loading += 1;
                this._images[image_src] = new Image();
                this._images[image_src].src = image_src;
                this._images[image_src].for_entity = entity;
                this._images[image_src].onload = function() {
                    var canvas = document.createElement('canvas')
                    ,   ctx = canvas.getContext('2d')
                    ;

                    ctx.drawImage(this, 0, 0);
                    this.for_entity.set('image', canvas);
                    this.for_entity.set('imagectx', ctx);

                    images_loading -= 1;
                    checkLoadingDone.call(this);
                };
            }
        }
    }
    checkLoadingDone.call(this);

    function checkLoadingDone() {
        if (images_loading === 0) {
            self.trigger('ready');
        }
    }
};

// render utilities
function colorStyle(color) {
    try {
        if (color.length === 3)
            return ['rgb(', parseInt(color[0]*255), ', ', parseInt(color[1]*255), ', ', parseInt(color[2]*255), ')'].join('');
        else
            return ['rgba(', parseInt(color[0]*255), ', ', parseInt(color[1]*255), ', ', parseInt(color[2]*255), ', ', color[3], ')'].join('');
    } catch (e) {
        return 'grey';
    }
}
