var now;

(function(){
    var my_src, script_dir, scripts, i;

    if (typeof now === 'undefined') {
        scripts = document.getElementsByTagName('script');
        for (i=scripts.length-1; i >= 0; i-=1) {
            if (scripts[i].getAttribute('type') === 'text/javascript') {
                my_src = scripts[i].getAttribute('src');
                break;
            }
        }
        script_dir = my_src.replace('playnow.js', '');

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
                now.onload(function(){
                    yepnope({
                        test: true
                    ,   yep: scripts
                    ,   complete: complete
                    });
                });
            }
        };

        yepnope({
            test: true,
            yep: [
                script_dir + "playnow.inherit.js",
                script_dir + "playnow.vector.js",
                script_dir + "playnow.event.js",
                script_dir + "playnow.entity.js",
                script_dir + "playnow.interaction.js",
                script_dir + "playnow.renderer.js",
                script_dir + "playnow.viewport.js",
                script_dir + "playnow.behavior.js",
                script_dir + "playnow.scene.js",
            ],
            complete: function() {
                now._set_loaded();
            }
        });
    }
})();
