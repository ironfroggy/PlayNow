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

