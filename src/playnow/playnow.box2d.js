var Box2D = now.type('Box2D', {
    inherit: Behavior
,   init: function() {
        Behavior.apply(this, ['position velocity'], 50);
    }
,   addEntity: function(entity) {
        var added = Behavior.prototype.addEntity.apply(this, arguments);
        // do something which each entity added
        return added;
    }
,   tick: function(t) {
        // tick the clock for t seconds
    }
});
