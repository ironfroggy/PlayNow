var AB = {
    FIRE_RATE: 250
,   BULLETS: 250
,   BULLET_SPEED: 100
,   DISPERSAL: 15
,   RANGE: 50
,   ROCKS: 40
,   ROCK_SIZE: 50
,   ROCK_DOWN_SCALE: 1.5
,   ROCK_LEVELS: 4
,   ROCK_PIECES: 3
,   ROCK_WITH_ROCK: false
,   BOUNCE: false
};

AB.Spawner = now.type('Spawner', {
    inherit: EventHandling
,   init: function(scene, reserve, type, args) {
        this.entities = [];
        this.reserve = reserve;
        this.active = []
        for (var i=0; i < reserve; i++) {
            var o = {};
            o.i = i;
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

AB.Collide = now.type('Collide', {
    inherit: Behavior
,   init: function(collisions) {
        Behavior.apply(this, ['position velocity'], 50);
        this.collisions = collisions;
    }
,   tick: function(t) {
        for (var i=0; i < this.entities.length; i++) {
            var entity1 = this.entities[i];
            if (!entity1.active) {
                continue;
            }
            for (var j=0; j < this.entities.length; j++) {
                var entity2 = this.entities[j];
                if (!entity2.active) {
                    continue;
                }
                if (entity1 === entity2) {
                    continue;
                }
                var collisions = this.collisions[entity1.get('collide')];
                if (!!collisions) {
                    var collides = collisions[entity2.get('collide')];
                    if (collides) {
                        var p1 = entity1.get('position');
                        var p2 = entity2.get('position');

                        var x = Math.pow(p1[0] - p2[0], 2);
                        var y = Math.pow(p1[1] - p2[1], 2);
                        var z = Math.sqrt(x + y);

                        var s = Math.max(entity1.get('scale') || 1, entity2.get('scale') || 1);

                        if (z < (AB.RANGE * s)) {
                            entity2.trigger('collide.hitby', entity1);
                            entity1.trigger('collide.hitting', entity2);
                        }
                    }
                }
            }
        }
    }
});

AB.Rock = now.type('Rock', {
    inherit: Entity
,   init: function(level, pieces) {
        Entity.call(this, { });
        this.level = level;
        this.pieces = pieces;
        this.set('velocity', new V(0, 0));
        var p = new V(Math.random() * 500, Math.random() * 500);
        while (p.subtract(ship.get('position')).getLength() < 100) {
            var p = new V(Math.random() * 500, Math.random() * 500);
        }
        this.set('position', p)
        this.set('rotation-velocity', -0.05 + Math.random() * 0.10)
        this.set('color', [
            0.3 + Math.random() * 0.2,
            0.3 + Math.random() * 0.2,
            0.1 + Math.random() * 0.1,
            1
        ]);
        if (level > 1) {
            this.sub_spawner = new AB.Spawner(scene, pieces, AB.Rock, [level - 1, pieces]);
        } else {
            this.sub_spawner = null;
        }
    }
,   defaults: {
        scale: 1
    ,   'rotation-velocity': 0.1
    ,   rotation: 0
    ,   color: [0.3, 0.3, 0.1, 1]
    ,   'color-box': new V(AB.ROCK_SIZE, AB.ROCK_SIZE)
    ,   position: new V(100, 100)
    ,   velocity: new V(0, 0)
    ,   center: new V(AB.ROCK_SIZE/2, AB.ROCK_SIZE/2)
    ,   weight: 0
    ,   collide: 'ROCK'
    }
,   'oncollide.hitting': function(e, ship) {
        for (var i=0; i < AB.BULLETS; i++) {
            fire(ship, true);
        }
        ship.set('state', 'dead');
        ship.active = false;
        scene.set('clearEachFrame', [1, 0, 0, 0.1]);
        AB.ROCK_WITH_ROCK = true;
    }
,   'oncollide.hitby': function(e, thing) {
        this.active = false;
        thing.active = false;
        if (!!this.sub_spawner) {
            var scale = this.get('scale') / AB.ROCK_DOWN_SCALE;
            for (var i=0; i < this.pieces; i++ ) {
                var rock = this.sub_spawner.spawn({
                    'position': this.get('position').add(new V(Math.random()*AB.RANGE, Math.random()*AB.RANGE))
                ,   'velocity': thing.get('velocity').add(this.get('velocity')).multiply(0.4).add(new V(Math.random()*AB.DISPERSAL, Math.random()*AB.DISPERSAL))
                ,   'center': this.get('center').multiply(scale)
                ,   'scale': scale
                });
            }
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
    ,   collide: 'BULLET'
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
    ,   collide: 'SHIP'
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
        'clearEachFrame': [1, 1, 1, 0.8]
    }
,   init: function() {
        Scene.apply(this, arguments);
        this.add(new Momentum());
        this.add(new Bounds(null, {wrap: !AB.BOUNCE}));
        this.add(new AB.Collide({
            BULLET: {
                ROCK: true
            }
        ,   ROCK: {
                SHIP: true
            ,   ROCK: AB.ROCK_WITH_ROCK
            }
        }));
    }
});
