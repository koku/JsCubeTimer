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
		this.el.innerHTML = this.template({
			bestScore: TimeFormatter().microSecondsToTime(this.options.scores.getBestScore()),
			averageScore: TimeFormatter().microSecondsToTime(this.options.scores.getAverageScore()),
			scores: this.options.scores
		});
	}
});

