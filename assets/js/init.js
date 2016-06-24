// Set the 'stage'
fc.setStage = (function() {
    fc.$startLink = $('[data-link-start]');
    fc.$headingTitle = $('[data-link-title]');

    // Set Stage
    function stage() {

    }

    // Setup Handlers
    function setHandlers() {
        fc.$startLink.click(function() {
            fc.defineSprites(); // reset data
            $(this).hide(); // hide link
            fc.$headingTitle.hide(); // hide text
        })
    }

    // Initialize function
    function init() {
        setHandlers(); // bind dom
    }

    init();
});

// Start
$(function() {
    fc.setStage();
});