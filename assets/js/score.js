fc.scoreboard = (function() {
	fc.score = 0;
    fc.highscore = 0;

	function update(o,update) {
		o.html(update);
        if (fc.score > fc.highscore) {
            fc.highscore = fc.score;
            fc.scoreboard.update(fc.$highscore, fc.highscore);
        }
	}

	function init() {
		fc.$score = $('[data-score]');
        fc.$highscore = $('[data-highscore]');
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