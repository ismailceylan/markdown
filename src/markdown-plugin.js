export default class MarkdownPlugin
{
	name = null;
	regex = null;

	constructor( name )
	{
		this.name = name;
	}

	render( renderer )
	{
		this.renderer = renderer;
		return this;
	}

	pattern( regex )
	{
		this.regex = regex;
		return this;
	}
}
