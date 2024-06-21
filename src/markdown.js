import { StateMachine, Stream } from ".";

export default class Markdown
{
	/**
	 * The list of plugins.
	 * 
	 * @type {Object}
	 */
	plugins = null;

	/**
	 * The stream that represents the raw markdown text.
	 * 
	 * @type {Stream}
	 */
	stream = null;

	/**
	 * The state machine.
	 * 
	 * @type {StateMachine}
	 */
	stateMachine = new StateMachine;

	/**
	 * The list of AST nodes.
	 * 
	 * @type {Array}
	 */
	ast = [];

	constructor({ plugins = {}} = {})
	{
		this.plugins = plugins;
	}

	render( raw )
	{
		var latestReturnedValue;

		this.stream = new Stream( raw );

		while( this.stream.next )
		{
			for( const pluginName in this.plugins )
			{
				for( const step of this.plugins[ pluginName ])
				{
					latestReturnedValue = this.handleRule( step, pluginName, latestReturnedValue );

					// first step is done but if state machine still idle
					// then we can stop trying other steps of plugin
					if( this.stateMachine.idle )
					{
						break;
					}
				}

				// if state machine is not idle, then we can stop trying other plugins
				// because we can assume that plugin steps above may have captured the
				// content and placed it in the state machine
				if( ! this.stateMachine.idle )
				{
					break;
				}
			}

			// at this point state machine still can be idle
			// that means we could not be able to find a plugin
			// to handle current stream position, so we should
			// just add the byte into the ast to not lose it
			if( this.stateMachine.idle )
			{
				this.stateMachine
					.name( "ascii" )
					.set( "value", this.stream.current )
					.starts( this.stream.cursor );
			}

			// what's left in the state machine should be in the ast
			this.ast.push( 
				this.stateMachine.flush()
			);
		}

		// empty the stream
		this.stream = null;
	}

	handleRule( rule )
	{
		if( rule.mode == "match" )
		{
			return this.matchRule( ...arguments );
		}
		
		if( rule.mode == "eat" )
		{
			return this.eatRule( ...arguments );
		}

		if( rule.mode == "eat-if" )
		{
			return this.eatIfRule( ...arguments );
		}
	}

	matchRule( rule, pluginName )
	{
		const { stream } = this;
		const look1 = stream.look;
		const look2 = stream.look;

		// previous byte of the current byte 
		// shouldn't match the rule's first byte
		const isBehindOK = ! look1.before( rule.with.at( 0 ));

		// starting from the current byte, the bytes up
		// to the target length must match the target bytes
		const hasMatched = look2.match( rule.with, { move: true });

		// the first byte after the looked range
		// shouldn't match the rule's last byte 
		const isAheadOK = ! look2.after( rule.with.at( -1 ));

		// if all of the above conditions are true, then we have a match that
		// means we started to capture a markdown component in the raw document
		if( isBehindOK && hasMatched && isAheadOK )
		{
			// if machine is idle then that means this is
			// the first step to capture a markdown component
			if( this.stateMachine.idle )
			{
				this.stateMachine
					.name( pluginName )
					.starts( this.stream.cursor );
			}

			this.stream.cursor += rule.with.length;
		}
	}

	eatRule( rule )
	{
		let until, data = "";

		// we are going to place the found data into
		// its own AST node within the current AST node
		const astNode = ( new StateMachine ).starts( this.stream.cursor );

		for( until of rule.until )
		{
			const eaten = this.stream.readUntil( until );

			// if the pointed characters are not found, it could means we
			// are either not within a component or it is a broken one
			if( eaten !== false )
			{
				data = eaten;

				// we read data until the pointed character is
				// found; there is no need to try other options
				break;
			}
		}

		astNode
			.set( "value", data )
			.ends( this.stream.cursor );

		this.stateMachine
			.set( rule.as, astNode.ast )
			.ends( this.stream.cursor += until.length );
		
		return until;
	}

	eatIfRule( rule, pluginName, beforeEndedAs )
	{
		if( rule.beforeEndedAs === beforeEndedAs )
		{
			this.stream.cursor += beforeEndedAs.length - 1;

			return this.eatRule(
				{
					mode: "eat",
					until: rule.until,
					as: rule.as
				},
				pluginName
			);
		}
	}
}
