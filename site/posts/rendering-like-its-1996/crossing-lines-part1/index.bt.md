{{
metadata = {
	title: "Rendering like it's 1996 - Line rasterization part I",
	summary: "On rasterizing lines and getting confused my Apple Silicon and WASM",
	image: "crossing-lines.png",
	date: parseDate("2023/01/30 21:00"),
	published: false,
}
}}

{{include "../../../_templates/post_header.bt.html"}}
{{include "../../../_templates/post_header.bt.html" as post}}
{{include "../_demo.bt.html" as demo}}

{{post.figure("crossing-lines.png", "Don't cross the lines.")}}

<script>
window.MathJax = {
	options: {
		enableMenu: false
	}
}
</script>

<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" src="/js/mathjax/tex-chtml.js"></script>

<div class="table_of_contents"></div>

--markdown-begin

> To follow along this blog post with running code, make sure you've installed the [prerequisites](https://github.com/badlogic/r96/tree/05-crossing-lines-part1#installing-required-tools). Then:
```
git clone https://github.com/badlogic/r96
cd r96
git checkout 05-crossing-lines-part1
./tools/download-tools.sh
code .
```

[Last time](../dos-nostalgia/) we had a severe case of DOS nostalgia and figured out how to draw the first 256 Unicode code points using bitmap fonts. Today, we're creating our first rasterization algorithm to draw a bunch of lines. Exciting!

In the [first installment of this series](../babys-first-pixel/) we learned about rasters, but we didn't really define what rasterization is.

In short, rasterization in our context is the process of figuring out which pixels in a raster best represent a mathematically defined continuous shape, like a line, circle, or triangle, and then "lighting" those pixels up, so we see the rasterized shape on screen.

We've already done rasterization when we drew rectangles. We could even argue that a call to `r96_set_pixel()` actually performs rasterization of an infinitely small point at integer coordinates `(x, y)`. In both cases, there isn't much math involved, as they are simple to define and rasterize.

For lines, the story gets a bit more complicated.

## What is a line (segment)?
First of all, we aren't actually rasterizing lines, we are rasterizing line segments. What's the difference? A line is infinite, while a line segment is a section on a line, which we define by its start and end points `(x1, y1)` and `(x2, y2)`. We will colloquially refer to line segments as lines throughout the remainder of this text.

Why is rasterizing a line more involved than rasterizing a rectangle? Well, have a look at this little JavaScript thingy. You can drag the end points around.

