fc.move = (function() {

    var playerX = 0;
    var playerY = 0;
    var levelSpeed = 300;
    var playerMoving = 1;
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
    var playerRotation = 90;
    var directionRequested = 'right';
    var playerFlip;

    function startShow() {
        if (playerMoving !== 0) {
            playerMoving = setTimeout(playerMove, levelSpeed); 
            checkTurn(directionRequested);
        }
    }

    function playerMove() {
        if (playerMoving !== 0) {
            startShow();
        } else {
            return;
        }

        // track current location
        // set new location
        function checkX() {
            var check = playerX + playerDirX * fc.playerWidth;
            // if on a row with trees check for trees, otherwise move
            if ((check % 50 == 0 && check % 100 == 0) || (playerY / 50) % 2 === 0) {
                playerX = check;
            }
        }

        function checkY() {
            var check = playerY + playerDirY * fc.playerWidth;
            // if on a row with trees check for trees, otherwise move
            if ((check % 50 == 0 && check % 100 == 0) || (playerX / 50) % 2 === 0) {
                playerY = check;
            }
        }

        if (directionHeading === 'left') {
            if (playerX > -fc.playerWidth) {
                fc.$player.removeClass('no-transition');
                checkX();
            } else {
                fc.$player.addClass('no-transition');
                playerX = fc.stageWidth + fc.playerWidth;
            }
        }

        if (directionHeading === 'right') {
            if (playerX < fc.stageWidth + fc.playerWidth) {
                fc.$player.removeClass('no-transition');
                checkX();
            } else {
                fc.$player.addClass('no-transition');
                playerX = -fc.playerWidth;
            }
        }

        if (directionHeading === 'down') {
            if (playerY < fc.stageHeight + fc.playerWidth) {
                fc.$player.removeClass('no-transition');
                checkY();
            } else {
                fc.$player.addClass('no-transition');
                playerY = -fc.playerWidth;
            }
        }

        if (directionHeading === 'up') {
            if (playerY > -fc.playerWidth) {
                fc.$player.removeClass('no-transition');
                checkY();
            } else {
                fc.$player.addClass('no-transition');
                playerY = fc.stageHeight + fc.playerWidth;
            }
        }

        // adjust if moving
        if (playerDirX != 0) {
            fc.$player.css('left', playerX);
        }
        if (playerDirY != 0) {
            fc.$player.css('top', playerY);
        }    
    }

    function checkTurn() {
        if (directionRequested === 'left') {
            playerRotation = direction.left[2];
            playerFlip = direction.left[3];
            if (playerY % 100 === 0) {
                directionHeading = 'left';
            }
        }

        if (directionRequested === 'right') {
            playerRotation = direction.right[2];
            playerFlip = direction.right[3];
            if (playerY % 100 === 0) {
                directionHeading = 'right';
            }
        }

        if (directionRequested === 'up') {
            playerRotation = direction.up[2];
            playerFlip = direction.up[3];
            if ((playerY - 50) % 50 === 0 && playerX % 100 === 0) {
                directionHeading = 'up';
            }
        }

        if (directionRequested === 'down') {
            playerRotation = direction.down[2];
            playerFlip = direction.down[3];
            if ((playerY + 50) % 50 === 0 && playerX % 100 === 0) {
                directionHeading = 'down';
            }
        }

        setDirection(directionHeading);
        rotateHero(playerRotation, playerFlip);
    }

    function rotateHero(deg, flip) {
        if (flip === true) {
            fc.$player.addClass('flip');
        } else {
            fc.$player.removeClass('flip');
        }

        fc.$player.find('div').css('transform','rotate('+deg+'deg)');
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

    function bindDom() {
        $(document).keydown(function(e) {
            //event handlers
            //left
            if (e.keyCode == 37) {
                directionRequested = 'left';
            }
            //right
            if (e.keyCode == 39) {
                directionRequested = 'right';
            }
            //up
            if (e.keyCode == 38) {
                directionRequested = 'up';
            }
            //down
            if (e.keyCode == 40) {
                directionRequested = 'down';
            }
        });
    }

    // bind dom
    $(bindDom);

    // Reveal public pointers to
    // private functions and properties
    return {
        play: startShow
    };

})();