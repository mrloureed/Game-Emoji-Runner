fc.scoreboard = (function() {
	fc.score = 0;

	function update(o,update) {
		o.html(update);
	}

	function init() {
		fc.$score = $('[data-score]');
		fc.$level = $('[data-level]');
    }

    // bind dom
    $(init);

    // Reveal public pointers to
    // private functions and properties
    return {
        update: update
    };

})();