--markdown-end
<canvas id="line1" width="640" height="480" style="padding: 0; width: 100%; background: black;"></canvas>
<script>
{
	let canvas = document.querySelector("#line1");
	let ctx = canvas.getContext("2d");	
	canvas.width = canvas.width * devicePixelRatio;
	canvas.height = canvas.height * devicePixelRatio;
	let pixSize = 32;
	let linePoints = [
		{x: 3.5, y: 4.5, radius: 0.5},
		{x: 15.5, y: 10.5, radius: 0.5}
	]
	let draw = () => {
		ctx.font = (18 * devicePixelRatio) + "px monospace";
		fillRect(canvas, 0, 0, canvas.width, canvas.height, "#222");
		let x1 = Math.floor(linePoints[0].x) * pixSize + pixSize / 2;
		let y1 = Math.floor(linePoints[0].y) * pixSize + pixSize / 2;
		let x2 = Math.floor(linePoints[1].x) * pixSize + pixSize / 2;
		let y2 = Math.floor(linePoints[1].y) * pixSize + pixSize / 2;

		ctx.lineWidth = 1;
		grid(canvas, 32, "#555");		

		ctx.lineWidth = 3;
		let color = "rgb(254, 121, 5)";
		line(canvas, x1, y1, x2, y2, color);
		circle(canvas, x1, y1, pixSize / 4, "#f00");
		circle(canvas, x2, y2, pixSize / 4, "#0f0");	
		text(canvas, Math.floor(x1 / pixSize) + ".5," + Math.floor(y1 / pixSize) + ".5", x1, y1 + (y1 < y2 ? - pixSize / 2 : pixSize / 2 + 9), "#ccc", true);
		text(canvas, Math.floor(x2 / pixSize) + ".5," + Math.floor(y2 / pixSize) + ".5", x2, y2 + (y2 < y1 ? - pixSize / 2 : pixSize / 2 + 9), "#ccc", true);	

		ctx.setLineDash([pixSize / 4, pixSize / 2]);
		line(canvas, x1, y1, x2, y1, "#ccc");
		text(canvas, "dx: " + (x2 - x1) / pixSize, x1 + (x2 - x1) / 2, y1 + pixSize * (y1 <= y2 ? -1 : 1), "#ccc", true);
		line(canvas, x2, y1, x2, y2, "#ccc");
		text(canvas, "dy: " + (y2 - y1) / pixSize, x2 + pixSize * (x1 < x2 ? 1 : -2.5), y1 + (y2 - y1) / 2, "#ccc", false);
		ctx.setLineDash([]);
	};
	let mouseToWorld = (x, y) => {
		return { x: x / canvas.clientWidth * 640 / pixSize, y: y / canvas.clientHeight * 480 / pixSize };
	};
	let dragged = (object, end) => {		
		if (end) {
			object.x = Math.floor(object.x) + 0.5;
			object.y = Math.floor(object.y) + 0.5;
		}
		let hitBounds = false;
		if (object.x < 0) {
			object.x = 0.5;	
			hitBounds = true;		
		}
		if (object.y < 0) {
			object.y = 0.5;	
			hitBounds = true;		
		}
		if (object.x >= 20) {
			object.x = 19.5;	
			hitBounds = true;		
		}
		if (object.y >= 15) {
			object.y = 14.5;	
			hitBounds = true;		
		}
		return !hitBounds;
	};

	makeObjectsDraggable(canvas, linePoints, mouseToWorld, dragged, draw);
	draw();
}
</script>
--markdown-begin

The gray grid represents the pixels in a raster. The orange line is the "mathematical" line segment defined by its start point (`red circle`) and end point (`green circle`).

You may have noticed that dragging the points will snap them to the pixel centers. You may have also noticed, that the coordinates of the points are offset by `0.5` on each axis.

When we work with our pixel raster, coordinates are always integer. However, "mathematically", our pixels aren't infinitely small. They have a size of 1 on each axis (irrespective of what [some people would like you to believe](http://alvyray.com/Memos/CG/Microsoft/6_pixel.pdf)). 

A pixel at raster coordinates `(3, 4)` actually extents from `(3, 4)` to `(3.9999999.., 4.999999..)` in the "mathematical" or continuous coordinate system our line is defined in, with its center being at `(3.5, 4.5)`.

When we pass the coordinates of a line's start and end point to our line rasterization function `r96_line()`, we'll use integers (for now). However, "mathematically", they'll be offset by `(0.5, 0.5)` so they align with the respective "mathematical" pixel centers.

`dx = x2 - x1` is the signed distance between the start point and end point on the x-axis, `dy = y2 - y1` is the signed distance on the y-axis. Why do we care for these quantities? Let's have a look at some lines. Here's one.

{{post.figure("line1.png", "")}}

And here's another one.

{{post.figureMaxWidth("line2.png", "", "400px")}}

Note that `dx` and `dy` are negative here, as the red start point is to the right and below the green end point, and `dx` and `dy` are the signed distances in each axis.

The key observation here is that the first line covers more pixels on the x-axis than on the y-axis, while the second line covers more pixels on the y-axis than on the x-axis.

It turns out that we can categorize all lines into these 2 types:

* If `|dx| >= |dy|` the line is an x-major line. This includes diagonal lines, as well as lines where the start and end point are the same.
* If `|dx| < |dy|` the line is a y-major line.

