ScoreListView = Backbone.View.extend(
{
	template: _.template(document.getElementById('tpl-scoreList').innerHTML),

	attributes:
	{
		id: "scoreList"
	},

	initialize: function()
	{

	},

	render: function()
	{
		var timeFormatter = new TimeFormatter();

		this.el.innerHTML = this.template({
			bestScore: timeFormatter.microSecondsToTime(this.options.scores.getBestScore()),
			averageScore: timeFormatter.microSecondsToTime(this.options.scores.getAverageScore()),
			scores: this.options.scores
		});
	}
});

