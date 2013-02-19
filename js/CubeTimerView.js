CubeTimerView = Backbone.View.extend(
{
	template: _.template(document.getElementById('tpl-cubeTimer').innerHTML),
	timer: null,

	initialize: function()
	{
		this.options.timer.addListener('preStart', this.render.bind(this));
		this.options.timer.addListener('tick', this.render.bind(this));
		this.options.timer.addListener('stop', this.onTimerStop.bind(this));
		this.options.timer.addListener('reset', this.render.bind(this));
		this.options.timer.addListener('newScrambleSequence', this.render.bind(this));
	},
  
  onTimerStop: function(score) 
  {
			// store the score :)
			this.options.scores.add(score);
			score.save();

      this.render();
  },

	render: function()
	{
		var timer = this.options.timer;
		this.el.innerHTML = this.template({
			time: TimeFormatter().microSecondsToTime(timer.getCurrentDuration()),
			scrambleSequence: this.options.timer.currentScrambleSequence
		});
	}
});
