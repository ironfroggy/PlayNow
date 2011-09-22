function Scene() {
    this.entities = [];
    this.behaviors = [];
    this.running = false;
    this.ready = false;
};
Scene.prototype = new Entity();
Scene.prototype.add = function() {
    var c;
    for (var i=0; i < arguments.length; i++) {
        c = arguments[i];
        if (c instanceof Behavior) {
            this.behaviors.push(c);
            c.trigger('addedtoscene', this);
        } else if (c instanceof Entity) {
            this.entities.push(c);
            this._addEntityToBehaviors(c);
            c.trigger('addedtoscene', this);
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
    var renderer = object.get('renderer');
    renderer.prepareScene(this);
};

Scene.prototype.run = function() {
    this.lts = new Date();
    this.nts = null;
    this.t = undefined;

    this.running = true;
    this.trigger('start');
    this.step();
};
Scene.prototype.step = function step() {
    if (this.running) {
        this.nts = (new Date);
        this.t = (this.nts.getTime() - this.lts.getTime()) / 1000;
        this.trigger('tick', this.t);
        this.lts = this.nts;

        var scene = this;
        function do_step() {
            scene.step();
        }
        setTimeout(do_step, now.sceneRate);
    }
}
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
    for (var bi=0; bi < this.behaviors.length; bi++) {
    //    this.behaviors[bi].tick(t);
    }
};
