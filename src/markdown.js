import Stream from "./stream";

export default class Markdown
{
	plugins = null;
	ast = [];

	constructor({ plugins = {}} = {})
	{
		this.plugins = plugins;
	}

	render( raw )
	{
		const stream = new Stream( raw );
		let ast = undefined;

		while( ! stream.end )
		{
			let current = stream.next;
	
			for( const pluginName in this.plugins )
			{
				const plugin = this.plugins[ pluginName ];

				for( const rule of plugin )
				{
					// the rule says that we need to match exactly the value
					if( rule.mode == "match" )
					{
						// previous byte of the current byte 
						// shouldn't match the rule's first byte
						const isBehindOK = stream
							.negativeLookBehind( rule.with.at( 0 ))
							.passed;

						const isMatchedAndAheadOK = stream
							// try to match with the rule value
							.positiveLookAhead( rule.with )
							// the first byte after the looked range
							// shouldn't match the rule's last byte 
							.negativeLookAhead( rule.with.at( -1 ))
							.passed;

						// we are sure the rule is matched and doesn't repeat at the point
						if( isBehindOK && isMatchedAndAheadOK )
						{
							if( ! ast )
							{
								// we should create ast entry
								ast = Object.create( null );
	
								ast.name = pluginName;
								ast.index = stream.cursor + rule.with.length + 1;
							}

							// we should eat the rule value from stream
							stream.cursor += rule.with.length;
						}
					}
					else if( rule.mode === "eat" && ast )
					{
						const capture = Object.create( null );

						capture.index = stream.cursor + 1;
						capture.value = stream.readUntil( rule.until );
						capture.end = stream.cursor;

						ast[ rule.name ] = capture;

						stream.cursor += rule.until.length;
					}
				}

				if( ast )
				{
					break;
				}
			}

			if( ast )
			{
				// we should create ast for current character
				// because we looked ahead and behind of it
				const ast = Object.create( null );

				ast.name = "ascii";
				ast.value = current;
				ast.index = stream.cursor;

				this.ast.push( ast );
			}
			else
			{
				ast = Object.create( null );

				ast.name = "ascii";
				ast.value = current;
				ast.index = stream.cursor;
			}

			this.ast.push( ast );
			ast = null;
		}
	}
}
