var AB = {};

AB.Spawner = now.type('Spawner', {
    inherit: EventHandling
,   init: function(scene, reserve, type, args) {
        this.entities = [];
        this.reserve = reserve;
        this.active = []
        for (var i=0; i < reserve; i++) {
            var o = {};
            o.__proto__ = type.prototype;
            type.apply(o, args);
            o.active = false;
            this.entities.push(o);
            scene.add(o);
        }
    }
,   spawn: function spawn(properties, recycle) {
        var entity;
        for (var i=0; i < this.reserve; i++) {
            entity = this.entities[i];
            if (!entity.active) {
                break;
            }
        }
        if (entity.active && recycle) {
            entity = this.active.shift();
        }
        if (!!entity) {
            for (name in properties) {
                entity.set(name, properties[name]);
            }
            entity.active = true;
            if (recycle) {
                this.active.push(entity);
            }
            return entity;
        }
    }
});

AB.Bullet = now.type('Bullet', {
    inherit: Entity
,   defaults: {
        position: new V(0, 0)
    ,   velocity: new V(0, 0)
    ,   color: [0, 0, 0, 1]
    ,   'color-box': new V(5, 5)
    ,   weight: 0
    ,   active: false
    }
});

AB.Ship = now.type('Ship', {
    inherit: Entity
,   defaults: {
        state: 'active'
    ,   image: 'ships/ship_000.png'
    ,   scale: 0.125
    ,   weight: 1
    ,   velocity: new V(0, 0)
    ,   center: new V(128, 128)
    ,   firing: false
    }
,   onaddedtoscene: function(e, scene) {
        scene.set('player', this);
        scene.propagate('key', 'player');
    }
,   'onkey.down': function(e, code) {
        var r = this.get('rotation');
        if (code === 37) {
            this.set('rotation-velocity', -0.1);
        } else if (code === 39) {
            this.set('rotation-velocity', 0.1);
        } else if (code === 38) {
            this.get('velocity').iadd(new V(0, 4).rotate(r));
        } else if (code === 32) {
            this.set('firing', true);
        } else {
            console.log('down', code);
            return;
        }
    }
,   'onkey.up': function(e, code) {
        var r = this.get('rotation');
        if (code === 37) {
            this.set('rotation-velocity', 0);
        } else if (code === 39) {
            this.set('rotation-velocity', 0);
        } else if (code === 32) {
            this.set('firing', false);
        }
    }
});

AB.AstroBlasterGame = now.type('AstroBlasterGame', {
    inherit: Scene
,   defaults: {
        'clearEachFrame': [1, 1, 1, 0.01]
    }
,   init: function() {
        this.add(new Momentum());
        this.add(new Bounds(null, {wrap: true}));
    }
});
