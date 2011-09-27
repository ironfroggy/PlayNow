function Rendered(viewport) {
    this.set('viewport', viewport);
    
    var that = this;
    viewport.bind('setzoom', function() {
        that._allDirty = true;
    });

    this._images = {};
    this._allDirty = true;
    this.total_time = 0;
    this.lts = (new Date);
}
Rendered.prototype = new Behavior('position');

Rendered.prototype.renderFrame = function() {
    // Before entities
    var viewport = this._components['viewport']
    ,   scene = viewport._components['scene']
    ,   canvas = viewport._components['canvas']
    ,   ctx = viewport._components['ctx']
    ,   zoom = viewport._components['zoom']
    ,   offset_x = viewport._components['x']
    ,   offset_y = viewport._components['y']
    ,   background_color = scene._components['clearEachFrame'] || [1, 1, 1]
    ,   delta
    ;

    this.nts = (new Date);
    delta = (this.nts.getTime() - this.lts.getTime()) / 1000;
    this.total_time += delta;
    this.trigger('tick', this.t);
    this.lts = this.nts;

    if (background_color && background_color.length === 3) {
        background_color.push(scene._components['clearEachFrameTranslucent'] || 0.3);
    }

    scene.entities.sort(function(a, b) {
        return a._components.z - b._components.z;
    });

    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(offset_x, offset_y);

    if (this._allDirty && background_color) {
        ctx.fillStyle = colorStyle(background_color);
        ctx.fillRect(-100, -100, 840, 680);
    } else {
        for (var i=0,l=scene.entities.length; i<l; i++) {
            var entity = scene.entities[i];
            var d = entity._dirty;
            if (d) {
                ctx.fillRect(d[0], d[1], d[2], d[3]);
            }
        }
    }

    // Entities
    for (var i=0,l=scene.entities.length; i<l; i++) {
        var entity = scene.entities[i];
        if (!entity._dirty && !this._allDirty) {
            //continue
        }

        var
            position = entity._components['position']
        ,   color = entity._components['color']
        ,   image = entity._components['image']
        ,   clip
        ,   scale = entity._components['scale'] || 1.0
        ,   alpha = entity._components['alpha']
        ,   alpha = typeof alpha === 'undefined' ? 1.0 : alpha
        ;

        entity._dirty = false;

        if (typeof position === 'undefined') {
            continue;
        }

        ctx.save();

        ctx.translate(position[0], position[1]);
        ctx.rotate(entity._components['rotation'] || 0);
        ctx.scale(scale, scale);

        ctx.globalAlpha = alpha;

        if (image) {
            if (false) {
                clip = [
                    parseInt(this.total_time * 10 % 4) * 30,
                    0,
                    sprite_size[0],
                    sprite_size[1],
                ];
                ctx.drawImage(
                    image,
                    clip[0], clip[1], clip[2], clip[3],
                    0, 0, clip[2], clip[3]
                );
            } else {
                ctx.drawImage(
                    image,
                    0, 0
                );
            }
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
    window.requestAnimFrame(function() {
        renderer.renderFrame();
    }, canvas);
    this._allDirty = false;
};

(function() {

    Rendered.prototype.prepareScene = function(scene) {
        var entity, image, image_src
        ,   images_loading = 0
        ,   self = this
        ;
        this._image = {};

        function mark_dirty(e, newpos, oldpos) {
            if (this._dirty === false) {
                this._dirty = new R(oldpos[0], oldpos[1], this._components.mousebounds.w, this._components.mousebounds.h);
                var i, es=scene.entities, l=scene.entities.length, r=this._components['mousebounds'];
                for (i=0; i<l; i++) {
                    if (es[i] !== this && es[i]._components['mousebounds'].intersects(r)) {
                        mark_dirty.call(es[i], e, es[i]._components.position, es[i]._components.position);
                    }
                }
            }
        }

        for (var i=0,l=scene.entities.length; i<l; i++) {
            entity = scene.entities[i];

            entity.bind('setposition setrotation setalpha', mark_dirty);
            entity._dirty = entity.get('mousebounds');
            entity.set('z', i);

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
})();

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