We need to figure out which pixels along the line we want to set to best represent the line. A lot of very smart people have put a lot of brain energy into this problem. While we could just copy their genius algorithms, we'll try to derive things ourselves. Since we try to render like it's 1996, we will not care for fancy things like anti-aliased lines. We'll be happy with chunky pixel segments to represent our "mathematical" lines in pixel space.

## The naive approach
The simplest approach to rasterizing a line is based on the fact, that we can categorize every line into either an x-major or y-major line. 

For x-major lines, we iterate through all pixel x-coordinates between and including the start and end-point, and figure out the corresponding y-coordinate. For y-major lines, we iterate through all pixel y-coordinates and calculate the corresponding x-coordinate. 

We thus get an `(x, y)` in each iteration that tells us which pixel to set. 

We basically sample the "mathematical" line for every pixel along the major axis. And since sampling transforms a continuous signal into a discrete signal, we'll get [aliasing](https://en.wikipedia.org/wiki/Aliasing), aka those fancy retro jaggies we all love so much. This will be a common theme throughout this series. Thanks [Nyquist and Shannon](https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem), love ya.

How do we calculate the y-coordinate given an x-coordinate, or the x-coordinate given a y-coordinate? I could slap you with various [line forms](https://en.wikipedia.org/wiki/Linear_equation), but we'll keep things simple. We'll use [similar right triangles](https://www.youtube.com/watch?v=QluMKpTtzLQ) to figure things out.

You can move the red circle 1 pixel along the x-axis in between the start and end point in this JavaScript thingy:

--markdown-end
<canvas id="line2" width="640" height="480" style="padding: 0; width: 100%; background: black;"></canvas>
<script>
{
	let canvas = document.querySelector("#line2");
	let ctx = canvas.getContext("2d");	
	canvas.width = canvas.width * devicePixelRatio;
	canvas.height = canvas.height * devicePixelRatio;
	let pixSize = 32;
	let linePoints = [		
		{x: 3.5, y: 4.5, radius: 0.5},
		{x: 15.5, y: 10.5, radius: 0.5}		
	]
	let xPoint = { x: linePoints[0].x + 1, y: linePoints[0].y, radius: 0.5 };
	let draw = () => {
		ctx.font = (18 * devicePixelRatio) + "px monospace";
		fillRect(canvas, 0, 0, canvas.width, canvas.height, "#222");
		let x1 = Math.floor(linePoints[0].x) * pixSize + pixSize / 2;
		let y1 = Math.floor(linePoints[0].y) * pixSize + pixSize / 2;
		let x2 = Math.floor(linePoints[1].x) * pixSize + pixSize / 2;
		let y2 = Math.floor(linePoints[1].y) * pixSize + pixSize / 2;
		let dx = x2 - x1;
		let dy = y2 - y1;

		ctx.lineWidth = 1;
		grid(canvas, 32, "#555");		

		ctx.lineWidth = 3;
		let color = "rgb(254, 121, 5)";
		line(canvas, x1, y1, x2, y2, color);			

		ctx.setLineDash([pixSize / 4, pixSize / 2]);
		line(canvas, x1, y1, x2, y1, "#ccc");
		text(canvas, "dx: " + (x2 - x1) / pixSize, x1 + (x2 - x1) / 2, y1 + pixSize * (y1 <= y2 ? -1.5 : 1), "#ccc", true);
		line(canvas, x2, y1, x2, y2, "#ccc");
		text(canvas, "dy: " + (y2 - y1) / pixSize, x2 + pixSize * (x1 < x2 ? 1 : -2.5), y1 + (y2 - y1) / 2 + pixSize / 3, "#ccc", false);
		ctx.setLineDash([]);

		let xp = Math.floor(xPoint.x) * pixSize + pixSize / 2;
		let yp = Math.floor(xPoint.y) * pixSize + pixSize / 2;
		circle(canvas, xp, yp, pixSize / 4, "#f00");

		line(canvas, x1, y1, xp, y1, "#0c0");
		line(canvas, xp, y1, xp, y1 + dy / dx * (xp - x1), "#0c0");
		line(canvas, xp, y1 + dy / dx * (xp - x1), x1, y1, "#0c0");
		text(canvas, "x: " + (xp - x1) / pixSize, x1 + (xp - x1) / 2, y1 - pixSize / 2, "#0c0", true);
		text(canvas, "y: " + dy / dx * (xp - x1) / pixSize, xp + pixSize / 2, y1 + dy / dx * (xp - x1) / 2, "#0c0", false);
	};
	let mouseToWorld = (x, y) => {
		return { x: x / canvas.clientWidth * 640 / pixSize, y: y / canvas.clientHeight * 480 / pixSize };
	};
	let dragged = (object, end) => {	

		if (object.x < linePoints[0].x) {
			object.x = linePoints[0].x;				
		}

		if (object.x > linePoints[1].x) {
			object.x = linePoints[1].x;				
		}

		if (object.y < linePoints[0].y) {
			object.y = linePoints[0].y;				
		}

		if (object.y > linePoints[0].y) {
			object.y = linePoints[0].y;				
		}

		return true;
	};

	makeObjectsDraggable(canvas, [xPoint], mouseToWorld, dragged, draw);
	draw();
}
</script>
--markdown-begin

The big triangle is made of the two stippled lines and the orange line, the other is made of the green lines.

For the big triangle, we know the lengths of two sides, `dx = x2 - x1` and `dy = y2 - y1`. For the smaller green triangle, we know `x`: how far are we away from `x1` on the x-axis. What we need to calculate is `y`.

Since both triangles have the same angles, `x` and `y` have the same relation as `dx` and `dy`. We can thus set up the following equation:

--markdown-end
<p style="text-align: center; font-size: 125% !important;">
\(\dfrac{y}{x} = \dfrac{dy}{dx}\)
</p>
--markdown-begin

Remembering some basic algebra, we can multiply both sides with `x` to get an equation for `y`:

--markdown-end
<p style="text-align: center; font-size: 125% !important;">
\(y = \dfrac{dy}{dx} x\)
<p>
--markdown-begin

Et voila, we can calculate `y` for every `x`.

For a y-major line, we need to calculate `x` instead of `y`, so the above turns into:

--markdown-end
<p style="text-align: center; font-size: 125% !important;">
\(x = \dfrac{dx}{dy} y\)
<p>
--markdown-begin

Note that `x` and `y` are relative to our start point `(x1, y1)`, so the final coordinates are actually `(x1 + x, y1 + y)`.

We could already implement a simple line rasterization function with this knowledge, but there is one final observation to be made. Go ahead and move the red circle in the JavaScript thingy above one pixel at a time on the x-axis and observe `y`.

If we step by 1 pixel in `x`, then `y` always increases by the same amount! And that amount is `dy / dx`, or `6 / 12 = 0.5` in the demo above. For a y-major line the same is true: if we step by 1 pixel in `y`, then `x` increases by `dx / dy`. That lends itself well to be implemented as an incremental algorithm. And that algorithm is actually known as [Digital differential analyzer](https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm)). 

