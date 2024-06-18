import Markdown from "./src/markdown";
import MarkdownPlugin from "./src/markdown-plugin";

const md = new Markdown;
const bold = new MarkdownPlugin( "bold" );

bold
	.pattern( /(?:\*\*|__)(.*?)(?:\*\*|__)/g )
	.render( value => `<b>${value}</b>` );

md.use( bold );

console.log( 
	md,
	md.render( "Hello **World**" )
);
