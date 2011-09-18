function Entity(data) {
    this._components = {};
    this._propagation = {};
    
    this.update(data);
    if (typeof this.defaults === 'object') {
        this.update(this.defaults);
    }
}
Entity.prototype = new EventHandling();
Entity.prototype.constructor = Entity;
Entity.prototype.get = function(name, def) {
    return typeof this._components[name] === 'undefined' ? def : this._components[name];
};
Entity.prototype.set = function(name, data) {
    var previous_value = this._components[name];
    this._components[name] = data;
    if (this.trigger('set'+name, data, previous_value) === false) {
        this._components[name] = previous_value;
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

