function Behavior(in_components) {
    this.in_components = (in_components || '').split(' ');
    this.entities = [];
}
Behavior.prototype = new Entity();
Behavior.prototype.addEntity= function(entity) {
    var component_names = entity.getComponentNames();
    for (var i=0; i < this.in_components.length; i++) {
        var cname = this.in_components[i];
        if (component_names.indexOf(cname) === -1) {
            return false;
        }
    }
    this.entities.push(entity);
    return true;
};
Behavior.prototype.ontickentity = function(e, t, entity) {
    var component_names = entity.getComponentNames();
    for (var i=0; i < this.in_components.length; i++) {
        var cname = this.in_components[i];
        if (component_names.indexOf(cname) === -1) {
            return null;
        }
    }

    var data = this.trigger('entitytick', t, entity, update);
    function update(data) {
        entity.update(data);
    }
}

var Momentum = now.type('Momentum', {
    inherit: Behavior,
    init: function() {
        Behavior.apply(this, ['position velocity']);
    },
    tick: function(t) {
        var i, l, r, rv, v, entity;
        for (i=0, l=this.entities.length; i<l; i+=1) {  
            entity = this.entities[i];
            v = entity.get('velocity');
            r = entity.get('rotation');
            rv = entity.get('rotation-velocity');

            v[0] = Math.abs(v[0]) < 1 ? 0 : v[0];
            v[1] = Math.abs(v[1]) < 1 ? 0 : v[1];
            entity.set('position', entity.get('position').add(v.multiply(t)))

            if (!!rv) {
                entity.set('rotation', (r+rv)%Math.PI);
            }
        }
    }
});

var Bounds = now.type('Bounds', {
    inherit: Behavior,
    init: function() {
        Behavior.apply(this, ['position velocity']);
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
                v = new V(v[0]*FRICTION, -v[1]*ENERGY_LOSS);
            }
            if (p[0] > 640 || p[0] < 0) {
                dx = p[0] > 640 ? p[0] - 640 : p[0];
                v = new V(-v[0]*ENERGY_LOSS, v[1]*FRICTION);
            }

            p = new V(p[0] - dx, p[1] - dy);
            entity.set('position', p);
            entity.set('velocity', v);
        }
    }
});

var Force; 
(function() {
    Force = now.type('Force', {
        inherit: Behavior,
        init: function(G) {
            Behavior.apply(this, ['weight velocity']);
            this.G = G || new V(0, 9.8);
        },
        tick: function(t) {
            var i, l, entity;
            for (i=0, l=this.entities.length; i<l; i+=1) {  
                entity = this.entities[i];
                entity.set('velocity', entity.get('velocity').add(this.G))
            }
        }
    });
})();
