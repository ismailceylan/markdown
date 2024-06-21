import Markdown from "./src/markdown";

const md = new Markdown(
{
	plugins:
	{
		bold:
		[
			{
				mode: "match",
				with: "**"
			},
			{
				mode: "eat",
				until: [ "**" ],
				as: "content"
			}
		],
		link:
		[
			{
				mode: "match",
				with: "["
			},
			{
				mode: "eat",
				until: [ "]" ],
				as: "link-content"
			},
			{
				mode: "match",
				with: "]("
			},
			{
				mode: "eat",
				until: [ ' "', ")" ],
				as: "link"
			},
			{
				mode: "eat-if",
				beforeEndedAs: ' "',
				until: [ '")' ],
				as: "title"
			}
		]
	}
});

console.time("render");

const rendered = md.render(
	`Hello **World**! [How](https://google.com?search=how "look how") are ***you*** my **friend**?`.repeat(859 * 10 )
);

console.timeEnd("render");

console.log(md);


// const stream = new Stream( "naber la bebe" );
// stream.cursor = 2;

// console.log(
// 	[stream.readUntil( "l" )],
// 	stream.cursor
// );

