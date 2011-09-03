function Scene() {
    this.entities = [];
    this.behaviors = [];
    this.running = false;
};
Scene.prototype = new Entity();
Scene.prototype.add = function() {
    var c;
    for (var i=0; i < arguments.length; i++) {
        c = arguments[i];
        if (c instanceof Behavior) {
            this.behaviors.push(c);
        } else if (c instanceof Entity) {
            this.entities.push(c);
            this._addEntityToBehaviors(c);
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
Scene.prototype.onsetasscene = function(e, object) {
    this.set('viewport', object);
};

Scene.prototype.run = function() {
    var self = this
    ,   lts = new Date()
    ,   nts
    ,   t
    ;

    function step() {
        if (self.running) {
            nts = (new Date);
            t = (nts.getTime() - lts.getTime()) / 1000;
            self.trigger('tick', t);
            lts = nts;

            setTimeout(step, 1000/60);
        }
    }

    this.running = true;
    this.trigger('start');
    step();
};
Scene.prototype.stop = function() {
    this.running = false;
    this.trigger('stop');
};

Scene.prototype.onstart = function(e) {
    for (var bi=0; bi < this.behaviors.length; bi++) {
        this.behaviors[bi].trigger('start');
    }
};
Scene.prototype.onstop = function(e) {
    for (var bi=0; bi < this.behaviors.length; bi++) {
        this.behaviors[bi].trigger('stop');
    }
};
Scene.prototype.ontick = function(e, t) {
    this.trigger('beforetick');
    for (var bi=0; bi < this.behaviors.length; bi++) {
        var behavior = this.behaviors[bi];
        behavior.trigger('beforetick');
        for (var ei=0; ei < behavior.entities.length; ei++) {
            behavior.trigger('tickentity', t, behavior.entities[ei]);
        }
        behavior.trigger('aftertick');
    }

    for (var ei=0; ei < this.entities.length; ei++) {
        var entity = this.entities[ei];
        this.trigger('tickentity', t, entity);
        entity.trigger('tick', t);
    }
    this.trigger('aftertick');
};
