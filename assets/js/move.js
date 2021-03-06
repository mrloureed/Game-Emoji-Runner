fc.move = (function() {

    fc.playerX = 0;
    fc.playerY = 0;
    fc.levelSpeed = 240;
    fc.playerMoving = 1;
    var directionHeading = 'right';

    // x, y, angle (used for movement)
    var direction = {
        'up': [0, -1, 90, true],
        'right': [1, 0, 0, false],
        'down': [0, 1, -90, false],
        'left': [-1, 0, 0, true]
    };

    //initial direction is right [1,0]
    var playerDirX = 1;
    var playerDirY = 0;
    fc.playerRotation = 90;
    fc.directionRequested = 'right';
    fc.playerFlip = direction.right[3];

    function startShow() {
        fc.cookie.check(); // update high score from cookie
        if (fc.playerMoving !== 0 && fc.$player !== undefined) {
            fc.playerMoving = setTimeout(playerMove, fc.levelSpeed); 
            checkTurn(fc.directionRequested);
            fc.collisions.check();
        }
    }

    function playerMove() {
        if (fc.playerMoving !== 0) {
            startShow();
        } else {
            return;
        }

        // track current location
        // set new location
        function checkX() {
            var check = fc.playerX + playerDirX * fc.playerWidth;
            // if on a row with trees check for trees, otherwise move
            if ((check % 50 == 0 && check % 100 == 0) || (fc.playerY / 50) % 2 === 0) {
                fc.playerX = check;
            }
        }

        function checkY() {
            var check = fc.playerY + playerDirY * fc.playerWidth;
            // if on a row with trees check for trees, otherwise move
            if ((check % 50 == 0 && check % 100 == 0) || (fc.playerX / 50) % 2 === 0) {
                fc.playerY = check;
            }
        }

        if (directionHeading === 'left') {
            if (fc.playerX > -fc.playerWidth) {
                fc.$player.removeClass('no-transition');
                checkX();
            } else {
                fc.$player.addClass('no-transition');
                fc.playerX = fc.stageWidth + fc.playerWidth;
            }
        }

        if (directionHeading === 'right') {
            if (fc.playerX < fc.stageWidth + fc.playerWidth) {
                fc.$player.removeClass('no-transition');
                checkX();
            } else {
                fc.$player.addClass('no-transition');
                fc.playerX = -fc.playerWidth;
            }
        }

        if (directionHeading === 'down') {
            if (fc.playerY < fc.stageHeight + fc.playerWidth) {
                fc.$player.removeClass('no-transition');
                checkY();
            } else {
                fc.$player.addClass('no-transition');
                fc.playerY = -fc.playerWidth;
            }
        }

        if (directionHeading === 'up') {
            if (fc.playerY > -fc.playerWidth) {
                fc.$player.removeClass('no-transition');
                checkY();
            } else {
                fc.$player.addClass('no-transition');
                fc.playerY = fc.stageHeight + fc.playerWidth;
            }
        }

        // adjust if moving
        if (playerDirX != 0) {
            fc.$player.css('left', fc.playerX);
        }
        if (playerDirY != 0) {
            fc.$player.css('top', fc.playerY);
        }    
    }

    function checkTurn() {
        if (fc.directionRequested === 'left') {
            fc.playerRotation = direction.left[2];
            fc.playerFlip = direction.left[3];
            if (fc.playerY % 100 === 0) {
                directionHeading = 'left';
            }
        }

        if (fc.directionRequested === 'right') {
            fc.playerRotation = direction.right[2];
            fc.playerFlip = direction.right[3];
            if (fc.playerY % 100 === 0) {
                directionHeading = 'right';
            }
        }

        if (fc.directionRequested === 'up') {
            fc.playerRotation = direction.up[2];
            fc.playerFlip = direction.up[3];
            if ((fc.playerY - 50) % 50 === 0 && fc.playerX % 100 === 0) {
                directionHeading = 'up';
            }
        }

        if (fc.directionRequested === 'down') {
            fc.playerRotation = direction.down[2];
            fc.playerFlip = direction.down[3];
            if ((fc.playerY + 50) % 50 === 0 && fc.playerX % 100 === 0) {
                directionHeading = 'down';
            }
        }

        setDirection(directionHeading);
        rotatePlayer(fc.playerRotation, fc.playerFlip);
    }

    function rotatePlayer(deg, flip) {
        if (flip === true) {
            fc.$player.addClass('flip');
        } else {
            fc.$player.removeClass('flip');
        }

        fc.$player.find('div').css('transform', 'rotate('+deg+'deg)');
    }

    function setDirection(d) {
        $.each(direction[d], function(id, obj) {
            if (id == 0) {
                // stopped or moving left or right?
                playerDirX = obj;
            } else if (id == 1) {
                // stopped or moving up or down?
                playerDirY = obj;
            }
        });
    }

    function setVariables() {
        fc.playerMoving = 0;
        fc.playerX = 0;
        fc.playerY = 0;
    }

    function bindDom() {
        $(document).keydown(function(e) {
            //event handlers
            //left
            if (e.keyCode == 37) {
                fc.directionRequested = 'left';
            }
            //right
            if (e.keyCode == 39) {
                fc.directionRequested = 'right';
            }
            //up
            if (e.keyCode == 38) {
                fc.directionRequested = 'up';
            }
            //down
            if (e.keyCode == 40) {
                fc.directionRequested = 'down';
            }
        });
    }

    function init() {
        setVariables();
        bindDom();
    }

    // bind dom
    $(init);

    // Reveal public pointers to
    // private functions and properties
    return {
        setVars: setVariables,
        play: startShow,
        rotatePlayer: rotatePlayer
    };

})();