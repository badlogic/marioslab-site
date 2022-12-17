{{
metadata = {
	title: "Rendering like it's 1996 - Bitmap fonts",
	summary: "How to get some text onto the screen.",
	image: "amiga500.jpeg",
	date: parseDate("2022/12/20 21:00"),
	published: false,
}
}}

{{include "../../../_templates/post_header.bt.html"}}
{{include "../../../_templates/post_header.bt.html" as post}}
{{include "../_demo.bt.html" as demo}}

{{post.figure("amiga500.jpeg", "Niklas Therning's beige plastic god. Has a fast blitter too!")}}

<div class="table_of_contents"></div>

--markdown-begin

[Last time](../dont-be-square/), we drew some horizontal lines and rectangles, and figured out some general optimization approaches. Today, we're going to read files, load images, and draw the images to the screen!


Discuss this post on [Twitter](https://twitter.com/badlogicgames/status/1603466400424726528) or [Mastodon](https://mastodon.social/@badlogicgames/109519253257304337).

--markdown-end
<script>tableOfContents()</script>

{{include "../../../_templates/post_footer.bt.html"}}