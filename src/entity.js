function init() {
    var canvas = document.getElementById('canvas');    
}

function V(x, y) {
    this.push(x);
    this.push(y);
}
V.prototype = new Array();
V.prototype.add = function(b) {
    return new V(this[0] + b[0], this[1] + b[1]);
};
V.prototype.getLength = function() {
    var length_sqr = this[0]*this[0] + this[1]*this[1] // + this[2]*this[2]
    ,   length = Math.sqrt(length_sqr)
    ;

    return length;
};
V.prototype.normal = function() {
    var n = 1 / this.getLength();

    return new V(this[0] * n, this[1] * n, this[2] * n);
};
V.prototype.multiply = function(n) {
    return new V(this[0] * n, this[1] * n, this[2] * n);
};

function Entity(data) {
    this._components = data || {};
    this._propagation = {};
}
Entity.prototype = new EventHandling();
Entity.prototype.get = function(name, def) {
    return typeof this._components[name] === 'undefined' ? def : this._components[name];
};
Entity.prototype.set = function(name, data) {
    if (this.trigger('set', name, data) !== false && this.trigger('set'+name, data) !== false) {
        this._components[name] = data;
    }
    if (data instanceof EventHandling) {
        data.trigger('setas', this, name);
        data.trigger('setas' + name, this);
    }
};
Entity.prototype.update = function(data) {
    for (k in data) {
        this.set(k, data[k]);
    }
};
Entity.prototype.defaults = function(data) {
    for (k in data) {
        if (typeof this._components[k] === 'undefined') {
            this.set(k, data[k]);
        }
    }
};
Entity.prototype.getComponentNames = function() {
    var l = [];
    for (n in this._components) {
        l.push(n);
    }
    return l;
};
Entity.prototype.propagate = function(eventname, component, before) {
    this.bind(eventname, function() {
        var c = this.get(component);
        console.log("propagating '" + eventname +"' event to ", c);
        before = (before||function(){return arguments});
        c.trigger.apply(c, before.apply(this, arguments));
    });
};

function Behavior(in_components) {
    this.in_components = in_components.split(' ');
    this.entities = [];
}
Behavior.prototype = new Entity();
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

