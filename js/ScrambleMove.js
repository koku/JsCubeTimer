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


