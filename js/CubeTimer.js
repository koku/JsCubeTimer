/**
 * A timer that can be used for Rubik's cube timing
 * @param timerLabel
 * @param scrambleMoveGenerator
 * @param scoreList
 * @param scoreListView
 * @constructor
 */
function CubeTimer(timerLabel, scrambleMoveGenerator, scoreList, scoreListView)
{
	this.timerLabel = timerLabel;
	this.startTime = 0;
	this.endTime = 0;
	this.running = false;
	this.intervalId = null;
	this.justStopped = false;
	this.scrambleMoveGenerator = scrambleMoveGenerator;
	this.scoreList = scoreList;
	this.scoreListView = scoreListView;
	this.timeFormatter = new TimeFormatter();

	this.init();
}
Object.extend(CubeTimer.prototype,
	{
		// initialize
		init: function()
		{
			// bind keydown to this objects keyPressed method
			document.addEventListener('keyup', this.keyPressedUp.bind(this));
			document.addEventListener('keydown', this.keyPressedDown.bind(this));
			this.scrambleMoveGenerator.generateSequence();
			this.scoreListView.render();
		},
		reset: function()
		{
			this.running = false;
			this.startTime = 0;
			this.endTime = 0;
			this.setTimerLabel(0);
		},
		// start the timer
		startTimer: function()
		{
			// do nothing when already running
			if(this.running)
				return;

			this.endTime = 0;
			this.startTime = this.getTimestamp();
			this.running = true;

			// bind interval to updateView so the current duration gets updated on screen
			this.intervalId = setInterval(this.updateView.bind(this), 1);
		},
		// stop the timer
		stopTimer: function()
		{
			if(!this.running)
				return;

			this.endTime = this.getTimestamp();
			this.running = false;

			// remove the interval that updates the view
			if(this.intervalId)
				clearInterval(this.intervalId);

			// set the final result time
			this.setTimerLabel(this.getDuration());

			// store the score :)
			var score = new Score({
				scrambleSequence: scrambleMoveGenerator.getPreviousSequence(),
				score: this.getDuration()
			});
			this.scoreList.add(score);
			score.save();

			this.scoreListView.render();
		},
		// get the duration
		getDuration: function()
		{
			return this.endTime - this.startTime;
		},
		// returns the duration so far
		getCurrentDuration: function()
		{
			if(!this.running)
				return null;

			var currentDate = new Date();
			return currentDate - this.startTime;
		},
		// get the current timestamp in milliseconds
		getTimestamp: function()
		{
			var date = new Date();
			return date.getTime();
		},
		// calls the correct method for the pressed key
		keyPressedUp: function(e)
		{

			var key = e.keyCode || e.charCode;
			if(key == 32)
			{
				this.spacebarUp();
			}
		},
		keyPressedDown: function(e)
		{
			var key = e.keyCode || e.charCode;
			if(key == 32) // space
			{
				this.spacebarDown();
			}
			else if(key == 82) // r
			{
				// reset everything
				this.reset();
			}
			else if(key == 83) // s
			{
				// generate and show a new scramble sequence
				this.scrambleMoveGenerator.generateSequence();
			}
		},
		// action to perform when spacebar is released
		spacebarUp: function()
		{
			if(this.justStopped)
			{
				this.justStopped = false;
				return;
			}

			if(!this.running)
			{
				this.startTimer();
			}
		},
		// action to perform when spacebar is pressed down
		spacebarDown: function()
		{
			if(this.running)
			{
				this.stopTimer();
				this.justStopped = true;
				this.scrambleMoveGenerator.generateSequence();
			}
			else if(!this.justStopped)
			{
				this.setTimerLabel(0);
			}
		},
		// updates the timer label with the current duration
		updateView: function()
		{
			if(this.running)
				this.setTimerLabel(this.getCurrentDuration());
			else
				clearInterval(this.intervalId);
		},
		// sets the timer label to the given value
		setTimerLabel: function(value)
		{
			this.timerLabel.textContent = this.timeFormatter.microSecondsToTime(value);
		}
	});

