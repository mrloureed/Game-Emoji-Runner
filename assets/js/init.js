// Set the 'stage'
fc.setStage = (function() {
    var $startLink = $('[data-link-start]');
    var $headingTitle = $('[data-link-title]');
    var $stage = $('[data-stage]');
    var $hero = $('[data-hero]');
    var $tree = $('[data-tree]'); // get the first tree
    var $hero = $('[data-hero]');
  
    // Create Variables
    var heroWidth = 0;
    var stageWidth = 0;
    var stageHeight = 0;
    var gridWidth = 0;
    var gridHeight = 0;
    var randomX = 0;
    var randomY = 0;
    var animalsToStart = 8;
    // random hero picked along lower side of food chain (adjust for difficulty -- start lower on chain)
    var heroIndex;
    var htmlAnimal;

    // Returns a random number between min and max
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Set Stage
    function stage() {

    }

    function resetGame() {
        fc.defineSprites(); // reset data
        $startLink.show(); // show link
        $headingTitle.show(); // show text
        $tree.removeClass('grow'); // hide trees
        $stage.find('.animal').remove(); // remove hero and animals
    }

    // Setup Handlers
    function setHandlers() {
        $startLink.click(function() {
            fc.defineSprites(); // reset data
            $(this).hide(); // hide link
            $headingTitle.hide(); // hide text
            $tree.addClass('grow'); // show trees
            addHero();
        });
        $(document).keydown(function(e) {
            //reset game
            if (e.keyCode == 27) {
                resetGame();
            }
        });
    }

    // Calculate dimensions of 'hero', 'stage', and grid
    function calcDims() {
        heroWidth = $hero.width();
        stageWidth = $stage.width() - heroWidth;
        stageHeight = $stage.height() - heroWidth;
        // stage divided by hero (assuming hero is square)
        gridWidth = stageWidth / heroWidth;
        gridHeight = stageHeight / heroWidth;
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

    function randomCoords() {
        calcDims(); // check fc.heroWidth in case browser zoom changed
        randomX = (Math.floor(Math.random() * (gridWidth - 1) + 1)) * heroWidth;
        randomY = (Math.floor(Math.random() * gridHeight) + 1) * heroWidth;
        if (randomX % (heroWidth * 2) === 0 && randomY % (heroWidth * 2) === 0) {
            $.each(fc.foodChain, function() {
                if (this.coords[0] === fc.randomX && this.coords[1] === fc.randomY) {
                    randomCoords();
                }
            });
        } else {
            randomCoords();
        }
    }    

    function addHero() {
        heroIndex = Math.floor(getRandomArbitrary(2, animalsToStart));
        randomCoords(); // return hero index
        var animalHtml = '<div data-role="hero" id="sprite-' + heroIndex + '" class="sprite animal" style="left:' + randomX + 'px;top:' + randomY + 'px">' + fc.foodChain[heroIndex].code + '</div>';
        $stage.append(animalHtml);
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