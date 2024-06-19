import Markdown from "./src/markdown";
import { EOS } from "./src/constants";

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
				until: "**",
				name: "content"
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
				until: "]",
				name: "link-content"
			},
			{
				mode: "match",
				with: "("
			},
			{
				mode: "eat",
				until: ")",
				name: "paranthesis-content",
				useValue:
				{
					"link-and-title":
					[
						{
							mode: "eat",
							until: " ",
							name: "link"
						},
						{
							mode: "match",
							with: " "
						},
						{
							mode: "eat",
							until: EOS,
							name: "title"
						}
					],

					"only-link":
					[
						{
							mode: "eat",
							until: EOS,
							name: "link",
						}
					]
				}
			}
		]
	}
});
console.time("render");

const rendered = md.render(
`Hello **World**! [How](sasd) are **you** babe?` );

console.timeEnd("render");

console.log(md);