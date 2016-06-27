// Set the 'stage'
fc.setStage = (function() {
    var $startLink = $('[data-link-start]');
    var $headingTitle = $('[data-link-title]');
    var $stage = $('[data-stage]');
    var $tree = $('[data-tree]'); // get the first tree
    var $player;  

    // Create Variables
    var playerWidth = 50;
    var stageWidth = 0;
    var stageHeight = 0;
    var gridWidth = 0;
    var gridHeight = 0;
    var level = 1;
    var playerIndex;

    function resetGame() {
        fc.defineSprites(); // reset data
        $startLink.show(); // show link
        $headingTitle.show(); // show text
        $tree.removeClass('grow'); // hide trees
        $player.remove(); // remove player
        $stage.find('.animal').remove(); // remove animals
    }

    // Setup Handlers
    function setHandlers() {
        $startLink.click(function() {
            fc.defineSprites(); // reset data
            $(this).hide(); // hide link
            $headingTitle.hide(); // hide text
            $tree.addClass('grow'); // show trees
            addPlayer();
            addAnimals();
        });

        $(document).keydown(function(e) {
            //reset game
            if (e.keyCode == 27) {
                resetGame();
            }
        });
    }

    // Calculate dimensions of 'player', 'stage', and grid
    function calcDims() {
        stageWidth = $stage.width() - playerWidth;
        stageHeight = $stage.height() - playerWidth;
        // stage divided by player (assuming player is square)
        gridWidth = stageWidth / playerWidth;
        gridHeight = stageHeight / playerWidth;
    }

    function genTrees() {
        var i = 0;
        var x = 50;
        var y = -50;
        var treeCoords = [];
        while (y < stageHeight - 100) {
            y = y + 100;
            while (x < stageWidth - 100) {
                x = x + 100;
                var $c = $tree.clone(true);
                $stage.append($c);
                $c.css('left', x + 'px');
                $c.css('top', y + 'px');
                i++;
                treeCoords[i] = x, y;
            }
            x = -50;
        }
    }

    // Returns a random number between min and max
    function getRandomIndex(min, max) {
        return Math.random() * (max - min) + min;
    }    

    // Set random coordinates
    function addAnimals() {
        calcDims(); // check playerWidth in case browser zoom changed

        function searchMatch(i) {
            var foundMatch = false;

            var rCoords = new Array();
            rCoords[0] = (Math.floor(Math.random() * (gridWidth - 1) + 1)) * playerWidth;
            rCoords[1] = (Math.floor(Math.random() * (gridHeight - 1) + 1)) * playerWidth; 

                $.each(fc.foodChain, function(index, object) {
                    // check to see if x and y coordinates match coordinate in foodChain object
                    if(object.coords[0] === rCoords[0] && object.coords[1] === rCoords[1]) {
                        foundMatch = true;
                    }
                });

            // we didn't find a match so proceed generating animal as long as coordinates are not over trees
            if(foundMatch != true && rCoords[0] % (playerWidth * 2) === 0 && rCoords[1] % (playerWidth * 2) === 0) {
                fc.foodChain[i].coords[0] = rCoords[0];
                fc.foodChain[i].coords[1] = rCoords[1];
                var animalHtml = '<div data-animal="'+i+'" id="sprite-' + i + '" class="sprite animal">' + fc.foodChain[i].code + '</div>';
                $stage.append(animalHtml); // add animal html
                $('[data-animal="'+i+'"]').css('left',rCoords[0]+'px').css('top',rCoords[1]+'px'); // position animal
            } else {
                searchMatch(i); // we found a match - try again
            }   
        }

        // generate an animal for every item in foodChain object
        $.each(fc.foodChain, function(index, object) {
            searchMatch(index);
        });
    }    

    // Add player to stage
    function addPlayer() {
        playerIndex = Math.floor(getRandomIndex(12-level, 15-level));
        var animalHtml = '<div data-player id="sprite-' + playerIndex + '" class="sprite player">' + fc.foodChain[playerIndex].code + '</div>';
        $stage.append(animalHtml);
        $player = $('[data-player]');
    }

    // Initialize function
    function init() {
        setHandlers(); // bind dom
        calcDims(); // get sizes of elements
        genTrees(); // create HTML for trees
        $tree = $('[data-tree]'); // get all the trees
    }

    init();
});

// Start
$(function() {
    fc.setStage();
});