var MouseMap = now.type('MouseMap', {
    inherit: Entity,
    init: function() {
        this.__mousemap_targets = [];
        this.__mousemap_lock = null;
    },
    addTarget: function(target) {
        this.__mousemap_targets.push(target);
        target.bind('setposition', function(e, pos) {
            var bounds = target.get('mousebounds');
            target.set('mousebounds', new R(pos.x, pos.y, bounds.w, bounds.h));
        });
    },
    onmouse: function(e, event_pos) {
        var self = this
        ,   i = 0
        ,   l = this.__mousemap_targets.length
        ,   targets = this.__mousemap_targets
        ,   entity
        ,   entity_pos
        ,   args = arguments;
        ;

        function mouselock(entity) {
            entity.trigger('mouse.lock.acquire');
            self.__mousemap_lock = entity;
        }
        function mouserelease(entity) {
            if (!!entity && entity === self.__mousemap_lock) {
                entity.trigger('mouse.lock.release');
                self.__mousemap_lock = null;
            }
        }

        e.mouselock = mouselock;
        e.mouserelease = mouserelease;

        // If mouse events are locked to one entity, use it.

        if (this.__mousemap_lock !== null) {
            entity = this.__mousemap_lock;
            e.mouselocked = true;
            if (try_target.call(this, entity)) {
                delete e.mouselocked;
                return;
            }
            delete e.mouselocked;
        }

        // Look for matching entities until one matches the coords

        for (i=0;i < l; i+=1) {
            entity = targets[i];
            if (try_target.call(this, entity)) {
                break;
            }
        }
        if (i === l) {
            //e.mouserelease(this.__mousemap_lock);
        }

        // Cleanup event methods
        delete e.mouselock;
        delete e.mouserelease;

        function try_target(entity) {
            var e
            ,   entity_pos = entity.get('mousebounds')
            ,   intersects = entity_pos.intersects(event_pos)
            ,   is_locked = entity === this.__mousemap_lock
            ;
            if (intersects || is_locked) {
                e = entity.trigger.apply(entity, args);
                if (!e.mousemissed) {
                    return true;
                }
            }
            return false;
        }
    }
});
