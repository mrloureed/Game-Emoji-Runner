// Set the 'stage'
fc.setStage = (function() {
    var $startLink = $('[data-link-start]');
    var $headingTitle = $('[data-link-title]');
    var $stage = $('[data-stage]');
    var $tree = $('[data-tree]'); // get the first tree
    var $player;  

    // Create Variables
    var playerWidth = 0;
    var stageWidth = 0;
    var stageHeight = 0;
    var gridWidth = 0;
    var gridHeight = 0;
    var randomX = 0;
    var randomY = 0;
    var animalsToStart = 8;
    // random player picked along lower side of food chain (adjust for difficulty -- start lower on chain)
    var playerIndex;
    var htmlAnimal;

    // Set Stage
    function stage() {

    }

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
        playerWidth = 50;
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
    function randomCoords() {
        calcDims(); // check fc.playerWidth in case browser zoom changed
        randomX = (Math.floor(Math.random() * (gridWidth - 1) + 1)) * playerWidth;
        randomY = (Math.floor(Math.random() * gridHeight) + 1) * playerWidth;
        if (randomX % (playerWidth * 2) === 0 && randomY % (playerWidth * 2) === 0) {
            $.each(fc.foodChain, function() {
                if (this.coords[0] === fc.randomX && this.coords[1] === fc.randomY) {
                    randomCoords();
                }
            });
        } else {
            randomCoords();
        }
    }    

    // Add player to stage
    function addPlayer() {
        playerIndex = Math.floor(getRandomIndex(2, animalsToStart));
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