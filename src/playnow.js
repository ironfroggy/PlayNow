if (typeof now === 'undefined') {
    now = {
        _loaded: false
    ,   _load_callbacks: []
    ,   onload: function(f) {
            if (now._loaded) {
                f(now);
            } else {
                now._load_callbacks.push(function(){
                    f(now);
                });
            }
        }
    ,   _set_loaded: function() {
            now._loaded = true;
            while (now._load_callbacks.length > 0) {
                now._load_callbacks.pop()(now);
            }
        }
    };

    yepnope({
        test: true,
        yep: [
            "vector.js",
            "event.js",
            "entity.js",
            "viewport.js",
            "behavior.js",
            "scene.js",
            "renderer.js",
        ],
        complete: function() {
            now._set_loaded();
        }
    });
}

