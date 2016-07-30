// Set the 'stage'
fc.setStage = (function() {
    fc.$startLink = $('[data-link-start]'); // start link
    fc.$headingTitle = $('[data-link-title]'); // game title
    fc.$stage = $('[data-stage]'); // get stage div
    fc.$tree = $('[data-tree]'); // get the first tree
    fc.$player;  

    // Create Variables
    fc.playerWidth = 50;
    fc.stageWidth = 0;
    fc.stageHeight = 0;
    var gridWidth = 0;
    var gridHeight = 0;
    fc.level = 1;
    fc.animalsToStart = 5; // number of animals to start
    fc.playerIndex;

    // Setup Handlers
    function setHandlers() {
        // start game
        fc.$startLink.click(function() {
            fc.score = 0;
            fc.level = 1;
            fc.scoreboard.update(fc.$score, fc.score);
            fc.scoreboard.update(fc.$level, fc.level);
            fc.defineSprites(); // reset data
            $(this).hide(); // hide link
            fc.$headingTitle.hide(); // hide text
            fc.$tree.addClass('grow'); // show trees
            fc.addEmojis.addPlayer();
            fc.addEmojis.addAnimals();
            fc.playerMoving = 1;
            fc.directionRequested = 'right';
            fc.move.play();
        });

        // escape key to reset game
        $(document).keydown(function(e) {
            if (e.keyCode == 27) {
                fc.addEmojis.resetGame();
            }
        });

        /* pause game on blur
        window.addEventListener('blur', function() {
           fc.playerMoving = 0;
        });*/

        /* start game on focus
        window.addEventListener('focus', function() {
           fc.playerMoving = 1;
           fc.move.play();
        }); */
    }

    // Initialize function
    function init() {
        setHandlers(); // bind dom
        fc.addEmojis.calcDims(); // get sizes of elements
        fc.addEmojis.genTrees(); // create HTML for trees
        fc.$tree = $('[data-tree]'); // get all the trees
    }

    init();

});

// Start
$(function() {
    fc.setStage();
});