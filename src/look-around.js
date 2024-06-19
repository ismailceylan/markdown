export default class LookAround
{
	cursor = 0;
	stream = null;
	stack = [];

	constructor( stream )
	{
		this.stream = stream;
		this.cursor = stream.cursor;
	}

	positiveLookAhead( target )
	{
		this.stack.push(
			target === this.stream.raw.slice( this.cursor, this.cursor + target.length )
		);

		this.cursor += target.length;

		return this;
	}

	negativeLookAhead( target )
	{
		this.stack.push(
			target !== this.stream.raw.slice( this.cursor, this.cursor + target.length )
		);

		this.cursor += target.length;

		return this;
	}

	negativeLookBehind( target )
	{
		this.stack.push(
			target !== this.stream.raw.slice( this.cursor - target.length, this.cursor )
		);

		this.cursor -= target.length;

		return this;
	}

	/**
	 * Returns whether all looking around in the stack are truthy or not.
	 *
	 * @return {boolean}
	 */
	get passed()
	{
		return this.stack.reduce(
			( prev, curr ) => prev && curr,
			true
		);
	}
}
