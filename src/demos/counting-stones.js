var Smiley = now.type('Smiley', {
    inherit: Entity,
    defaults: {
        dragging: false
    ,   image: "/src/smiley.png"
    },
    'onmouse.drag': function(e, pos, lastpos) {
        var curpos = this.get('position')
        ,   offset = pos.subtract(lastpos)
        ,   relpos = pos.subtract(curpos)
        ;
        
        this.dragging = true;

        if (!e.mouselocked &&
            this.get('imagectx').getImageData(pos.x-curpos.x, pos.y-curpos.y, 1, 1).data[3] === 0) {

            e.mousemissed = true;
            e.mouserelease(this);
        } else {
            this.set('position', curpos.add(offset));
            if (!e.mouselocked) {
                e.mouselock(this);
            }
        }
    },
    'onmouse.up': function(e) {
        e.mouserelease(this);
    },
    'onmouse.lock.acquire': function(e) {
        this.set('alpha', 0.65);
    },
    'onmouse.lock.release': function(e) {
        this.set('alpha', 1.00);
        if (this.dragging) {
            arguments[0] = 'mouse.drop';
            this.trigger.apply(this, arguments);
        }
    },
    'onmouse.drop': function(e) {
    }
});

MenuScene.prototype = new Scene();
function MenuScene(n) {
    var i, entity, mousemap, position;

    this.set('clearEachFrame', [1, 1, 0.7, 1]);

    mousemap = new MouseMap();
    this.add(mousemap);

    for (i=0; i<n; i+=1) {
        position = new V(Math.random() * 640, Math.random() * 480)
        entity = new Smiley({
            position: position
        ,   mousebounds: new R(position.x, position.y, 100, 100)
        });
        this.add(entity);
    }
}
