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

function EventHandling() {
}
EventHandling.prototype.bind = function(eventname, callback) {
    if (typeof this.__event_handlers === 'undefined') {
        this.__event_handlers = {};
    }
    if (typeof this.__event_handlers[eventname] === 'undefined') {
        this.__event_handlers[eventname] = [];
    }
    this.__event_handlers[eventname].push(callback);
}
EventHandling.prototype.trigger = function (eventname) {
    var args = Array.prototype.slice.call(arguments, 1, arguments.length);
    args.unshift(eventname);
    if (typeof this.__event_handlers !== 'undefined' && typeof this.__event_handlers[eventname] !== 'undefined') {
        for (var i=0,l=this.__event_handlers[eventname].length; i<l; i++) {
            this.__event_handlers[eventname][i].apply(this, args);
        }
    }
    var default_handler = this['on'+eventname];
    if (typeof default_handler === 'function') {
        default_handler.apply(this, args);
    }
}


function Entity(data) {
    this._components = data || {};
}
Entity.prototype = new EventHandling();
Entity.prototype.set = function(name, data) {
    this._components[name] = data;
};
Entity.prototype.get = function(name, data, def) {
    return typeof this._components[name] === 'undefined' ? def : this._components[name];
};
Entity.prototype.update = function(data) {
    for (k in data) {
        this._components[k] = data[k];
    }
};
Entity.prototype.getComponentNames = function() {
    var l = [];
    for (n in this._components) {
        l.push(n);
    }
    return l;
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

