var TicTacToe = {};
(function(){
    function setText(id, text) {
        document.getElementById(id).innerHTML = text;
    }
    function getText(id) {
        return document.getElementById(id).innerHTML;
    }
    function incrText(id) {
        var i = parseInt(getText(id));
        setText(id, i + 1);
    }

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
            var board = this.get('board');
            if (!this.get('state') && board.get('active')) {
                this.set('state', board.nextPlayer());
            } 
        },
        'onsetstate': function(e, new_state) {
            if (COLORS[new_state]) {
                this.set('color', COLORS[new_state]);
            } else {
                this.set('color', [1, 1, 1, 1]);
            }
            this.get('board').checkForWin();
        },
        'onsetcolor': function(e, color) {
        },
    });

    // GameScene
    // Manages the board and current player, and tracks score

    GameScene = now.type('GameScene', {
        inherit: Scene,
        defaults: {
            'clearEachFrame': [0.8, 0.8, 0.8, 1],
            'current-player': 'O',
            'active': false,
        },
        init: function () {
            Scene.apply(this);
            this.add(new MouseMap());

            this.squares = [];

            function add_square(scene, x, y) {
                var s = new Square({
                    'position': new V(15 + x * 100, 15 + y * 100)
                ,   'mousebounds': new R(15 + x * 100, 15 + y * 100, 100, 100)
                ,   'color': [1, 1, 1, 1]
                ,   'color-box': new V(90, 90)
                ,   'board': scene
                });
                scene.add(s);

                scene.squares.push(s)
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

            this.set('active', true);
        },
        nextPlayer: function() {
            var n = this.get('current-player') === 'O' ? 'X' : 'O';
            this.set('current-player', n);
            return n;
        },
        'onsetcurrent-player': function(e, p) {
            setText('turn', p);
        },
        checkForWin: function() {
            var m = [/111/g, /1..1..1/g, /1...1...1/g, /..1.1.1../g]
            ,   win = null
            ,   i
            ,   scene = this
            ;
            if (this.checking) {
                return;
            } else {
                this.checking = true;
            }
            if (this.squares.length === 9) {
                var x = this._stateForPlayer('X');
                var o = this._stateForPlayer('O');

                for (i=0; i<m.length; i++) {
                    if (x.match(m[i])) {
                        win = 'X';
                        break;
                    }
                    if (o.match(m[i])) {
                        win = 'O';
                        break;
                    }
                }

                var squares = this.squares;
                if (win) {
                    scene.set('active', false);
                    window.setTimeout(function() {
                        incrText(win.toLowerCase());
                        for (i=0; i<9; i++) {
                            squares[i].set('state', '');
                        }
                        scene.checking = false;
                        scene.set('active', true);
                    }, 500);
                } else {
                    if ((x.match(/1/g)||'').length + (o.match(/1/g)||'').length === 9) {
                        scene.set('active', false);
                        window.setTimeout(function() {
                            for (i=0; i<9; i++) {
                                squares[i].set('state', '');
                            }
                            scene.checking = false;
                            scene.set('active', true);
                        }, 500);
                    }
                }
            }
            if (!win) { 
                this.checking = false;
            }
        },
        _stateForPlayer: function(p) {
            var states = [];
            for (var i=0; i<9; i++) {
                states[i] = this.squares[i].get('state') == p ? '1' : '0';
            }
            return states.join('');
        }
    });

    // exports
    TicTacToe.GameScene = GameScene;
})();
