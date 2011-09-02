function Behavior(in_components) {
    this.in_components = in_components.split(' ');
    this.entities = [];
}
Behavior.prototype = new EventHandling();
Behavior.prototype.addEntity= function(entity) {
    this.entities.push(entity);
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

var momentum = new Behavior('position velocity');
momentum.bind('entitytick', function(e, t, entity, update) {
    var v = entity.get('velocity');
    v[0] = Math.abs(v[0]) < 1 ? 0 : v[0];
    v[1] = Math.abs(v[1]) < 1 ? 0 : v[1];
    update({
        'position': entity.get('position').add(v.multiply(t))
    });
});

var bounds = new Behavior('position velocity');
bounds.bind('entitytick', function(e, t, entity, update) {
    var p = entity.get('position')
    ,   v = entity.get('velocity')
    ,   dx = 0
    ,   dy = 0
    ;

    if (p[1] > 480 || p[1] < 0) {
        dy = p[1] > 480 ? p[1] - 480 : 0 - p[1];
        v = new V(v[0]*0.95, -v[1]*0.5);
    }
    if (p[0] > 640 || p[0] < 0) {
        dx = p[0] > 640 ? p[0] - 640 : 0 - p[0];
        v = new V(-v[0]*0.5, v[1]*0.95);
    }

    p = new V(p[0] - dx, p[1] - dy);
    update({
        velocity: v
    ,   position: p
    });
});

var gravity = new Behavior('weight velocity');
gravity.bind('entitytick', function(e, t, entity, update) {
    update({
        'velocity': entity.get('velocity').add(new V(0, 9.8))
    });
});

