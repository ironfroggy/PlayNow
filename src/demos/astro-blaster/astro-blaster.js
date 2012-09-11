var AB = {};
AB.Ship = now.type('Ship', {
    inherit: Entity
,   defaults: {
        state: 'active'
    ,   image: 'ships/ship_000.png'
    ,   scale: 0.25
    ,   weight: 1
    ,   velocity: new V(0, 0)
    }
,   onaddedtoscene: function(e, scene) {
        scene.set('player', this);
        scene.propagate('key', 'player');
    }
,   'onkey.down': function(e, code) {
        var r = this.get('rotation');
        var d;
        if (code === 37) {
            d = -0.05;
        } else if (code === 39) {
            d = 0.05;
        } else {
            return;
        }
        this.set('rotation', r + d);
    }
});
