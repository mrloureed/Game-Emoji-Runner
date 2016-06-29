fc.collisions = (function() {
	function createSkull(i, sx) {
        $('#sprite-' + i).clone().attr('id', 'heaven-' + i).appendTo(fc.$stage);
        $('#heaven-' + i).html('&#x1F480;').addClass('skull');
        // ascend ghost
        $('#sprite-' + i).addClass('sprite ghost').css('top', sx + 'px');
    }

    function checkCollisions() {
    	$.each(fc.foodChain, function(index, object) {
            var skulls = 0;
            // Check ghost status
            if ($('#sprite-' + index).hasClass('ghost')) {
                hasGhost = true;
            } else {
                hasGhost = false;
            }

            // check for collision between player and emojis
            // if first coordinate is 0 emoji is out of play
            if (this.coords[0] !== 0 && this.coords[0] === fc.playerX && this.coords[1] === fc.playerY) {
            	console.log(fc.playerIndex,index);
            	// is collision a win ?
                if (fc.playerIndex > index && hasGhost === false) {
                	console.log('win');
                    //evolve
                    fc.playerIndex++;
        			fc.$player.html('<div>'+fc.foodChain[fc.playerIndex].code+'</div>');

                    //iterate evolutions
                    skulls++;
                    var sCoords = $('#sprite-' + index).offset();
                    var sCoordsX = sCoords.top - 100;
                    // create skull
                    createSkull(index, sCoordsX);
                    // are we done with the level?
                    /*if (skulls > fc.animalsToStart) {
                        //fc.nextLevel();
                        console.log('next level')
                    }*/
                } else if (fc.playerIndex < index) {
                	console.log('devolve');
                    /*console.log(index,fc.playerIndex);
                    //stop movement
                    fc.playerMoving = 0;
                    //devolve
                    $('.sprite.animal').hide;
                    $('.player').hide;
                    $('.tree').removeClass('grow');
                    fc.displayOverlay(fc.$message, index, fc.playerIndex);
                    fc.playerIndex--;
                    fc.stage.setPlayer(fc.foodChain[fc.playerIndex]);*/
                } else {
                    //tie
                }
            }
    	});
    }

    return {
        check: checkCollisions
    }
})();