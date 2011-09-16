var Smiley = now.type('Smiley', {
    inherit: Entity,
    init: function() {
        Entity.apply(this, arguments);
        this.dragging = false;

        this.bind('mouse.drag', function(e, pos, lastpos) {
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
        });
        this.bind('mouse.up', function(e) {
            e.mouserelease(this);
        });
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
function MenuScene() {
    var i, entity, mousemap, position;

    this.set('clearEachFrame', [1, 1, 0.7, 1]);

    mousemap = new MouseMap();
    this.set('mousemap', mousemap);
    this.propagate('mouse', 'mousemap');

    for (i=0; i<10; i+=1) {
        position = new V(Math.random() * 640, Math.random() * 480)
        entity = new Smiley({
            position: position
        ,   mousebounds: new R(position.x, position.y, 100, 100)
        ,   image: "/src/smiley.png"
        });
        mousemap.addTarget(entity);
        this.add(entity);
    }
}