Not so naive after all!

## Demo: Digital Differential Analyzer
Here's a little demo called [16_naive_line.c]():

--markdown-end
{{post.code("16_naive_line.c", "c", `
#include <MiniFB.h>
#include "r96/r96.h"

void line_naive(r96_image *image, int32_t x1, int32_t y1, int32_t x2, int32_t y2, uint32_t color) {
	int32_t delta_x = x2 - x1;
	int32_t delta_y = y2 - y1;
	int32_t num_pixels_x = abs(delta_x) + 1;
	int32_t num_pixels_y = abs(delta_y) + 1;

	float step_x, step_y;
	uint32_t num_pixels;
	if (num_pixels_x >= num_pixels_y) {
		step_x = delta_x < 0 ? -1 : 1;
		step_y = delta_x != 0 ? (float) delta_y / abs(delta_x) : 0;
		num_pixels = num_pixels_x;
	} else {
		step_x = (float) delta_x / abs(delta_y);
		step_y = delta_y < 0 ? -1 : 1;
		num_pixels = num_pixels_y;
	}

	float x = x1 + 0.5f, y = y1 + 0.5f;
	for (uint32_t i = 0; i < num_pixels; i++) {
		r96_set_pixel(image, (int32_t) x, (int32_t) y, color);
		x += step_x;
		y += step_y;
	}
}

int main(void) {
	const int window_width = 40, window_height = 30;
	int scale = 16;
	struct mfb_window *window = mfb_open("16_naive_line", window_width * scale, window_height * scale);
	r96_image output;
	r96_image_init(&output, window_width, window_height);
	do {
		r96_clear_with_color(&output, R96_ARGB(0xff, 0x22, 0x22, 0x22));
		int32_t mouse_x = mfb_get_mouse_x(window) / scale;
		int32_t mouse_y = mfb_get_mouse_y(window) / scale;
		line_naive(&output, window_width / 2, window_height / 2, mouse_x, mouse_y, 0xffff0000);

		if (mfb_update_ex(window, output.pixels, output.width, output.height) != STATE_OK) break;
	} while (mfb_wait_sync(window));
	return 0;
}
`)}}
--markdown-begin

