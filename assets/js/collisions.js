fc.collisions = (function() {
	function createGhost($o, i) {
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
                    console.log('still alive',fc.playerIndex,index);
                    stillAlive = true;
                }
            }
        });
        if (stillAlive === false) {
            console.log('game over');
            fc.playerMoving = 0;
        }
    }

    function checkLevel() {
        var nextLevel = true;
        $.each(fc.foodChain, function(index, object) {
            if (fc.foodChain[index].onBoard === true && index >= fc.playerIndex) {
                nextLevel = false;
            }
        });
        if (nextLevel === true) {
            console.log('next level');
            fc.playerMoving = 0;
            fc.levelSpeed -= 20;
            $('.sprite').css('-webkit-transition-duration', '.'+fc.levelSpeed/100+'s');
            levelUp();
            fc.animalsToStart++;
            fc.playerIndex = 2; // temporarily hard coded
            updatePlayer();
            fc.addEmojis.addAnimals();
        }
    }

    function levelUp() {
        fc.defineSprites(); // reset data
        fc.$stage.find('.animal').remove(); // remove animals
        fc.move.setVars(); // reset move vars
        setTimeout(resetPlayer, 10);
    }

    function checkCollisions() {
    	$.each(fc.foodChain, function(index, object) {
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
                    //evolve
                    fc.playerIndex++;
        			updatePlayer();
                    // create skull
                    var $obj = $('#sprite-' + index);
                    createSkull($obj, index);
                    createGhost($obj, index);
                    checkLevel();
                } else if (fc.playerIndex < index) {
                    fc.playerMoving = 0;
                    // create ghost
                    var $obj = fc.$player.clone().appendTo(fc.$stage);
                    createGhost($obj, index);
                    // devolve
                    fc.playerIndex--;
                    updatePlayer();
                    // move to starting position
                    setTimeout(resetPlayer, 10);
                    setTimeout(checkAlive, 10);
                    fc.foodChain[index].onBoard = false;
                } else {
                    //tie
                    $('#sprite-' + index).addClass('heart').html('&#x1F49A;');
                    setTimeout(checkAlive, 10);
                }
            }
    	});
    }

    return {
        check: checkCollisions
    }
})();