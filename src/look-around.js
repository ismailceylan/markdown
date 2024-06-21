import Stream from "./stream";

/**
 * Looks around on the given stream without moving the cursor.
 */
export default class LookAround
{
	cursor = 0;

	/**
	 * The stream that this look around is based on.
	 * 
	 * @type {Stream}
	 */
	stream = null;

	/**
	 * Initializes the look around.
	 * 
	 * @param {Stream} stream 
	 */
	constructor( stream )
	{
		this.stream = stream;
		this.cursor = stream.cursor;
	}

	/**
	 * Indicates if the cursor is positioned after the given target.
	 * 
	 * ```js
	 * //     v   <= cursor is here
	 * "foo bar baz".before( "ba" );
	 * // it will return true
	 * ```
	 * 
	 * @param {string} target target string to look for
	 * @param {{move?: boolean}} [options] options
	 * @returns {boolean}
	 */
	before( target, { move = false } = {})
	{
		const haystack = this.stream.raw.slice
		(
			this.cursor - target.length,
			this.cursor
		);

		if( move )
		{
			this.cursor -= target.length;
		}

		return haystack === target;
	}

	/**
	 * Indicates if the cursor is positioned before the given target.
	 * 
	 * ```js
	 * //   v   <= cursor is here
	 * "foo bar baz".after( "ar" );
	 * // it will return true
	 * ```
	 * 
	 * @param {string} target target string to look for
	 * @param {{move?: boolean}} [options] options
	 * @returns {boolean}
	 */
	after( target, { move = false } = {})
	{
		const haystack = this.stream.raw.slice
		(
			this.cursor + 1,
			this.cursor + 1 + target.length
		);

		if( move )
		{
			this.cursor += target.length;
		}

		return haystack === target;
	}

	/**
	 * Indicates if the cursor is positioned from the given target.
	 * 
	 * ```js
	 * //    v   <= cursor is here
	 * "foo bar baz".match( "ar" );
	 * // it will return true
	 * ```
	 * 
	 * @param {string} target target string to look for
	 * @param {{move?: boolean}} [options] options
	 * @returns {boolean}
	 */
	match( target, { move = false } = {})
	{
		const haystack = this.stream.raw.slice
		(
			this.cursor,
			this.cursor + target.length
		);

		if( move )
		{
			this.cursor += target.length - 1;
		}

		return haystack === target;
	}
}