In `main()` we play a little parlor trick: the `r96_image` we render to called `output` is only `40x30` pixels wide, while the window we create is 16 times as big. That allows us to see all the pixel goodness of our line rasterization, as MiniFB will scale up the output image pixels to the window dimensions automatically. The remainder of the `main()` function merely draws a line from the center of the output image, to the current mouse position mapped to output image coordinates.

What we're really interested in is the `line_naive()` function. It takes the start and end point pixel coordinates `(x1, y1)` and `(x2, y2)` as well as the `color` of the line to be rasterized.

We begin by calculating `delta_x` and `delta_y` (our friends `dx` and `dy` from the last section), as well as the number of pixels the line covers on both the x- and y-axis.

Next, we check if we have an x-major or y-major line and set up `step_x`, `step_y` and `num_pixels` accordingly.

In case of an x-major line (`num_pixels_x > num_pixels_y`), we step by `-1` (from right to left) or `1` (from left to right) on the x-axis, depending on whether our `delta_x` is negative or positive. It's negative if `x2 < x1` and positive otherwise. `step_y` is calculated based on the equation above, with two small deviations. First, we guard against a division by 0 in case `delta_x` is zero. Second, we divide by the absolute value of `delta_x`. For a line where `x2 < x1`, `delta_x` would be negative, which would change the sign of `step_y`.

The y-major line case is analogous, except that we don't need to guard against division by 0, as that can only happen when the start and end point are the same, which is covered by the x-major case.

Next, we set up `x` and `y` to equal the start point `(x1, y1)` of the line. They keep track of the coordinates of the pixel we will draw next. The coordinates are offset by `(0.5, 0.5)` so we actually start at the "mathematical" pixel center of the pixel at `(x1, y1)`.

Finally, we enter the rasterization loop, which iterates over the number of pixels covered by the major axis. In each iteration we draw the pixel at the current `(x, y)` coordinates, truncating any fractions by casting to `int32_t`. Then we move to the next pixel along the line by increasing `(x, y)` by `step_x` and `step_y`. That's it!

And here's the demo in all its glory:

--markdown-end
{{demo.r96Demo("16_naive_line", false)}}
--markdown-begin

## Next time on "Mario writes a lot of words"
Our little code base is shaping up to be kinda useful. Next time, we're going to look into drawing lines. Possibly with sub-pixel precision. Unless I can't figure that out.

Discuss this post on [Twitter](https://twitter.com/badlogicgames/status/1614607123475992577) or [Mastodon](https://mastodon.gamedev.place/@badlogic/109693328234554967).

--markdown-end
<script>
tableOfContents()
</script>

{{include "../../../_templates/post_footer.bt.html"}}