define(function() {
	"use strict";
	function Countdown(num, completionCb, stepCb) {
		this.num = num;
		this.stepCb = stepCb;
		this.completionCb = completionCb;
		this.decrement = this.decrement.bind(this);
	}

	Countdown.prototype = {
		decrement: function() {
			this.num -= 1;
			if (this.num < 0) {
				throw "Countdown less than zero";
			}

			this.stepCb.apply(null, arguments);
            console.log(this.num);
			if (this.num === 0) {
				this.completionCb.apply(null, arguments);
			}
		}
	};

	return {
		countdown: Countdown
	};
});
