// todo: move to a better place
// binding fix
Function.prototype.bind=(function(){}).bind||function(a,b){b=this;return function(){b.apply(a,arguments)}}

// todo: move to a better place
// object extending
Object.extend = function(dest, source, allowOverwrite)
{
    for (var prop in source)
    {
        if (source.hasOwnProperty(prop) && (allowOverwrite || !dest.hasOwnProperty(prop)))
            dest[prop] = source[prop];
    }

    return dest;
}

// todo: move to a better place
// allow storage of objects in localStorage
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}


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
    this.scoreFormatter = new ScoreFormatter();

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
        this.scoreListView.displayList(this.scoreList);
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
        this.scoreList.add(new Score(this.scrambleMoveGenerator.getPreviousSequence(), this.getDuration()));
        this.scoreList.save();
        this.scoreListView.displayList(this.scoreList);
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
        this.timerLabel.textContent = this.scoreFormatter.getFormattedScore(value);
    }
});


/**
 * Represents a single move to scramble a cube
 * @param name The name of the move, for example: D' or R2
 * @constructor
 */
function ScrambleMove(name)
{
    this.invalidNextMoves = [name];
    this.doesNotTouchMoves = [];
    this.name = name;
}
Object.extend(ScrambleMove.prototype,
{
    // returns the name of this move
    getName: function()
    {
        return this.name;
    },
    // add a move that is not allowed as next move
    addInvalidNextMove: function(name)
    {
        this.invalidNextMoves.push(name);
    },
    // check if the given move is allowed after this move
    isNextMoveAllowed: function(name)
    {
        if(this.invalidNextMoves.indexOf(name) == -1)
        {
            return true;
        }

        return false;
    },
    // add a move that is not touched by this move
    addDoesNotTouchMove: function(name)
    {
        this.doesNotTouchMoves.push(name);
    },
    // return all moves that are not touched by this move
    getDoesNotTouchMoves: function()
    {
        return this.doesNotTouchMoves;
    }
});


/**
 * Generates a scramble sequence of {amount} moves
 * @param amount
 * @param sequenceLabel
 * @constructor
 */
