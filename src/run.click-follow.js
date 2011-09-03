function SeekPoint(target) {
    this.target = target;
}
SeekPoint.prototype = new Behavior('position velocity');
SeekPoint.prototype.onstart = function() {
    var self = this;
    document.body.onclick = function(e) {
        self.target = new V(e.x, e.y);
    }
};
SeekPoint.prototype.onstop = function(e) {
    document.body.onclick = null;
};
SeekPoint.prototype.ontickentity = function(e, t, entity) {
    var target = this.target;
    var position = entity.get('position');
    var velocity = new V(target[0] - position[0], target[1] - position[1]);
    entity.set('velocity', velocity);
};

function SeekDemo(R, D) {
    var seekpoint = new SeekPoint(new V(200, 200));
    this.add(seekpoint, momentum, renderer);

    dot = new Entity({
        'position': new V(50, 100)
    ,   'velocity': new V(Math.random()*R-R/2, Math.random()*R-R/2)
    ,   'weight': 0.0
    ,   'bounce': Math.random()*0.5 + 0.25
    ,   'color': [Math.random(), Math.random(), Math.random()]
    });
    this.add(dot);
}
SeekDemo.prototype = new Scene();
scene = new SeekDemo(500, 500);
