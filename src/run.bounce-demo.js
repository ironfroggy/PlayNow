function BouncingBallScene(R, D) {
    var dot;

    this.add(momentum, gravity, bounds);
    for (var i=0; i<D; i++) {
        dot = new Entity({
            'position': new V(50, 100)
        ,   'velocity': new V(Math.random()*R-R/2, Math.random()*R-R/2)
        ,   'weight': 0.0
        ,   'bounce': Math.random()*0.5 + 0.25
        ,   'color': [Math.random(), Math.random(), Math.random()]
        });
        this.add(dot);
    }

    this.set('clearEachFrame', true);
}
BouncingBallScene.prototype = new Scene();

scene = new BouncingBallScene(501, 500);
