var now;

(function(){
    var my_src, script_dir, scripts, i, pn_scripts;

    if (typeof now === 'undefined') {
        scripts = document.getElementsByTagName('script');
        for (i=scripts.length-1; i >= 0; i-=1) {
            if (scripts[i].getAttribute('type') === 'text/javascript') {
                my_src = scripts[i].getAttribute('src');
                break;
            }
        }
        script_dir = my_src.replace('playnow.js', '');
        pn_scripts = [
            script_dir + "playnow.inherit.js",
            script_dir + "playnow.vector.js",
            script_dir + "playnow.event.js",
            script_dir + "playnow.entity.js",
            script_dir + "playnow.behavior.js",
            script_dir + "playnow.interaction.js",
            script_dir + "playnow.renderer.js",
            script_dir + "playnow.viewport.js",
            script_dir + "playnow.scene.js",
        ];

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
        ,   load: function(scripts, complete) {
                var load_scripts = [];
                load_scripts.push.apply(load_scripts, pn_scripts);
                load_scripts.push.apply(load_scripts, scripts);

                yepnope({
                    test: true,
                    yep: load_scripts,
                    complete: function() {
                        now._set_loaded();
                        complete();
                    }
                });
            }
        ,   renderRate: 50
        ,   sceneRate: 50
        };
    }
})();
