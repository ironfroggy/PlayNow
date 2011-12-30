var TicTacToe = {};
(function(){

    var COLORS = {
        'X': [1, 0, 0, 1],
        'O': [0, 1, 0, 1],
    };

    // Square
    // One of the nine squares on the board
    // When clicked, sets to X or O
    Square = now.type('Square', {
        inherit: Entity,
        defaults: {
            state: null
        },
        'onmouse.click': function() {
            if (!this.get('state')) {
                this.set('state', this.get('board').nextPlayer());
            } else {
                console.log('already', this.get('state'));
            }
        },
        'onsetstate': function(e, new_state) {
            if (COLORS[new_state]) {
                this.set('color', COLORS[new_state]);
            }
        },
        'onsetcolor': function(e, color) {
        },
    });

    // GameScene
    // Manages the board and current player, and tracks score

    GameScene.prototype = new Scene();
    function GameScene() {
        var mousemap;
        mousemap = new MouseMap();
        this.add(mousemap);

        this.set('clearEachFrame', [1, 1, 0.7, 1]);

        this.set('current-player', 'O');

        function add_square(scene, x, y) {
            console.log('setting up square at', x, y);
            var s = new Square({
                'position': new V(10 + x * 100, 10 + y * 100)
            ,   'mousebounds': new R(10 + x * 100, 10 + y * 100, 100, 100)
            ,   'color': [0.5, 0.5, 0.5, 1]
            ,   'color-box': new V(90, 90)
            ,   'board': scene
            });
            scene.add(s);
        }

        add_square(this, 0, 0);
        add_square(this, 0, 1);
        add_square(this, 0, 2);

        add_square(this, 1, 0);
        add_square(this, 1, 1);
        add_square(this, 1, 2);

        add_square(this, 2, 0);
        add_square(this, 2, 1);
        add_square(this, 2, 2);

    };
    GameScene.prototype.nextPlayer = function() {
        var n = this.get('current-player') === 'O' ? 'X' : 'O';
        this.set('current-player', n);
        return n;
    };

    // exports
    TicTacToe.GameScene = GameScene;
})();
