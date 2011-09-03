function SeekPoint(target) {
    this.target = target;
}
SeekPoint.prototype = new Behavior('position velocity');
SeekPoint.prototype.onstart = function() {
    var self = this;
    document.body.onclick = function(e) {
        self.target = new V(e.clientX, e.clientY);
    }
};
SeekPoint.prototype.onstop = function(e) {
    document.body.onclick = null;
};
SeekPoint.prototype.ontickentity = function(e, t, entity) {
    var target = this.target;
    if (typeof target !== 'undefined') {
        var position = entity.get('position');
        var velocity = entity.get('velocity');
        var new_velocity = new V(
            (velocity[0] + (target[0] - position[0])) * 0.99,
            (velocity[1] + (target[1] - position[1])) * 0.99
        );

        entity.set('velocity', new_velocity);
    }
};

function SeekDemo(R, D) {
    var seekpoint = new SeekPoint();
    this.add(seekpoint, momentum, renderer);

    for (var i=0; i<100; i++) {
        dot = new Entity({
            'position': new V(50, 100)
        ,   'velocity': new V(Math.random()*R-R/2, Math.random()*R-R/2)
        ,   'weight': 0.0
        ,   'bounce': Math.random()*0.5 + 0.25
        ,   'color': [Math.random(), Math.random(), Math.random()]
        });
        this.add(dot);
    }
}
SeekDemo.prototype = new Scene();
scene = new SeekDemo(500, 500);
