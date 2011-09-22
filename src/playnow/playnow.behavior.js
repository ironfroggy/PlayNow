function Behavior(in_components, rate) {
    this.in_components = (in_components || '').split(' ');
    this.entities = [];
    this.rate = (typeof rate === 'undefined') ? 100 : rate;
}
Behavior.prototype = new Entity();
Behavior.prototype.addEntity= function(entity) {
    var i;
    var behavior = this;
    var component_names = entity.getComponentNames();
    for (var i=0; i < this.in_components.length; i++) {
        var cname = this.in_components[i];
        if (component_names.indexOf(cname) === -1) {
            return false;
        }
    }
    this.entities.push(entity);
    if (typeof this.watchevents !== 'undefined') {
        for (i=0; i < this.watchevents.length; i++) {
            entity.bind(this.watchevents[i], function(e) {
                var original = e.name;
                Array.prototype.splice.call(arguments, 1, 0, entity);
                e.name = 'entity.' + e.name;
                behavior.trigger.apply(behavior, arguments);
                e.name = original;
            });
        }
    }
    return true;
};
Behavior.prototype.tick = function() {

};
Behavior.prototype.onstart = function(e) {
    if (this.rate !== null) {
        this.run();
    }
};
Behavior.prototype.run = function() {
    this.lts = new Date();
    this.nts = null;
    this.t = undefined;

    this.running = true;
    this.step();
};
Behavior.prototype.step = function step() {
    if (this.running) {
        this.nts = (new Date);
        this.t = (this.nts.getTime() - this.lts.getTime()) / 1000;
        this.tick(this.t);
        this.lts = this.nts;

        var behavior = this;
        function do_step() {
            behavior.step();
        }
        setTimeout(do_step, this.rate);
    }
}

var Momentum = now.type('Momentum', {
    inherit: Behavior,
    init: function() {
        Behavior.apply(this, ['position velocity'], 50);
    },
    tick: function(t) {
        var i, l, p, r, rv, v, entity;
        for (i=0, l=this.entities.length; i<l; i+=1) {  
            entity = this.entities[i];
            v = entity.get('velocity');
            r = entity.get('rotation');
            rv = entity.get('rotation-velocity');

            v[0] = Math.abs(v[0]) < 1 ? 0 : v[0];
            v[1] = Math.abs(v[1]) < 1 ? 0 : v[1];
            entity._components['position'] = p = entity.get('position').add(v.multiply(t))

            if (!!rv) {
                entity._components['rotation'] = (r+rv)%Math.PI;
            }    
        }
    }
});

var Bounds = now.type('Bounds', {
    inherit: Behavior,
    init: function() {
        Behavior.apply(this, ['position velocity'], 200);
    },
    tick: function(t) {
        var i, l, r, rv, v, entity
        ,   ENERGY_LOSS = 0.75
        ,   FRICTION = 0.95
        ;
        for (i=0, l=this.entities.length; i<l; i+=1) {  
            entity = this.entities[i];
            var p = entity.get('position')
            ,   v = entity.get('velocity')
            ,   e = entity.get('bounce', ENERGY_LOSS)
            ,   f = entity.get('friction', FRICTION)
            ,   dx = 0
            ,   dy = 0
            ;

            if (p[1] > 480 || p[1] < 0) {
                dy = p[1] > 480 ? p[1] - 480 : p[1];
                v[0]=v.x = v[0]*FRICTION;
                v[1]=v.y = -v[1]*ENERGY_LOSS;
            }
            if (p[0] > 640 || p[0] < 0) {
                dx = p[0] > 640 ? p[0] - 640 : p[0];
                v[0]=v.x = -v[0]*ENERGY_LOSS;
                v[1]=v.y = v[1]*FRICTION;
            }

            p[0]=p.x = p[0] - dx;
            p[1]=p.y = p[1] - dy;
        }
    }
});

var Force; 
(function() {
    Force = now.type('Force', {
        inherit: Behavior,
        init: function(G) {
            Behavior.apply(this, ['weight velocity'], 200);
            this.G = G || new V(0, 9.8);
        },
        tick: function(t) {
            var i, l, entity;
            for (i=0, l=this.entities.length; i<l; i+=1) {  
                entity = this.entities[i];
                entity._components['velocity'] = entity._components['velocity'].add(this.G);
            }
        }
    });
})();
