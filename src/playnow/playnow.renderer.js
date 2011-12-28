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
    this.trigger('tick', delta);
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

    ctx.fillStyle = colorStyle(background_color);
    if (this._allDirty || background_color) {
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
        ,   anim = entity._components['animate']
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
            if (anim) {
                // anim[0] - frame width
                // anim[1] - frame height
                // anim[2] - frames per second

                // number of frames in animation
                var f = image.width / anim[0];
                // seconds animation lasts
                var s = f * anim[2];
                // seconds into animation cycle
                var r = this.total_time % s;
                // current frame
                var c = parseInt(r * anim[2]) % f;

                var o = c * anim[0];
                clip = [
                    parseInt(o),
                    0,
                    anim[0],
                    anim[1],
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

            // Setup dirty events
            entity.bind('setposition setrotation setalpha', mark_dirty);
            // Entties with mousebounds are dirty to start, because they can move
            entity._dirty = entity.get('mousebounds');
            // Provide a default ordering in z-layer
            entity.set('z', i);

            // Load image assets
            image_src = entity.get('image', null);
            if (image_src !== null) {
                if (typeof this._image[image_src] === 'undefined') {

                    if (!this._images[image_src]) {
                        images_loading += 1;
                        image = new Image();
                        this._images[image_src] = image;
                        image.src = image_src;
                        image.entities = [];
                        image.onload = function() {
                            var canvas
                            ,   ctx
                            ,   entities_length = this.entities.length
                            ;

                            if (typeof this.ctx === 'undefined') {
                                canvas = document.createElement('canvas');
                                ctx = canvas.getContext('2d');

                                canvas.setAttribute('width', this.width);
                                canvas.setAttribute('height', this.height);

                                ctx.drawImage(this, 0, 0);

                                this.ctx = ctx;
                                this.canvas = canvas;
                            }

                            for (i=0; i < entities_length; i++) {
                                this.entities[i].set('image', this.canvas);
                                this.entities[i].set('imagectx', this.ctx);

                                this.entities[i].trigger('image-ready');
                            }
                            images_loading -= 1;
                            checkLoadingDone.call(this);
                        }
                    } else {
                        image = this._images[image_src];
                    }
                    image.entities.push(entity);

                    // Entity prep using the image data

                    entity.bindonce('image-ready', function(e, renderer, entity) {
                        this.for_entity = entity;
                    }, [this, entity]);

                }
            }
        }
        // Check if all the assets were already loaded before we got here

        // Local callbacks //

        function post_image_prep(renderer, entity) {
            p = privates(renderer, entity);
            anim = entity.get('animate');
            p.anim_frame_count = image.width / anim[0];
            p.anim_cycle_seconds = image.width / anim[0] * anim[2]
        }

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
