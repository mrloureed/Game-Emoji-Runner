// Set the 'stage'
fc.setStage = (function() {
    $startLink = $('[data-link-start]');
    $headingTitle = $('[data-link-title]');
    $stage = $('[data-stage]');
    $hero = $('[data-hero]');
    fc.$tree = $('[data-tree]'); // get the first tree
  
    // Create Variables
    var heroWidth = 0;
    var stageWidth = 0;
    var stageHeight = 0;
    var gridWidth = 0;
    var gridHeight = 0;

    // Set Stage
    function stage() {

    }

    function resetGame() {
        fc.defineSprites(); // reset data
        $startLink.show(); // show link
        $headingTitle.show(); // show text
        fc.$tree.removeClass('grow'); // hide trees
    }

    // Setup Handlers
    function setHandlers() {
        $startLink.click(function() {
            fc.defineSprites(); // reset data
            $(this).hide(); // hide link
            $headingTitle.hide(); // hide text
            fc.$tree.addClass('grow'); // show trees
        });
        $(document).keydown(function(e) {
            //reset game
            if (e.keyCode == 27) {
                console.log('reset');
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
                var $c = fc.$tree.clone(true);
                $stage.append($c);
                $c.css('left', x + 'px');
                $c.css('top', y + 'px');
                i++;
                treeCoords[i] = x, y;
            }
            x = -50;
        }
    }

    // Initialize function
    function init() {
        setHandlers(); // bind dom
        calcDims(); // get sizes of elements
        genTrees(); // create HTML for trees
        fc.$tree = $('[data-tree]'); // get all the trees
    }

    init();
});

// Start
$(function() {
    fc.setStage();
});