function ScrambleMoveGenerator(amount, sequenceLabel)
{
    this.amount = amount;
    this.sequenceLabel = sequenceLabel;
    this.scrambleList = [];
    this.moveList = [];
    this.previousSequence = '';

    this.init3x3x3();
}
Object.extend(ScrambleMoveGenerator.prototype,
{
    // set the moves for a 3x3x3 cube
    init3x3x3: function()
    {
        var d = new ScrambleMove('D');
        d.addInvalidNextMove("D'");
        d.addInvalidNextMove("D2");
        d.addDoesNotTouchMove("U");
        d.addDoesNotTouchMove("U'");
        d.addDoesNotTouchMove("U2");
        this.scrambleList.push(d);

        var dR = new ScrambleMove("D'");
        dR.addInvalidNextMove("D");
        dR.addInvalidNextMove("D2");
        dR.addDoesNotTouchMove("U");
        dR.addDoesNotTouchMove("U'");
        dR.addDoesNotTouchMove("U2");
        this.scrambleList.push(dR);

        var u = new ScrambleMove("U");
        u.addInvalidNextMove("U'");
        u.addInvalidNextMove("U2");
        u.addDoesNotTouchMove("D");
        u.addDoesNotTouchMove("D'");
        u.addDoesNotTouchMove("D2");
        this.scrambleList.push(u);

        var uR = new ScrambleMove("U'");
        uR.addInvalidNextMove("U");
        uR.addInvalidNextMove("U2");
        uR.addDoesNotTouchMove("D");
        uR.addDoesNotTouchMove("D'");
        uR.addDoesNotTouchMove("D2");
        this.scrambleList.push(uR);

        var f = new ScrambleMove("F");
        f.addInvalidNextMove("F'");
        f.addInvalidNextMove("F2");
        f.addDoesNotTouchMove("B");
        f.addDoesNotTouchMove("B'");
        f.addDoesNotTouchMove("B2");
        this.scrambleList.push(f);

        var fR = new ScrambleMove("F'");
        fR.addInvalidNextMove("F");
        fR.addInvalidNextMove("F2");
        fR.addDoesNotTouchMove("B");
        fR.addDoesNotTouchMove("B'");
        fR.addDoesNotTouchMove("B2");
        this.scrambleList.push(fR);

        var b = new ScrambleMove("B");
        b.addInvalidNextMove("B'");
        b.addInvalidNextMove("B2");
        b.addDoesNotTouchMove("F");
        b.addDoesNotTouchMove("F'");
        b.addDoesNotTouchMove("F2");
        this.scrambleList.push(b);

        var bR = new ScrambleMove("B'");
        bR.addInvalidNextMove("B");
        bR.addInvalidNextMove("B2");
        bR.addDoesNotTouchMove("F");
        bR.addDoesNotTouchMove("F'");
        bR.addDoesNotTouchMove("F2");
        this.scrambleList.push(bR);

        var r = new ScrambleMove("R");
        r.addInvalidNextMove("R'");
        r.addInvalidNextMove("R2");
        r.addDoesNotTouchMove("L");
        r.addDoesNotTouchMove("L'");
        r.addDoesNotTouchMove("L2");
        this.scrambleList.push(r);

        var rR = new ScrambleMove("R'");
        rR.addInvalidNextMove("R");
        rR.addInvalidNextMove("R2");
        rR.addDoesNotTouchMove("L");
        rR.addDoesNotTouchMove("L'");
        rR.addDoesNotTouchMove("L2");
        this.scrambleList.push(rR);

        var l = new ScrambleMove("L");
        l.addInvalidNextMove("L'");
        l.addInvalidNextMove("L2");
        l.addDoesNotTouchMove("R");
        l.addDoesNotTouchMove("R'");
        l.addDoesNotTouchMove("R2");
        this.scrambleList.push(l);

        var lR = new ScrambleMove("L'");
        lR.addInvalidNextMove("L");
        lR.addInvalidNextMove("L2");
        lR.addDoesNotTouchMove("R");
        lR.addDoesNotTouchMove("R'");
        lR.addDoesNotTouchMove("R2");
        this.scrambleList.push(lR);

        var d2 = new ScrambleMove("D2");
        d2.addInvalidNextMove("D'");
        d2.addInvalidNextMove("D");
        d2.addDoesNotTouchMove("U");
        d2.addDoesNotTouchMove("U'");
        d2.addDoesNotTouchMove("U2");
        this.scrambleList.push(d2);

        var u2 = new ScrambleMove("U2");
        u2.addInvalidNextMove("U'");
        u2.addInvalidNextMove("U");
        u2.addDoesNotTouchMove("D");
        u2.addDoesNotTouchMove("D'");
        u2.addDoesNotTouchMove("D2");
        this.scrambleList.push(u2);

        var f2 = new ScrambleMove("F2");
        f2.addInvalidNextMove("F'");
        f2.addInvalidNextMove("F");
        f2.addDoesNotTouchMove("B");
        f2.addDoesNotTouchMove("B'");
        f2.addDoesNotTouchMove("B2");
        this.scrambleList.push(f2);

        var b2 = new ScrambleMove("B2");
        b2.addInvalidNextMove("B'");
        b2.addInvalidNextMove("B");
        b2.addDoesNotTouchMove("F");
        b2.addDoesNotTouchMove("F'");
        b2.addDoesNotTouchMove("F2");
        this.scrambleList.push(b2);

        var r2 = new ScrambleMove("R2");
        r2.addInvalidNextMove("R'");
        r2.addInvalidNextMove("R");
        r2.addDoesNotTouchMove("L");
        r2.addDoesNotTouchMove("L'");
        r2.addDoesNotTouchMove("L2");
        this.scrambleList.push(r2);

        var l2 = new ScrambleMove("L2");
        l2.addInvalidNextMove("L'");
        l2.addInvalidNextMove("L");
        l2.addDoesNotTouchMove("R");
        l2.addDoesNotTouchMove("R'");
        l2.addDoesNotTouchMove("R2");
        this.scrambleList.push(l2);
    },
    // generate a sequence of scramble moves, place the string in the sequenceLabel and also return it
    generateSequence: function()
    {
        var returnString = '';
        var nextMove = '';

        for (var i = 0; i < this.amount; i++)
        {
            nextMove = this.getRandomMove();
            returnString += nextMove.getName() + " ";
        }

        this.resetSequence();
        this.sequenceLabel.textContent = returnString;
        this.previousSequence = returnString;
        return returnString;
    },
    // return a random move, but only one that's allowed after the previous moves
    getRandomMove: function()
    {
        var random;
        var move;

        while(true)
        {
            random = parseInt(Math.random() * this.scrambleList.length);
            move = this.scrambleList[random];

            // skip this move already because it's not allowed by previous move
            if(this.moveList.length > 0 && !this.moveList[this.moveList.length - 1].isNextMoveAllowed(move.getName()))
                continue;

            // check if we are not touching a untouched move again
            if(this.moveList.length >= 2)
            {
                var beforePreviousMove = this.moveList[this.moveList.length - 2];
                var previousMove = this.moveList[this.moveList.length - 1];

                // get the moves that are not touched by the previous move
                var previousDoesNotTouchMoves = previousMove.getDoesNotTouchMoves();

                // check if 2 moves back is in not touched array of the previous not touched moves
                // and if so, check if the current move isn't in the same list
                if(previousDoesNotTouchMoves.indexOf(beforePreviousMove.getName()) > -1 && previousDoesNotTouchMoves.indexOf(move.getName()) > -1)
                    continue;
            }

            break;
        }

        // store the approved move and return it
        this.moveList.push(move);
        return move;
    },
    // reset the sequence generator
    resetSequence: function()
    {
        this.moveList = [];
    },
    getPreviousSequence: function()
    {
        return this.previousSequence;
    }
});


