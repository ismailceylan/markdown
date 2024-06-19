import LookAround from "./look-around";

export default class Stream
{
	/**
	 * Cursor position in the stream.
	 * 
	 * @type {number}
	 */
	cursor = 0;

	constructor( raw )
	{
		this.raw = raw;
	}

	/**
	 * Indicates the length of the raw string.
	 *
	 * @type {number}
	 */
	get length()
	{
		return this.raw.length;
	}

	/**
	 * Indicates the next byte in the stream.
	 *
	 * If the cursor has reached the end of the stream, this will be undefined.
	 * 
	 * @type {string|undefined}
	 */
	get next()
	{
		return this.raw[ this.cursor++ ];
	}

	/**
	 * Indicates the current byte in the stream.
	 * 
	 * If the cursor has reached the end of the stream, this will be undefined.
	 *
	 * @type {string|undefined}
	 */
	get current()
	{
		return this.raw[ this.cursor ];
	}

	/**
	 * Indicates if the cursor has reached the end of the stream.
	 *
	 * @type {boolean}
	 */
	get end()
	{
		return this.cursor >= this.length;
	}

	readUntil( target )
	{
		const stack = this.raw.slice( this.cursor );
		const to = stack.indexOf( target );

		if( to > -1 )
		{
			const data = stack.slice( 0, to );
			
			this.cursor += data.length;
			return data;
		}
	}

	positiveLookAhead( target )
	{
		return ( new LookAround( this )).positiveLookAhead( target );
	}
	
	negativeLookAhead( target )
	{
		return ( new LookAround( this )).negativeLookAhead( target );
	}
		
	negativeLookBehind( target )
	{
		return ( new LookAround( this )).negativeLookBehind( target );
	}
	
}
