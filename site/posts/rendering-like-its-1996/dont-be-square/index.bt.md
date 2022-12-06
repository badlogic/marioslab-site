{{
metadata = {
	title: "Rendering like it's 1996 - Rectangles",
	summary: "Drawing horizontal lines and rectangles.",
	image: "dont-be-a-square.png",
	date: parseDate("2022/11/29 21:00"),
	published: false,
}
}}

{{include "../../../_templates/post_header.bt.html"}}
{{include "../../../_templates/post_header.bt.html" as post}}

{{post.figure("dont-be-a-square.png", "Cool kids draw their rectangles themselves.")}}

<div class="table_of_contents"></div>

--markdown-begin

[Last time](../babys-first-pixel/), we set up our development environment and explored concepts like pixels, colors, and rasters. Today, we're going to figure out how to draw rectangles. Exciting!

But first, we'll do some housekeeping.

> You can follow along by checking out the `dont-be-square-00` tag in your clone of the [r96](https://github.com/badlogic/r96) repository. `git checkout dont-be-square-00`

## Putting more stuff r96.h/r96.c

Let's stuff a few things into in [`src/r96/r96.h`](https://github.com/badlogic/r96/blob/dont-be-square-00/src/r96/r96.h) and in [`src/r96/r96.h`](https://github.com/badlogic/r96/blob/dont-be-square-00/src/r96/r96.cpp)`, where re-usable code used by the demo apps lives.

### Stellar memory management

Remember this line from the previous demo apps?

--markdown-end
{{post.code("", "c",
"
uint32_t *pixels = (uint32_t *) malloc(sizeof(uint32_t) * res_x * res_y);
"
)}}
--markdown-begin

Direct call to `malloc()`, `sizeof()`, casting, yuck! Let's wrap allocation in a few simple macros:

--markdown-end
{{post.code("r96.h", "c",
"
#define R96_ALLOC(type) (type *) malloc(sizeof(type))
#define R96_ALLOC_ARRAY(type, numElements) (type *) malloc(sizeof(type) * numElements)
#define R96_FREE(ptr) free(ptr)
"
)}}
--markdown-begin

`R96_ALLOC(type)` allocates one instance of `type`. `R96_ALLOC_ARRAY(type, numElements)` allocates `numElements` sequential instances. To clean-up, we call `R96_FREE(ptr)`. E.g.:

--markdown-end
{{post.code("", "c",
"
typedef struct rectangle {
	float x, y, width, height;
} rectangle;

rectangle *rect = R9_ALLOC(rectangle);
R96_FREE(rect);
uint32_t *pixels = R9_ALLOC_ARRAY(uint32_t, 320 * 240);
R96_FREE(pixels);
"
)}}
--markdown-begin

Apart from a little less typing, these macros let us replace our allocator, should we want that down the road.

### Destructuring colors

Creating colors from alpha, red, green, and blue components is done via `R96_ARGB()`. Sometimes we want to do the reverse and extract individual color components:

--markdown-end
{{post.code("src/r96/r96.h", "c",
"
#define R96_A(color) ((uint8_t) (color >> 24))
#define R96_R(color) ((uint8_t) (color >> 16))
#define R96_G(color) ((uint8_t) (color >> 8))
#define R96_B(color) ((uint8_t) (color))
"
)}}
--markdown-begin

Which can be used like this:

--markdown-end
{{post.code("", "c",
"
uint32_t color = R96_ARGB(255, 128, 38, 4);
uint8_t alpha = R96_A(color); // 255
uint8_t red = R96_R(color);   // 128
uint8_t green = R96_G(color); // 38
uint8_t blue = R96_B(color);  // 4
"
)}}
--markdown-begin

### A struct for (raster) images

Keeping track of the width, height, and pixels of rasters is annoying, as we saw in the previous demo apps. The term "raster" is also a bit too "scientific". Colloquially, what we are dealing with are images.

> **Note:** if we wanted to be super precise, we'd have to say "raster images". Images can also be represented in other ways, e.g. as a list of shapes with color information, aka vector images. In this series however, we'll only deal with raster images. Raster, raster image, and image are all synonymous for us.

Here's a struct to ease the pain:

--markdown-end
{{post.code("src/r96/r96.h", "c",
"
typedef struct r96_image {
	int32_t width, height;
	uint32_t *pixels;
} r96_image;
"
)}}
--markdown-begin

Many of the algorithms we'll build work using signed integers. We thus store `width` and `height` as signed integers to avoid some casting.

We add an initializer function that sets `width` and `height` and allocates memory for the pixels:

--markdown-end
{{post.code("src/r96/r96.c", "c",
"
void r96_image_init(r96_image *image, uint32_t width, uint32_t height) {
	assert(width > 0);
	assert(height > 0);

	image->width = width;
	image->height = height;
	image->pixels = R96_ALLOC_ARRAY(uint32_t, width * height);
}
"
)}}
--markdown-begin

The heap-allocated memory also needs to be freed at some point, so we add a disposal function:

--markdown-end
{{post.code("src/r96/r96.c", "c",
"
void r96_image_dispose(r96_image *image) {
	R96_FREE(image->pixels);
}
"
)}}
--markdown-begin

Creating raster images has never been so easy:

--markdown-end
{{post.code("", "c",
"
r96_raster raster;
r96_raster_init(&raster, 320, 240);
r96_raster_dispose(&raster);

r96_raster *heapRaster = R96_ALLOC(r96_raster);
r96_raster_init(heapRaster, 64, 64);
r96_raster_dispose(heapRaster);
R96_FREE(heapRaster);
"
)}}
--markdown-begin

As illustrated by the snippet above, we can initialize and dispose both stack and heap allocated `r96_image` instances. Which leads me into a little excurse into memory and resource life-time management.

### A word on memory and resource life-time management

In C, we don't have the luxury of a borrow checker like in Rust, or a garbage collector like in Java. We don't even have RAII, like in C++. Heap allocated memory blocks and other resources, like file handles, must be carefully managed.

C doesn't really give us the tools to build water-tight resources management. Instead, we must come up with rules, that make it less likely that we'll shoot ourselves in the foot. From these rules we derive an API design which should help enforce the rules.

Keeping too many rules in our head is hard, so let's only have a few:

- There are no naked resources (e.g. a pointer to heap allocated memory)
- A resource is owned by a single instance of a resource-owning type (e.g. heap memory storing pixels is owned by a single `r96_image` instance)
- Prefer stack allocation over heap allocation
- Prefer value types over reference types

While we won't go for a full ["handles instead of pointers"](https://floooh.github.io/2018/06/17/handles-vs-pointers.html) for the `r96` library, we'll try to make our code as pointer- and allocation-free as possible.

How does this translate to the `r96` API?

1. Resource-owning types are initialized and disposed with corresponding initializer and disposal functions. E.g. `r96_image`, `r96_image_init()`, and `r96_image_dispose()`
2. Resource-owning types are always passed and returned by reference
3. Non-resource-owning types are initialized with [C99 designated initializers](https://gcc.gnu.org/onlinedocs/gcc-4.1.2/gcc/Designated-Inits.html)
4. Non-resource-owning types are passed to and returned from functions by value, unless performance considerations make it prohibitive

The first two rules make it less likely that two instances of a resource-owning type point to the same resource. The initialization and disposal functions give us a single location where a resource of a specific type is acquired and released, which helps with debugging.

The latter two rules make it more likely that we store much of our data on the stack instead of the heap (or as value types instead of reference types). Insert sad trombone that C doesn't have immutable types.

We'll try to stick with this until everything falls apart and we'll need to re-evaluate.

### Reading and writting pixels, the safe way

Previously, we've calculated pixel address manually. Let's wrap that functionality up in functions for writting and reading pixels to and from a `r96_image`:

--markdown-end
{{post.code("src/r96/r96.c", "c",
"
void r96_set_pixel(r96_image *image, int32_t x, int32_t y, uint32_t color) {
	if (x < 0 || x >= image->width || y < 0 || y >= image->height) return;
	image->pixels[x + y * image->width] = color;
}

uint32_t r96_get_pixel(r96_image *image, int32_t x, int32_t y) {
	if (x < 0 || x >= image->width || y < 0 || y >= image->height) return 0;
	return image->pixels[x + y * image->width];
}
"
)}}
--markdown-begin

Neither `r96_set_pixel()` nor `r96_get_pixel()` can assume that coordinates given to them are within the image bounds. We thus ensure that's the case. This is form of [clipping](https://en.wikipedia.org/wiki/Clipping_(computer_graphics)). Clipping will be a permanent, very annoying companion of ours throughout this journey.

> **Note:** the largest x-coordinate that's still within the bounds of the image is `width - 1`, the largest y-coordinate is `height - 1`. Missing that `-1` is a regular source of errors.

These functions are slower than manually calculating a pixel address, as they do more work. They'll still come in handy when we implement naive versions of more complex rendering algorithms. Once the naive implementation is working, we usually replace calls to these functions with inlined versions, such that we avoid per pixel clipping and possibly the multiplication in the address calculation.

### Demo app: drawing pixels, again

Let's put our new fancy API to use and create a new demo app called [`02_raster.c`](https://github.com/badlogic/r96/blob/dont-be-square-00/src/02_raster.c). It does pretty much the same thing as the last demo app, except it uses the new API.

--markdown-end
{{post.code("src/02_raster.c", "c",
`
#include <MiniFB.h>
#include <stdio.h>
#include "r96/r96.h"

int main(void) {
	r96_image image;
	r96_image_init(&image, 320, 240);
	struct mfb_window *window = mfb_open("02_image", image.width * 2, image.height * 2);
	do {
		for (int i = 0; i < 200; i++) {
			int32_t x = rand() % image.width;
			int32_t y = rand() % image.height;
			uint32_t color = R96_ARGB(255, rand() % 255, rand() % 255, rand() % 255);
			r96_set_pixel(&image, x, y, color);
		}

		if (mfb_get_mouse_button_buffer(window)[MOUSE_BTN_1]) {
			int32_t mouse_x = mfb_get_mouse_x(window);
			int32_t mouse_y = mfb_get_mouse_y(window);
			uint32_t color = r96_get_pixel(&image, mouse_x, mouse_y);
			printf("(%i, %i) = { alpha: %i, red: %i, green: %i, blue: %i }\n", mouse_x, mouse_y, R96_A(color), R96_R(color), R96_G(color), R96_B(color));
		}

		mfb_update_ex(window, image.pixels, image.width, image.height);
	} while (mfb_wait_sync(window));
	r96_image_dispose(&image);
	return 0;
}

`
)}}
--markdown-begin

In lines 6-8, we create a new `r96_image` instance and initialize it to have 320x240 pixels. We then create a window with twice the size of our image. MiniFB will scale our 320x240 pixels image up to the 640x480 window size in `mfb_update_ex()`. This way, it's easier to see what's going on.

The pixel rendering in line 14 now uses `r96_set_pixel()` instead of manually calculating the pixel address.

To exercise the new `r96_get_pixel()` function and the color component macros, we print the current color at the mouse position if the left mouse button is pressed (lines 17-22).

Finally, we dispose of the image in line 26.

Click the demo below to start it.

--markdown-end
<div style="display: flex; flex-direction: column; align-items: center; margin: 1em; max-width: 100%;">
	<canvas id="02_raster" style="width: 640px; height: 480px; background: black;"></canvas>
	<pre id="console" style="margin-top: 1em; width: 640px; height: 10ch; background: black; color: #bbbbbb; font-size: 14px; overflow: scroll;"></pre>
</div>
<script src="demo/r96_02_raster.js"></script>
<script>
	let started = false;
	let init = async () => {
		if (started) return;
		started = true;
		await r96_02_raster();
		let canvas = document.getElementById("02_raster")
		canvas.style.width = "640px";
		canvas.style.height = "480px";
	}
	document.getElementById("02_raster").addEventListener("click", () => init());
	let consoleDiv = document.getElementById("console");
	let oldLog = console.log;
	console.log = function(data) {
		oldLog(data);
		consoleDiv.innerHTML += data + "</br>";
		consoleDiv.scrollTop = consoleDiv.scrollHeight;
	}
</script>
--markdown-begin

Have a look at [`02_raster.html`](https://github.com/badlogic/r96/blob/dont-be-square-00/web/02_raster.html) to see the magic that gets the `printf()` output into the div below the canvas.

### Clearing an image

In real-time graphics, we usually clear the "screen" every time we start rendering a new frame. So far, we didn't have a need for this age old tradition, but we'll likely need it in the future.

In our case, the "screen" is really the `r96_image` we draw our pixels to which we later pass to `mfb_update_ex()` to have it displayed in a window.

Here are two functions to clear a `r96_image` with a specific color.

--markdown-end
{{post.code("r96.c", "c",
"
void r96_clear(r96_image *image) {
	memset(image->pixels, 0x0, image->width * image->height * sizeof(uint32_t));
}

void r96_clear_with_color(r96_image *image, uint32_t color) {
	uint32_t *pixels = image->pixels;
	for (int i = 0; i < image->width * image->height; i++)
		pixels[i] = color;
}
"
)}}
--markdown-begin

`r96_clear()` covers the common case of setting all pixels of an image to black. It uses `memset()`, which is heavily optimized and usually beats a hand-rolled loop.

`r96_clear_with_color()` lets us clear with an arbitrary color. As we loop through pixels individually, it will likely be quite a bit slower than the `memset()` based alternative above.

But by how much?

### Demo app: profiling and optimizing `r96_clear_with_color()`

While you can make some assumption about the performance of your code just by looking at it, you must always measure to ensure your assumptions hold. Profiling code is an art in itself, especially as your code becomes more complex.


Luckily, profiling `r96_clear()` and `r96_clear_with_color()` is comparatively trivial. All we need is a way to measure how much time has passed. MiniFB comes with a [high precision timer](https://github.com/emoon/minifb#timers-and-target-fps) we can use for that purpose.

Let's write a command line app called [`03_clear_profiling.c`](https://github.com/badlogic/r96/blob/dont-be-square-00/src/03_clear_profiling.c) that tests how fast `r96_clear()` and `r96_clear_with_color()` are:

--markdown-end
{{post.code("src/03_clear_profiling.c", "c",
`
#include <MiniFB.h>
#include <stdio.h>
#include "r96/r96.h"

int main(void) {
	const int num_iterations = 200000;
	r96_image image;
	r96_image_init(&image, 320, 240);
	struct mfb_timer *timer = mfb_timer_create();

	mfb_timer_reset(timer);
	for(int i = 0; i < num_iterations; i++)
		r96_clear(&image);
	printf("r96_clear() took %f secs\n", mfb_timer_delta(timer));

	mfb_timer_reset(timer);
	for(int i = 0; i < num_iterations; i++)
		r96_clear_with_color(&image, 0x0);
	printf("r96_clear_with_color() took %f secs\n", mfb_timer_delta(timer));

	r96_image_dispose(&image);
	return 0;
}
`
)}}
--markdown-begin

We create a 320x200 pixels image and a timer. As a base-line, we measure how long it takes to clear the image `200000` times using `r96_clear()`.

Then we measure how long it takes to do the same with `r96_clear_with_color()`.

We always profile our code using an optimized release build. Here's what I get on my machine:

--markdown-end
{{post.code("", "",
"
r96_clear()                 0.573491 secs
r96_clear_with_color()      4.833749 secs
"
)}}
--markdown-begin

That's absolutely not great! We assumed that manually looping through and setting the pixels is a bit slower than `memset()`. But 8.5x times slower? What is going on here?

Just looking at the code of `r96_clear_with_color()` doesn't really give us any hints how to improve it, so let's look at the (manually annotated) assembly code the compiler (in this case Clang taregting x86_64 on Linux) spits out for the function next to the original C code.

> **Note:** while you can get the assembly output straight from your compiler, I tend to use the [Godbolt Compiler Explorer](https://godbolt.org), an online C/C++ compiler and disassembler. Enter C/C++ code in the left side editor and you'll see the assembly output generated by the choosen compiler + flags combination on the right side. You can even [share your sketches](https://www.godbolt.org/z/Przd11aPe), so others can help improve things easily, without needing to set up a build environment.

--markdown-end
{{post.code("", "c",
"
void r96_clear_with_color(r96_image *image, uint32_t color) {
	uint32_t *pixels = image->pixels;
	for (int i = 0; i < image->width * image->height; i++)
		pixels[i] = color;
}
"
)}}

{{post.code("", "",
"
# rdi = *image
# rsi = color
r96_clear_with_color:
        mov     eax, dword ptr [rdi + 4]     # eax = image->width
        imul    eax, dword ptr [rdi]         # eax = image->height * image->width
        test    eax, eax                     # eax == 0?
        jle     .LBB1_3                      # yes, exit
        mov     r8, qword ptr [rdi + 8]      # r8 = pixels = image->pixels
        xor     ecx, ecx                     # ecx = i = 0
.LBB1_2:
        mov     dword ptr [r8 + 4*rcx], esi  # pixels[i] = color
        inc     rcx                          # i++
        movsxd  rdx, dword ptr [rdi]         # rdx = image->width
        movsxd  rax, dword ptr [rdi + 4]     # rax = image->height
        imul    rax, rdx                     # rax = image->width * image->height
        cmp     rcx, rax                     # i == image->width * image->height?
        jl      .LBB1_2                      # no, next pixel
.LBB1_3:
        ret
")
}}
--markdown-begin

`image` is passed to the function in `rdi`, the color is passed to the function in `rsi`.

Lines 2-5 multiply `image->height` (`[rdi + 4]`) by `image->width` (`[rdi]`), then check if the result is zero. If that's the case, we jump to `.LBB1_3` and exit the function. This is an early rejection test.

If the initial check passes, then `image->pixels` is loaded into the local variable `pixels` (`r8`) in line 6. In line 7 `i` (`ecx`) is set to zero. We are ready to iterate.

In line 9, we set `pixels[i]` (`[r8 + 4*rcx]`) to the `color` (`esi`). Then we increment `i` (`rcx`) in line 10.

In line 11 we load `image->width` into `rdx`, followed by loading `image->height` into `rax` in line 12, and multiply them in line `13`. The result ends up in `rax`.

`rax` is then compared to `i` (`rcx`). If it is less than `image->width * image->height` (`rax`), we jump back to `.LBB1_2` and write the next pixel, otherwise we fall through and exit the function.

Did you notice the problem?

Our loop condition `i < image->width * image->height` has been compiled to some rather sub-optimal machine code. Instead of calculating `image->width * image->height` once, it is calculated for every loop iteration! Not only does this mean the `width` and `height` fields of the image are fetched from memory every iteration, we also have an integer multiplication per iteration. That's not great!

Let's fix this by manually precalculating `image->width * image->height`, thereby helping the compiler out a little:

--markdown-end
{{post.code("", "c",
"
void r96_clear_with_color(r96_image *image, uint32_t color) {
	uint32_t *pixels = image->pixels;
	for (int i = 0, n = image->width * image->height; i < n; i++)
		pixels[i] = color;
}
"
)}}
--markdown-begin

Before looking at the assembly code, let's run this and see if we improved things:

--markdown-end
{{post.code("", "",
"
r96_clear()                 0.633761 secs
r96_clear_with_color()      0.761754 secs
"
)}}
--markdown-begin

Much better. We are now in the same ballpark as the `memset()` based `r96_clear()`. What did the compiler do? Hold on to your butts:

--markdown-end
{{post.code("", "",
`
r96_clear_with_color:                   # @r96_clear_with_color
        mov     ecx, dword ptr [rdi + 4]
        imul    ecx, dword ptr [rdi]
        test    ecx, ecx
        jle     .LBB1_12
        mov     rax, qword ptr [rdi + 8]
        mov     r9d, ecx
        cmp     ecx, 8
        jae     .LBB1_3
        xor     edx, edx
        jmp     .LBB1_11
.LBB1_3:
        mov     edx, r9d
        and     edx, -8
        movd    xmm0, esi
        pshufd  xmm0, xmm0, 0                   # xmm0 = xmm0[0,0,0,0]
        lea     rcx, [rdx - 8]
        mov     rdi, rcx
        shr     rdi, 3
        inc     rdi
        mov     r8d, edi
        and     r8d, 3
        cmp     rcx, 24
        jae     .LBB1_5
        xor     ecx, ecx
        jmp     .LBB1_7
.LBB1_5:
        and     rdi, -4
        xor     ecx, ecx
.LBB1_6:                                # =>This Inner Loop Header: Depth=1
        movdqu  xmmword ptr [rax + 4*rcx], xmm0
        movdqu  xmmword ptr [rax + 4*rcx + 16], xmm0
        movdqu  xmmword ptr [rax + 4*rcx + 32], xmm0
        movdqu  xmmword ptr [rax + 4*rcx + 48], xmm0
        movdqu  xmmword ptr [rax + 4*rcx + 64], xmm0
        movdqu  xmmword ptr [rax + 4*rcx + 80], xmm0
        movdqu  xmmword ptr [rax + 4*rcx + 96], xmm0
        movdqu  xmmword ptr [rax + 4*rcx + 112], xmm0
        add     rcx, 32
        add     rdi, -4
        jne     .LBB1_6
.LBB1_7:
        test    r8, r8
        je      .LBB1_10
        lea     rcx, [rax + 4*rcx]
        add     rcx, 16
        shl     r8, 5
        xor     edi, edi
.LBB1_9:                                # =>This Inner Loop Header: Depth=1
        movdqu  xmmword ptr [rcx + rdi - 16], xmm0
        movdqu  xmmword ptr [rcx + rdi], xmm0
        add     rdi, 32
        cmp     r8, rdi
        jne     .LBB1_9
.LBB1_10:
        cmp     rdx, r9
        je      .LBB1_12
.LBB1_11:                               # =>This Inner Loop Header: Depth=1
        mov     dword ptr [rax + 4*rdx], esi
        inc     rdx
        cmp     r9, rdx
        jne     .LBB1_11
.LBB1_12:
        ret
`
)}}
--markdown-begin

The compiler basically generated a 32-bit version of a highly optimized `memset()` implementation. We could spend an hour dissecting it to precisely understand what's going on. But why question the compiler's wisdom? The take away:

> Always precalculate as much as you can for your inner loops, including values used in your loop condition. The compiler can not always figure out [loop invariants](https://en.wikipedia.org/wiki/Loop_invariant).

## Drawing horizontal lines

With our housekeeping out of the way, it's time to get back to the actual goal of this post: drawing rectangles. But first, we need to learn how to draw horizontal lines. Teheh.

We define a horizontal line by a start point `(x1, y)` and an end point `(x2, y)`, where `x1 <= x2`. Since it's a horizontal line, the y-coordinate is the same for both points. The line covers all the pixels including and in-between the start and end point.

> **Note:** Translating a "mathematical" representation of something to pixels on a raster is what's actually called "rasterization". An infinitely precise thing is boiled down to and approximated by a bunch of colored squares in a grid.

A few example horizontal lines on a small 16x12 raster.

--markdown-end
<div id="hline-example"></div>
<script>
{
let resX = 800; resY = 650;
let q5 = q5Diagram(resX, resY, "hline-example");

q5.grid(2, 2, 16, 12, "#bbb");

q5.textSize(12)
for (let x = 0; x < 16; x++) q5.blockText("" + x, x + 2, 1, "#ddd");
for (let y = 0; y < 12; y++) q5.blockText("" + y, 1, y + 2, "#ddd");

q5.textSize(14)
for (let x = 0; x <= 3; x++) q5.block(x, 0, "#00e");
q5.blockText("(x1, y)", 0, 0, "#ddd")
q5.blockText("(x2, y)", 3, 0, "#ddd")

for (let x = 18; x <= 19; x++) q5.block(x, 8, "#e00");
q5.blockText("(x1, y)", 18, 8, "#ddd")
q5.blockText("(x2, y)", 19, 8, "#ddd")

for (let x = 0; x <= 1; x++) q5.block(x, 12, "#e00");
q5.blockText("(x1, y)", 0, 12, "#ddd")
q5.blockText("(x2, y)", 1, 12, "#ddd")

for (let x = 8; x <= 12; x++) q5.block(x, 15, "#00e");
q5.blockText("(x1, y)", 8, 15, "#ddd")
q5.blockText("(x2, y)", 12, 15, "#ddd")

for (let x = 3; x <= 10; x++) q5.block(x, 5, "#070");
q5.blockText("(x1, y)", 3, 5, "#ddd")
q5.blockText("(x2, y)", 10, 5, "#ddd")

for (let x = 8; x <= 10; x++) q5.block(x, 9, "#070");
q5.blockText("(x1, y)", 8, 9, "#ddd")
q5.blockText("(x2, y)", 10, 9, "#ddd")

for (let x = 0; x <= 18; x++) q5.block(x, 3, "#e0e");
q5.blockText("(x1, y)", 0, 3, "#ddd")
q5.blockText("(x2, y)", 18, 3, "#ddd")

for (let x = 14; x <= 18; x++) q5.block(x, 12, "#e0e");
q5.blockText("(x1, y)", 14, 12, "#ddd")
q5.blockText("(x2, y)", 18, 12, "#ddd")
}
</script>

<p>
	Some of the lines are "problematic", as they aren't entirely inside the raster. Before we can draw their pixels, we need to clip them!
</p>

<p>
	The two <span style="color: rgb(41, 41, 255)">blue</span> lines have y-coordinates `y &lt; 0` and `y &gt; height - 1`. Any horizontal line with a y-coordinate outside the raster can be entirely ignored.
<p>
	The two <span style="color: red">red</span> lines share a similar fate. They are outside the raster on the x-axis. Any horizontal line with either `x2 < 0` or `x1 > width - 1` can be entirely ignored.
</p>

<p>
	The two <span style="color: green">green</span> lines are all good. Both their endpoints are inside the raster.
</p>

<p>
	The <span style="color: #e0e">pink</span> lines are ... weird. They are partially inside the raster. How do we deal with them? We clip them! For the left point, we snap `x1` to `0`. For the right point, we snap `x2` to `width - 1`. Here are all the pixels we actually have to draw.
</p>

<div id="hline-example-clipped"></div>
<script>
{
let resX = 760; resY = 560;
let q5 = q5Diagram(resX, resY, "hline-example-clipped");

q5.translate(-20, 0);
q5.grid(2, 1, 16, 12, "#bbb");

q5.textSize(12)
for (let x = 0; x < 16; x++) q5.blockText("" + x, x + 2, 0, "#ddd");
for (let y = 0; y < 12; y++) q5.blockText("" + y, 1, y + 1, "#ddd");

q5.textSize(14)

for (let x = 3; x <= 10; x++) q5.block(x, 4, "#070");
q5.blockText("(x1, y)", 3, 4, "#ddd")
q5.blockText("(x2, y)", 10, 4, "#ddd")

for (let x = 8; x <= 10; x++) q5.block(x, 8, "#070");
q5.blockText("(x1, y)", 8, 8, "#ddd")
q5.blockText("(x2, y)", 10, 8, "#ddd")

for (let x = 2; x <= 17; x++) q5.block(x, 2, "#e0e");
q5.blockText("(x1', y)", 2, 2, "#ddd")
q5.blockText("(x2', y)", 17, 2, "#ddd")

for (let x = 14; x <= 17; x++) q5.block(x, 11, "#e0e");
q5.blockText("(x1, y)", 14, 11, "#ddd")
q5.blockText("(x2', y)", 17, 11, "#ddd")
}
</script>
--markdown-begin

Once we've clipped a line, we just need to draw all the pixels between and including its start and end points.

### Demo app: horizontal lines, naive version

Let's add a new demo app called [`04_hline.c`](https://github.com/badlogic/r96/blob/dont-be-square-00/src/04_hline.c):

--markdown-end
{{post.code("src/04_hline.c", "c",
`
#include <MiniFB.h>
#include <stdio.h>
#include "r96/r96.h"

void hline(r96_image *image, int32_t x1, int32_t x2, int32_t y, uint32_t color) {
	if (x1 > x2) {
		int32_t tmp = x2;
		x2 = x1;
		x1 = tmp;
	}

	if (x1 >= image->width) return;
	if (x2 < 0) return;
	if (y < 0) return;
	if (y >= image->height) return;

	if (x1 < 0) x1 = 0;
	if (x2 >= image->width) x2 = image->width - 1;

	for (int32_t x = x1; x <= x2; x++)
		r96_set_pixel(image, x, y, color);
}

int main(void) {
	r96_image image;
	r96_image_init(&image, 320, 240);
	struct mfb_window *window = mfb_open("04_hline", image.width * 2, image.height * 2);
	struct mfb_timer *timer = mfb_timer_create();
	do {
		srand(0);
		mfb_timer_reset(timer);
		for (int i = 0; i < 200000; i++) {
			uint32_t color = R96_ARGB(255, rand() % 255, rand() % 255, rand() % 255);
			hline(&image, rand() % image.width, rand() % image.width, rand() % image.height, color);
		}
		printf("Took: %f\n", mfb_timer_delta(timer));

		if (mfb_update_ex(window, image.pixels, image.width, image.height) < 0) break;
	} while (mfb_wait_sync(window));
	r96_image_dispose(&image);
	return 0;
}
`
)}}
--markdown-begin

The `hline()` function first ensures that `x1 < x2` in lines 6-10. This is absolutely necessary, as our clipping rules above only work under that condition.

In lines 12-15, we reject all lines that are entirely outside the image, applying the rules we established above for the blue and red lines

Lines that are partially inside the image get clipped in lines 17-18.

With all the clipping out of the way, we know that the start and end point (and the pixels between them) are entirely within the bounds of the image.

We finish the function by drawing all the pixels at and in between the start and end point in lines 20-21 using `r96_set_pixel()`.

In the `main()` function, we draw `200000` lines at random positions and measure how long it takes to do so. The call to `srand()` sets the seed for the function `rand()`. We'll always get the same sequence of "random" numbers that way. If we measure something to later improve it, we have to ensure that what you measured is the same each time, even if it involves "fake" randomness. Here's the output from a release build on my machine:

--markdown-end
{{post.code("", "bash",
"
Took: 0.032682
Took: 0.033261
Took: 0.032935
Took: 0.032707
")}}
--markdown-begin

Not a scientific benchmark, but good enough as a ballpark estimate. This time, we have no base-line to compare against. So, let's take this version of `hline()` and see if we can improve upon it!

### Demo app: horizontal lines, optimized

Looking real hard at the `hline()` implementation, the only thing that stands out is the call to `r96_set_pixel()`. What's that do again?

--markdown-end
{{post.code("src/r96/r96.c", "c",
"
void r96_set_pixel(r96_image *image, int32_t x, int32_t y, uint32_t color) {
	if (x < 0 || x >= image->width || y < 0 || y >= image->height) return;
	image->pixels[x + y * image->width] = color;
}
"
)}}
--markdown-begin

Oh right, it actually does clipping and it calculates the address of the pixel, which adds an addition and multiplication to our inner loop in `hline()`. That's not good!

The `hline()` function already ensures that all pixels we are drawing are inside the raster. The extra clipping in `r96_set_pixel()` is thus unnecessary.

And once we know the address of the start pixel at `x1, y`, the address of each subsequent pixel on the line can be calculated by continuously incrementing the address by `1`. Remember: pre-calculate all loop invariants and do as little work in inner loops as possible!

Here's the optimized `hline()` version from [`05_hline_opt.c`](https://github.com/badlogic/r96/blob/dont-be-square-00/src/05_hline_opt.c):

--markdown-end
{{post.code("src/05_hline_opt.c", "c",
`
void hline(r96_image *image, int32_t x1, int32_t x2, int32_t y, uint32_t color) {
	if (x1 > x2) {
		int32_t tmp = x2;
		x2 = x1;
		x1 = tmp;
	}

	if (x1 >= image->width) return;
	if (x2 < 0) return;
	if (y < 0) return;
	if (y >= image->height) return;

	if (x1 < 0) x1 = 0;
	if (x2 >= image->width) x2 = image->width - 1;

	uint32_t *pixels = image->pixels + y * image->width + x1;
	int32_t num_pixels = x2 - x1 + 1;
	while(num_pixels--) {
		*pixels++ = color;
	}
}
`
)}}
--markdown-begin

We keep all the clipping from before, but are a bit smarter regarding our inner loop.

We precalculate the address of the pixel at coordinates `(x1, y)` in line 16. We also precalculate the number of pixels we are going draw in line 17.

The inner loop then counts down the number of pixels, while assigning the color to the current pixel and incremening the address by one. Pretty tight. On my machine, I get these timings:

--markdown-end
{{post.code("", "bash",
"
Took: 0.011275
Took: 0.011216
Took: 0.011437
Took: 0.011545
")}}
--markdown-begin

A nice improvement! Let's have some live lines to celebrate (click to start)

--markdown-end
<div style="display: flex; flex-direction: column; align-items: center; margin: 1em; max-width: 100%;">
	<canvas id="05_hline_opt" style="width: 640px; height: 480px; background: black;"></canvas>
	<pre id="console2" style="margin-top: 1em; width: 640px; height: 10ch; background: black; color: #bbbbbb; font-size: 14px; overflow: scroll;"></pre>
</div>
<script src="demo/r96_05_hline_opt.js"></script>
<script>
{
	let started = false;
	let init = async () => {
		if (started) return;
		started = true;
		let consoleDiv = document.getElementById("console2");
        let module = {};
        module.print = module.printErr = (data) => {
            console.log(data);
            consoleDiv.innerHTML += data + "</br>";
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
        }
		await r96_05_hline_opt(module);
	}
	document.getElementById("05_hline_opt").addEventListener("click", () => init());
}
</script>
--markdown-begin

## Drawing rectangles

We define a rectangle by its top left corner point `(x1, y1)` and its bottom right corner point `(x2, y2)`, where `x1 <= x2` and `y1 <= x2`. The rectangle covers all pixels `(x, y)`, where `x1 <= x <= x2` and `y1 <= y <= y2`.

Alternatively, we can define a rectangle by its top left corner point `(x1, y1)` and a positive `width` and `height` given in pixels. We can derrive `(x2, y2)` from this information, as `x2 = x1 + width - 1` and `y2 = y1 + height - 1`.

> **Note:** And there it is, again. Our good friend `-1`. Can you figure out why it's needed to calculate `x2` and `y2` from `x1`, `y1`, `width`, and `height`?

As with horizontal lines, it pays off to first check out the clipping cases:



Discuss this post on [Twitter]() or [Mastodon]().

--markdown-end
<script>tableOfContents()</script>

{{include "../../../_templates/post_footer.bt.html"}}