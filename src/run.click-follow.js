function SeekPoint(target) {
    this.target = target;
}
SeekPoint.prototype = new Behavior('position velocity');
SeekPoint.prototype.ontickentity = function(e, t, entity) {
    var target = this.target;
    if (typeof target !== 'undefined') {
        var position = entity.get('position');
        var velocity = entity.get('velocity');
        var new_velocity = new V(
            (velocity[0] + (target[0] - position[0])) * 0.95,
            (velocity[1] + (target[1] - position[1])) * 0.95
        );

        entity.set('velocity', new_velocity);
    }
};

function SeekDemo(R, D) {
    this.seekpoint = new SeekPoint();
    this.add(this.seekpoint, momentum);

    for (var i=0; i<500; i++) {
        dot = new Entity({
            'position': new V(50, 100)
        ,   'velocity': new V(Math.random()*R-R/2, Math.random()*R-R/2)
        ,   'weight': 0.0
        ,   'bounce': Math.random()*0.5 + 0.25
        ,   'color': [Math.random(), Math.random(), Math.random(), Math.random()]
        });
        this.add(dot);
    }
}
SeekDemo.prototype = new Scene();
SeekDemo.prototype['onmouse.click'] = function(e, coord) {
    this.seekpoint.target = coord;
}

scene = new SeekDemo(500, 500);
