Score = Backbone.Model.extend(
{
	defaults:
	{
		scrambleSequence: null,
		score: null
	},

	getFormattedScore: function(score)
	{
		if (!this.get('score'))
			return '';

		var resultMilliseconds = this.get('score') / 10;

		var realSeconds = parseInt(resultMilliseconds / 100);
		var milliSeconds = parseInt(resultMilliseconds % 100);
		var seconds = parseInt(realSeconds % 60);
		var minutes = parseInt((realSeconds / 60) % 60);

		var milliSecondsString = (milliSeconds < 10 ? "0" : "") + milliSeconds;
		var secondsString = (seconds < 10 ? "0" : "") + seconds;
		var minuteString = (minutes < 10 ? "0" : "") + minutes;

		return minuteString + ":" + secondsString + "." + milliSecondsString;
	}
});
