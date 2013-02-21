ScoreListView = Backbone.View.extend(
{
	template: _.template(document.getElementById('tpl-scoreList').innerHTML),

	attributes:
	{
		id: "scoreList"
	},

  events: {
    "click .delete": "delete"
  },

  delete: function(event) {
    var score = this.options.scores.get(event.currentTarget.getAttribute('data-id'));
    score.destroy();
    this.render();
  },

	initialize: function()
	{
		this.options.scores.bind('add', this.render.bind(this));
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