function Score(scrambleSequence, score)
{
    this.scrambleSequence = scrambleSequence;
    this.score = score;
}

function ScoreList()
{
    this.scoreList = [];
    this.storageKey = 'CubeCompanionScores';
    this.init();
}
Object.extend(ScoreList.prototype,
{
    init: function()
    {
        var currentStorage = localStorage.getObject(this.storageKey);
        if(currentStorage != null)
        {
            this.scoreList = currentStorage.scoreList;
        }
    },
    add: function(score)
    {
        this.scoreList.push(score);
    },
    save: function()
    {
        localStorage.setObject(this.storageKey, this);
    }
});


function ScoreListView(scoreBoxElement)
{
    this.scoreBoxElement = scoreBoxElement;
    this.scoreFormatter = new ScoreFormatter();
}
Object.extend(ScoreListView.prototype,
{
    displayList: function(scoreList)
    {
        var list = scoreList.scoreList;
        var best = null;
        var sum = 0;
        var html = '<ul>';
        for(var i = 0; i < list.length; i++)
        {
            var score = list[i];
            if(best == null || score.score < best)
                best = score.score;

            sum += score.score;

            html += '<li>' + this.scoreFormatter.getFormattedScore(score.score) + '</li>'
        }

        var average = sum / list.length;

        html += '</ul>';

        var topBoxHtml = '<div>best: ' + this.scoreFormatter.getFormattedScore(best) + '<br />average: ' +
            this.scoreFormatter.getFormattedScore(average) + '<div>';

        this.scoreBoxElement.innerHTML = topBoxHtml + html;
    }
});


function ScoreFormatter()
{
}
Object.extend(ScoreFormatter.prototype,
{
    getFormattedScore: function(score)
    {
        var resultMilliseconds = score / 10;

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