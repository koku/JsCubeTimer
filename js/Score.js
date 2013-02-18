Score = Backbone.Model.extend(
{
	defaults:
	{
		scrambleSequence: null,
		score: null
	},

	getFormattedScore: function(score)
	{
		return TimeFormatter().microSecondsToTime(this.get('score'));
	}
});
