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
    var length_sqr = this[0]*this[0] + this[1]*this[1] + this[2]*this[2]
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
EventHandling.prototype.trigger = function (eventname, data) {
    if (typeof this.__event_handlers !== 'undefined' && typeof this.__event_handlers[eventname] !== 'undefined') {
        for (var i=0,l=this.__event_handlers[eventname].length; i<l; i++) {
            this.__event_handlers[eventname][i].call(this, eventname, data);
        }
    }
}


function Entity(data) {
    this._components = data || {};
}
Entity.prototype.set = function(name, data) {
    this._components[name] = data;
};
Entity.prototype.get = function(name, data) {
    return this._components[name];
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
    this.on_entitytick = [];
    this.entities = [];
}
Behavior.prototype = new EventHandling();
Behavior.prototype.addEntity= function(entity) {
    this.entities.push(entity);
};
Behavior.prototype.onEntityTick = function(f) {
    this.on_entitytick.push(f);
};
Behavior.prototype.tickentity = function(t, entity) {
    var component_names = entity.getComponentNames();
    for (var i=0; i < this.in_components.length; i++) {
        var cname = this.in_components[i];
        if (component_names.indexOf(cname) === -1) {
            return null;
        }
    }

    return this.on_entitytick[0](t, entity);
}

function Scene() {
    this.entities = [];
    this.behaviors = [];
};
Scene.prototype.add = function() {
    var c;
    for (var i=0; i < arguments.length; i++) {
        c = arguments[i];
        if (c instanceof Entity) {
            this.entities.push(c);
            this._addEntityToBehaviors(c);
        } else if (c instanceof Behavior) {
            this.behaviors.push(c);
        } else {
            throw "Cannot add unknown type to scene";
        }
    }
};
Scene.prototype._addEntityToBehaviors = function(entity) {
    var bi;
    for (bi=0; bi < this.behaviors.length; bi++) {
        this.behaviors[bi].addEntity(entity);
    }
};

Scene.prototype.run = function() {
    var self = this
    ,   lts = new Date()
    ,   nts
    ,   t
    ;

    function step() {
        nts = (new Date);
        t = (nts.getTime() - lts.getTime()) / 1000;
        self.tick(t);
        lts = nts;

        setTimeout(step, 1000/30);
    }
    step();
};

Scene.prototype.tick = function(t) {
    for (var bi=0; bi < this.behaviors.length; bi++) {
        var behavior = this.behaviors[bi];
        behavior.trigger('beforetick');
        for (var ei=0; ei < behavior.entities.length; ei++) {
            var data = behavior.tickentity(t, behavior.entities[ei]);
            if (data !== null)
                behavior.entities[ei].update(data);
        }
        behavior.trigger('aftertick');
    }
};
