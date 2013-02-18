Scores = Backbone.Collection.extend(
{
	model: Score,
	localStorage: new Backbone.LocalStorage("Scores"),

	getBestScore: function()
	{
		var bestScore;

		for(var i = 0; i < this.length; i++)
		{
			if (!bestScore || this.models[i].get('score') < bestScore)
				bestScore = this.models[i].get('score');
		}

		return bestScore;
	},

	getAverageScore: function()
	{
		if (this.length == 0)
			return -1;

		//var scores = this.pluck('score');
		var sum = 0;
		for(var i = 0; i < this.length; i++)
		{
			sum += this.models[i].get('score');
		}

		return sum / scores.length;
	},

	getAllScores: function()
	{
		return this.pluck('score');
	}
});
