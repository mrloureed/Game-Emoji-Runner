fc.addEmojis = (function() {
    // Returns a random number between min and max
    function getRandomIndex(min, max) {
        return Math.random() * (max - min) + min;
    }   

    // Add player to stage
    function addPlayer() {
        fc.playerIndex = Math.floor(getRandomIndex(2, fc.level+2)); // player starts low on chain
        var animalHtml = '<div data-player class="sprite player"><div>' + fc.foodChain[fc.playerIndex].code + '</div></div>';
        fc.$stage.append(animalHtml);
        fc.$player = $('[data-player]');
    }

    function genTrees() {
        var i = 0;
        var x = 50;
        var y = -50;
        var treeCoords = [];
        while (y < fc.stageHeight - 100) {
            y = y + 100;
            while (x < fc.stageWidth - 100) {
                x = x + 100;
                var $c = fc.$tree.clone(true);
                fc.$stage.append($c);
                $c.css('left', x + 'px');
                $c.css('top', y + 'px');
                i++;
                treeCoords[i] = x, y;
            }
            x = -50;
        }
    } 

    // Calculate dimensions of 'player', 'stage', and grid
    function calcDims() {
        fc.stageWidth = fc.$stage.width() - fc.playerWidth;
        fc.stageHeight = fc.$stage.height() - fc.playerWidth;
        // stage divided by player (assuming player is square)
        gridWidth = fc.stageWidth / fc.playerWidth;
        gridHeight = fc.stageHeight / fc.playerWidth;
    }

    // Set random coordinates
    function addAnimals() {
        calcDims(); // check playerWidth in case browser zoom changed

        function searchMatch(i) {
            var foundMatch = false;

            var rCoords = new Array();
            rCoords[0] = (Math.floor(Math.random() * (gridWidth - 1) + 1)) * fc.playerWidth;
            rCoords[1] = (Math.floor(Math.random() * (gridHeight - 1) + 1)) * fc.playerWidth; 

            $.each(fc.foodChain, function(index, object) {
                // check to see if x and y coordinates match coordinate in foodChain object
                if(object.coords[0] === rCoords[0] && object.coords[1] === rCoords[1]) {
                    foundMatch = true;
                }
            });

            // we didn't find a match so proceed generating animal as long as coordinates are not over trees
            if(rCoords[1] != 400 && foundMatch != true && rCoords[0] % (fc.playerWidth * 2) === 0 && rCoords[1] % (fc.playerWidth * 2) === 0) {
                fc.foodChain[i].coords[0] = rCoords[0];
                fc.foodChain[i].coords[1] = rCoords[1];
                var animalHtml = '<div data-animal="'+i+'" id="sprite-' + i + '" class="sprite animal">' + fc.foodChain[i].code + '</div>';
                fc.$stage.append(animalHtml); // add animal html
                $('[data-animal="'+i+'"]').css('left',rCoords[0]+'px').css('top',rCoords[1]+'px'); // position animal
                fc.foodChain[i].onBoard = true;
            } else {
                searchMatch(i); // we found a match - try again
            }   
        }

        // generate an animal for every item in foodChain object
        $.each(fc.foodChain, function(index, object) {
            searchMatch(index);
            return index < fc.animalsToStart-1;
        });
    }

    function resetGame() {
        fc.levelSpeed = 240;
        $('.sprite').css('-webkit-transition-duration', '.24s');
        fc.defineSprites(); // reset data
        fc.$startLink.show(); // show link
        fc.$aboutLink.show(); // show link
        fc.$headingTitle.show(); // show text
        fc.$tree.removeClass('grow'); // hide trees
        fc.$player.remove(); // remove player
        fc.$stage.find('.animal').remove(); // remove animals
        fc.move.setVars(); // reset move vars
    }        

    return {
        addPlayer: addPlayer,
        genTrees: genTrees,
        addAnimals: addAnimals,
        calcDims: calcDims,
        resetGame: resetGame,
        getRandomIndex: getRandomIndex
    }
})();


