import MarkdownPlugin from "./markdown-plugin";

/**
 * Represents the markdown engine.
 */
export default class Markdown
{
	plugins = [];

	use( plugin )
	{
		this.plugins.push( plugin );
		return this;
	}

	render( raw )
	{
		return raw;
	}
}
