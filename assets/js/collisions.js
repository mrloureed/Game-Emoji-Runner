fc.collisions = (function() {
    function createGhost($o) {
        // ascend ghost
        var sCoords = $o.offset();
        var sx = sCoords.top - 100;
        $o.addClass('sprite ghost').css('top', sx + 'px');
    }

    function createSkull($o, i) {
        // make skull
        $o.clone().attr('id', 'heaven-' + i).appendTo(fc.$stage);
        $('#heaven-' + i).html('&#x1F480;').addClass('skull');
    }

    function updatePlayer() {
        fc.$player.html('<div>'+fc.foodChain[fc.playerIndex].code+'</div>');
        fc.move.rotatePlayer(fc.playerRotation, fc.playerFlip);
    }

    function resetPlayer() {
        fc.$player.addClass('no-transition');
        fc.playerX = -100;
        fc.playerY = 0;
        fc.$player.css('top',0).css('left',-100);
        fc.directionRequested = 'right';
        fc.playerMoving = 1;
    }

    function checkAlive() {
        var stillAlive = false;
        $.each(fc.foodChain, function(index, object) {
            if(!$('#sprite-' + index).hasClass('ghost') && !$('#sprite-' + index).hasClass('heart')) {
                if (fc.foodChain[index].onBoard === true && fc.playerIndex > index) {
                    stillAlive = true;
                }
            }
        });
        if (stillAlive === false) {
            fc.playerMoving = 0;
            swarm();
            setTimeout(function() {
                createGhost(fc.$player);
            }, fc.levelSpeed);
            setTimeout(function() {
                $('[data-animal').hide();
                $('[data-text-alert]').css('opacity',1).html('<span class="emoji">&#x1F480;</span>GAME OVER');
                fc.$tree.removeClass('grow'); // hide trees
                fc.animalsToStart = 5;
                fc.cookie.check(); // update high score from cookie
            }, 2000);
            setTimeout(function() {
                $('.messaging').css('opacity',0);
                fc.addEmojis.resetGame();
            }, 4000);
        } else {
            fc.playerMoving = 1;
        }
    }

    function swarm() {
        $.each(fc.foodChain, function(index, object) {
            if (fc.foodChain[index].onBoard === true) {
                $('[data-animal='+index+']').css('left', fc.playerX).css('top', fc.playerY);
            }
        });
    }

    function displayMessage(message) {
        $('[data-text-alert]').css('opacity',1).html(message);
        setTimeout(function() {
             $('[data-text-alert]').css('opacity',0);
        }, 2000);
    }

    function checkLevel() {
        var nextLevel = true;
        $.each(fc.foodChain, function(index, object) {
            if (fc.foodChain[index].onBoard === true) {
                nextLevel = false;
            }
        });
        console.log(fc.playerIndex);
        if (fc.playerIndex === 20) {
            nextLevel = true;
        }
        if (nextLevel === true) {
            displayMessage('<span class="emoji">&nbsp;</span>LEVEL '+(fc.level+1));
            fc.playerMoving = 0;
            fc.levelSpeed -= 10;
            $('.sprite').css('-webkit-transition-duration', '.'+fc.levelSpeed/100+'s');
            levelUp();
            fc.animalsToStart++;
            if (fc.level+2 > fc.foodChain.length/2) {
                var high = fc.foodChain.length/2;
            } else {
                var high = fc.level+2
            }
            if (fc.level < 6) {
                fc.playerIndex = Math.floor(fc.addEmojis.getRandomIndex(2, fc.level+1));
            } else {
                // don't make it any easier going forward
                fc.playerIndex = Math.floor(fc.addEmojis.getRandomIndex(2, 6));
            }
            updatePlayer();
            fc.addEmojis.addAnimals();
        }
    }

    function levelUp() {
        fc.level++;
        fc.scoreboard.update(fc.$level, fc.level);
        fc.defineSprites(); // reset data
        fc.$stage.find('.animal').remove(); // remove animals
        fc.move.setVars(); // reset move vars
        setTimeout(resetPlayer, 10);
    }

    function checkCollisions() {
        $.each(fc.foodChain, function(index, object) {

            var hasGhost = false;

            // Check ghost status
            if ($('#sprite-' + index).hasClass('ghost') || $('#sprite-' + index).hasClass('heart')) {
                hasGhost = true;
            } else {
                hasGhost = false;
            }

            // check for collision between player and emojis
            // if first coordinate is 0 emoji is out of play
            if (this.coords[0] !== 0 && this.coords[0] === fc.playerX && this.coords[1] === fc.playerY && hasGhost === false) {
                // is collision a win ?
                if (fc.playerIndex > index) {
                    fc.foodChain[index].onBoard = false;
                    //evolve
                    fc.playerIndex++;
                    updatePlayer();
                    fc.score += 100*fc.level;
                    fc.scoreboard.update(fc.$score, fc.score);
                    // create skull
                    var $obj = $('#sprite-' + index);
                    createSkull($obj, index);
                    createGhost($obj);
                    checkLevel();
                } else if (fc.playerIndex < index) {
                    displayMessage('<span class="emoji">'+fc.foodChain[fc.playerIndex].code+'</span>OUCH!');
                    fc.playerMoving = 0;
                    // create ghost
                    var $obj = fc.$player.clone().appendTo(fc.$stage);
                    createGhost($obj);
                    // devolve
                    fc.playerIndex--;
                    updatePlayer();
                    // move to starting position
                    // setTimeout(resetPlayer, 10);
                    setTimeout(checkAlive, 10);
                } else {
                    fc.foodChain[index].onBoard = false;
                    //tie
                    displayMessage('<span class="emoji">&#x1F49A;</span>BONUS!');
                    fc.score += 200*fc.level;
                    fc.scoreboard.update(fc.$score, fc.score);
                    $('#sprite-' + index).addClass('heart').html('&#x1F49A;');
                    checkLevel();  
                }
            }
        });
    }

    return {
        check: checkCollisions
    }
})();