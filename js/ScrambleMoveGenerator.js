/**
 * Generates a scramble sequence of {amount} moves
 * @param amount
 * @constructor
 */
function ScrambleMoveGenerator(amount)
{
	this.amount = amount;
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


