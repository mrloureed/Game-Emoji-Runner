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

    function checkCollisions() {
    	$.each(fc.foodChain, function(index, object) {
            // Check ghost status
            if ($('#sprite-' + index).hasClass('ghost')) {
                hasGhost = true;
            } else {
                hasGhost = false;
            }

            // check for collision between player and emojis
            // if first coordinate is 0 emoji is out of play
            if (this.coords[0] !== 0 && this.coords[0] === fc.playerX && this.coords[1] === fc.playerY) {
            	// is collision a win ?
                if (fc.playerIndex > index && hasGhost === false) {
                    //evolve
                    fc.playerIndex++;
        			updatePlayer();
                    // create skull
                    var $obj = $('#sprite-' + index);
                    createSkull($obj, index);
                    createGhost($obj, index);
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
                } else {
                    //tie
                    $('#sprite-' + index).attr('id', 'heart-' + index).appendTo(fc.$stage);
                    $('#heart-' + index).addClass('heart').html('&#x1F49A;');
                }
            }
    	});
    }

    return {
        check: checkCollisions
    }
})();