import LookAround from "./look-around";

export default class Stream
{
	/**
	 * Cursor position in the stream.
	 * 
	 * @type {number}
	 */
	cursor = -1;

	/**
	 * The source to be streamed.
	 * 
	 * @type {string}
	 */
	raw = "";

	constructor( raw )
	{
		this.raw = raw;
	}

	/**
	 * Indicates the length of the stream.
	 *
	 * @type {number}
	 */
	get length()
	{
		return this.raw.length;
	}

	/**
	 * Indicates the next byte in the stream while moving the cursor.
	 *
	 * If the cursor has reached the end of the stream, this will be undefined.
	 * 
	 * @type {string|undefined}
	 */
	get next()
	{
		return this.raw[ ++this.cursor ];
	}

	/**
	 * Indicates the current byte that cursor is pointing in the stream.
	 * 
	 * If the cursor has reached at the end of the stream, this will be undefined.
	 *
	 * @type {string|undefined}
	 */
	get current()
	{
		return this.raw[ this.cursor ];
	}

	/**
	 * Indicates if the cursor has reached at the end of the stream.
	 *
	 * @type {boolean}
	 */
	get end()
	{
		return this.cursor >= this.length - 1;
	}

	get look()
	{
		return new LookAround( this );
	}

	readUntil( target )
	{
		const haystack = this.raw.slice( this.cursor );
		const targetPos = haystack.indexOf( target );

		if ( targetPos > -1 )
		{
			this.cursor += targetPos - 1;
			return haystack.slice( 0, targetPos );
		}

		return false;
	}
}
