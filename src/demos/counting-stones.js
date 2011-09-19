var Draggable = now.type('Draggable', {
    inherit: Behavior
,   watchevents: ['mouse']
,   init: function() {
        Behavior.apply(this, ['mousebounds']);
    }
,   'onentity.mouse.drag': function(e, entity, pos, lastpos) {
    }
,   'onentity.mouse.up': function(e, entity) {
        e.mouserelease(entity);
    }
,   'onentity.mouse.lock.acquire': function(e, entity) {
        entity.set('alpha', 0.65);
        for (var i=0; i<this.entities.length; i++) {
            this.entities[i].set('z', this.entities[i].get('z') - 1);
        }
        entity.set('z', this.entities.length);
    }
,   'onentity.mouse.lock.release': function(e, entity) {
        entity.set('alpha', 1.00);
        if (entity.dragging) {
            arguments[0] = 'mouse.drop';
            entity.trigger.apply(entity, arguments);
        }
    }
,   'onentity.mouse.drop': function(e, entity) {
    }
,   'onentity.mouse.drag': function(e, entity, pos, lastpos) {
        var curpos = entity.get('position')
        ,   offset = pos.subtract(lastpos)
        ,   relpos = pos.subtract(curpos)
        ;
        
        entity.dragging = true;

        if (!e.mouselocked &&
            entity.get('imagectx').getImageData(pos.x-curpos.x, pos.y-curpos.y, 1, 1).data[3] === 0) {

            e.mousemissed = true;
            e.mouserelease(entity);
        } else {
            entity.set('position', curpos.add(offset));
            if (!e.mouselocked) {
                e.mouselock(entity);
            }
        }
    }
})

var Smiley = now.type('Smiley', {
    inherit: Entity,
    defaults: {
        dragging: false
    ,   image: "/src/smiley.png"
    },
    'onmouse.wheel': function(e, pos, delta) {
        console.error(delta);
    }
});

MenuScene.prototype = new Scene();
function MenuScene(n) {
    var i, entity, mousemap, position;

    this.set('clearEachFrame', [1, 1, 0.7, 1]);

    mousemap = new MouseMap();
    this.add(mousemap);
    this.add(new Draggable());

    for (i=0; i<n; i+=1) {
        position = new V(Math.random() * 640, Math.random() * 480)
        entity = new Smiley({
            position: position
        ,   mousebounds: new R(position.x, position.y, 100, 100)
        });
        this.add(entity);
    }
}
