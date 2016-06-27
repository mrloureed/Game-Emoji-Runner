// Set the 'stage'
fc.setStage = (function() {
    var $startLink = $('[data-link-start]'); // start link
    var $headingTitle = $('[data-link-title]'); // game title
    var $stage = $('[data-stage]'); // get stage div
    var $tree = $('[data-tree]'); // get the first tree
    fc.$player;  

    // Create Variables
    fc.playerWidth = 50;
    fc.stageWidth = 0;
    var stageHeight = 0;
    var gridWidth = 0;
    var gridHeight = 0;
    var level = 1;
    var animalsToStart = 5; // number of animals to start
    var playerIndex;


    function resetGame() {
        fc.defineSprites(); // reset data
        $startLink.show(); // show link
        $headingTitle.show(); // show text
        $tree.removeClass('grow'); // hide trees
        fc.$player.remove(); // remove player
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
            fc.move.play();
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
        fc.stageWidth = $stage.width() - fc.playerWidth;
        stageHeight = $stage.height() - fc.playerWidth;
        // stage divided by player (assuming player is square)
        gridWidth = fc.stageWidth / fc.playerWidth;
        gridHeight = stageHeight / fc.playerWidth;
    }

    function genTrees() {
        var i = 0;
        var x = 50;
        var y = -50;
        var treeCoords = [];
        while (y < stageHeight - 100) {
            y = y + 100;
            while (x < fc.stageWidth - 100) {
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
            rCoords[0] = (Math.floor(Math.random() * (gridWidth - 1) + 1)) * fc.playerWidth;
            rCoords[1] = (Math.floor(Math.random() * (gridHeight - 1) + 1)) * fc.playerWidth; 

                $.each(fc.foodChain, function(index, object) {
                    // check to see if x and y coordinates match coordinate in foodChain object
                    if(object.coords[0] === rCoords[0] && object.coords[1] === rCoords[1]) {
                        foundMatch = true;
                    }
                });

            // we didn't find a match so proceed generating animal as long as coordinates are not over trees
            if(foundMatch != true && rCoords[0] % (fc.playerWidth * 2) === 0 && rCoords[1] % (fc.playerWidth * 2) === 0) {
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
            return index < animalsToStart-1;
        });
    }    

    // Add player to stage
    function addPlayer() {
        playerIndex = Math.floor(getRandomIndex(2, 4)); // player starts low on chain
        var animalHtml = '<div data-player id="sprite-' + playerIndex + '" class="sprite player">' + fc.foodChain[playerIndex].code + '</div>';
        $stage.append(animalHtml);
        fc.$player = $('[data-player]');
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