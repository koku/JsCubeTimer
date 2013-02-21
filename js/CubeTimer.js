/**
 * A timer that can be used for Rubik's cube timing
 * @param scrambleMoveGenerator
 * @constructor
 */
function CubeTimer(scoreList)
{
	this.startTime = 0;
	this.endTime = 0;
	this.running = false;
	this.intervalId = null;
	this.justStopped = false;
	this.numScrambleMoves = 25;
	this.scrambleMoveGenerator = new ScrambleMoveGenerator(this.numScrambleMoves);
	this.currentScrambleSequence = null;
	this.scoreList = scoreList;
  this.spacebarIsDown = false; // don't re-process keypress when spacebar is held down
	this.listeners = {
    preStart: [],
		start: [],
		stop: [],
    reset: [],
		tick: [],
    newScrambleSequence: []
	};

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
			this.currentScrambleSequence = this.scrambleMoveGenerator.generateSequence();
		},

		reset: function()
		{
			this.running = false;
			this.startTime = 0;
			this.endTime = 0;

			this.broadcast('reset');
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

			this.broadcast('start');

			// bind interval to updateView so the current duration gets updated on screen
			this.intervalId = setInterval(this.tick.bind(this), 1);
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

			// store the score :)
			var score = new Score({
				scrambleSequence: this.scrambleMoveGenerator.getPreviousSequence(),
				score: this.getDuration()
			});

			this.currentScrambleSequence = this.scrambleMoveGenerator.generateSequence();

			this.broadcast('stop', score);
		},

		// get the duration
		getDuration: function()
		{
			return this.endTime - this.startTime;
		},

		// returns the duration so far
		getCurrentDuration: function()
		{
      if (this.startTime && this.endTime)
      {
        // Timer is already stopped, return the completed time
        return this.endTime - this.startTime;
      } 
      else if (this.startTime && !this.endTime)
      {
        // Timer is still running, return start till now difference
        var currentDate = new Date();
        return currentDate - this.startTime;
      }
      else
      {
        // Timer is in the 'reset' state, no return nothing
        return null;
      }
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
			if(key == 32 && !this.spacebarIsDown) // space
			{
				this.spacebarDown();
			}
			else if(key == 82) // r
			{
				// reset everything
				this.reset();
        this.broadcast('reset');
			}
			else if(key == 83 && !this.running) // s
			{
				// generate and show a new scramble sequence
				this.currentScrambleSequence = this.scrambleMoveGenerator.generateSequence();
        this.broadcast('newScrambleSequence');
			}
		},

		// action to perform when spacebar is released
		spacebarUp: function()
		{
      this.spacebarIsDown = false;

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
      this.spacebarIsDown = true;

			if(this.running)
			{
				this.stopTimer();
				this.justStopped = true;
			} else {
        this.reset();
      }
		},

		// Executes while the timer is running
		tick: function()
		{
			if(this.running)
			{
				this.broadcast('tick', this.getCurrentDuration());
			}
			else
			{
				clearInterval(this.intervalId);
			}
		},

		broadcast: function(eventName, parameter)
		{
      if (eventName in this.listeners)
      {
        for (var i = 0; i < this.listeners[eventName].length; i++)
        {
          this.listeners[eventName][i](parameter);
        }
			}
		},

		addListener: function(eventName, callback)
		{
			if (eventName in this.listeners)
			{
				this.listeners[eventName].push(callback);
			}
		}
	});

