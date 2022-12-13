{{
metadata = {
	title: "Rendering like it's 1996 - Image file loading and blitting",
	summary: "Load image files and blit them to the screen.",
	image: "amiga500.jpeg",
	date: parseDate("2022/12/15 21:00"),
	published: false,
}
}}

{{include "../../../_templates/post_header.bt.html"}}
{{include "../../../_templates/post_header.bt.html" as post}}

{{post.figure("amiga500.jpeg", "Niklas Therning's beige plastic god. Has a fast blitter too!")}}

<div class="table_of_contents"></div>

--markdown-begin

[Last time](../dont-be-square/), we drew some horizontal lines and rectangles, and figured out some general optimization approaches. Today, we're going to read files, load images, and draw the images to the screen!

As usual, we'll do some house keeping first.

## Simplifying the CMake build
Look at the [CMakeLists.txt](https://github.com/badlogic/r96/blob/dont-be-square-00/CMakeLists.txt) file. Here's an excerpt:

--markdown-end
{{post.code("CMakeLists.txt", "cmake",
`
add_executable(r96_00_basic_window "src/00_basic_window.c")
target_link_libraries(r96_00_basic_window LINK_PUBLIC minifb r96)

add_executable(r96_01_drawing_a_pixel "src/01_drawing_a_pixel.c")
target_link_libraries(r96_01_drawing_a_pixel LINK_PUBLIC minifb r96)

add_executable(r96_02_image "src/02_image.c")
target_link_libraries(r96_02_image LINK_PUBLIC minifb r96)

add_executable(r96_03_clear_profiling "src/03_clear_profiling.c")
target_link_libraries(r96_03_clear_profiling LINK_PUBLIC minifb r96)

add_executable(r96_04_hline "src/04_hline.c")
target_link_libraries(r96_04_hline LINK_PUBLIC minifb r96)

add_executable(r96_05_hline_opt "src/05_hline_opt.c")
target_link_libraries(r96_05_hline_opt LINK_PUBLIC minifb r96)

add_executable(r96_06_rect "src/06_rect.c")
target_link_libraries(r96_06_rect LINK_PUBLIC minifb r96)

add_executable(r96_07_rect_opt "src/07_rect_opt.c")
target_link_libraries(r96_07_rect_opt LINK_PUBLIC minifb r96)

...

	add_dependencies(r96_00_basic_window r96_web_assets)
    target_link_options(r96_00_basic_window PRIVATE "-sEXPORT_NAME=r96_00_basic_window")

    add_dependencies(r96_01_drawing_a_pixel r96_web_assets)
    target_link_options(r96_01_drawing_a_pixel PRIVATE "-sEXPORT_NAME=r96_01_drawing_a_pixel")

    add_dependencies(r96_02_image r96_web_assets)
    target_link_options(r96_02_image PRIVATE "-sEXPORT_NAME=r96_02_image")

    add_dependencies(r96_04_hline r96_web_assets)
    target_link_options(r96_04_hline PRIVATE "-sEXPORT_NAME=r96_04_hline")

    add_dependencies(r96_05_hline_opt r96_web_assets)
    target_link_options(r96_05_hline_opt PRIVATE "-sEXPORT_NAME=r96_05_hline_opt")

    add_dependencies(r96_06_rect r96_web_assets)
    target_link_options(r96_06_rect PRIVATE "-sEXPORT_NAME=r96_06_rect")

    add_dependencies(r96_07_rect_opt r96_web_assets)
    target_link_options(r96_07_rect_opt PRIVATE "-sEXPORT_NAME=r96_07_rect_opt")
`)}}
--markdown-begin

Adding a new demo is very tedious. We keep repeating ourselves, so let's fix that.

We start by cleaning-up all our targets:

--markdown-end
{{post.code("CMakeLists.txt", "cmake",`
add_library(r96 "src/r96/r96.c")
add_executable(r96_00_basic_window "src/00_basic_window.c")
add_executable(r96_01_drawing_a_pixel "src/01_drawing_a_pixel.c")
add_executable(r96_02_image "src/02_image.c")
add_executable(r96_03_clear_profiling "src/03_clear_profiling.c")
add_executable(r96_04_hline "src/04_hline.c")
add_executable(r96_05_hline_opt "src/05_hline_opt.c")
add_executable(r96_06_rect "src/06_rect.c")
add_executable(r96_07_rect_opt "src/07_rect_opt.c")
add_executable(r96_08_image_file "src/08_image_file.c")
add_executable(r96_09_blit "src/09_blit.c")
add_executable(r96_10_blit_keyed "src/10_blit_keyed.c")

add_custom_target(r96_assets
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${CMAKE_CURRENT_SOURCE_DIR}/assets
    ${CMAKE_CURRENT_BINARY_DIR}/assets
)

add_custom_target(r96_web_assets
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${CMAKE_CURRENT_SOURCE_DIR}/web
    ${CMAKE_CURRENT_BINARY_DIR}
)
`)}}
--markdown-begin

How nice! Each demo target is a single line that just specifies its name and the source file(s) its made from.

I also moved the `r96_web_assets` target, responsible for copying all `web/*.html` to the build folder, to the top level. And I added a new target called `r96_assets`. It copies anything in the `assets/` folder to the build folder.

Why do we need that? Going forward, we'll not just generate our data programmatically, but we'll also want to load image files and other data from disk. Any such assets will go in the `assets/` folder, and the target makes sure they will be available in the `build/` folder as well.

We also need to link the `minifb` and `r96`library targets to each demo target. And every demo target should depend on the `r96_assets` and `r96_web_assets` targets, so we'll always have up-to-date asset files in the build folder. And if we build with Emscripten, we also need to set linker options, including the `EXPORT_NAME` by which we can resolve the WASM module in JavaScript.

A lot of the repetitiveness in the old `CMakeLists.txt` file came from specifying all that information for every target over and over again. No more! Behold!

--markdown-end
{{post.code("CMakeLists.txt", "cmake",`
get_property(targets DIRECTORY "${_dir}" PROPERTY BUILDSYSTEM_TARGETS)
list(REMOVE_ITEM targets minifb r96 r96_assets r96_web_assets)
foreach(target IN LISTS targets)
    target_link_libraries(${target} LINK_PUBLIC minifb r96)
    add_dependencies(${target} r96_assets)
    if(EMSCRIPTEN)
        add_dependencies(${target} r96_web_assets)
        target_link_options(${target} PRIVATE
                "-sSTRICT=1"
                "-sENVIRONMENT=web"
                "-sLLD_REPORT_UNDEFINED"
                "-sMODULARIZE=1"
                "-sALLOW_MEMORY_GROWTH=1"
                "-sALLOW_TABLE_GROWTH"
                "-sMALLOC=emmalloc"
                "-sEXPORT_ALL=1"
                "-sEXPORTED_FUNCTIONS=[\"_malloc\",\"_free\",\"_main\"]"
                "-sASYNCIFY"
                "--no-entry"
                "-sEXPORT_NAME=${target}"
        )
    endif()
endforeach()
`)}}
--markdown-begin

Recent CMake versions let us list all targets that have been defined in some directory. We do that in the first line and assign the list to `targets`.

Next, we remove the all the non-demo targets from that list.

We then iterate through the remaining demo targets and link them with `minifb` and `r96` and make them depend on the `r96_assets` target. If we build with Emscripten, we also add the `r96_web_assets` target as a dependency, and set the additional linker options needed for Emscripten, including the `EXPORT_NAME` which is just the demo target name.

And bam, we are down from 95 gruesome lines of CMake, to 73. Even better: to add a new demo, we just need to add an `add_executable()` line, specifying the target name and the source file(s) and we're done. Very nice. On with more interesting things.

## Reading files from disk (or URL)
If you've done any file I/O in C previously, you'll likely know where we'll be going: [`fopen()`](https://man7.org/linux/man-pages/man3/fopen.3.html) and friends. That's mostly cross-platform, and we could even [use `fopen()` with Emscripten](https://emscripten.org/docs/getting_started/Tutorial.html#using-files).

But that comes with a few things I don't want: a virtual filesystem and quite an increase in size of the WASM module, as Emscripten will link in a bunch of stuff we won't really need.

So let's role our own file reading! We want to specify a file path and get a bunch of bytes back. We also want to know how many bytes have been read. And we want to wrap that raw pointer to the memory block that holds the read bytes in a resource type. Let's call that type [`r96_byte_buffer`](https://github.com/badlogic/r96/blob/blistering-fast-blits-00/src/r96/r96.h#L22):

--markdown-end
{{post.code("r96.h", "c", `
typedef struct r96_byte_buffer {
	uint8_t *bytes;
	size_t num_bytes;
} r96_byte_buffer;
`)}}
--markdown-begin

And here's the API to work with `r96_byte_buffer` instances, following the principles we've established last time:

--markdown-end
{{post.code("r96.h", "c", `
void r96_byte_buffer_init(r96_byte_buffer *buffer, size_t size);

bool r96_byte_buffer_init_from_file(r96_byte_buffer *buffer, const char *path);

void r96_byte_buffer_dispose(r96_byte_buffer *buffer);
`)}}
--markdown-begin

`r96_byte_buffer_init()` can be used if we want to allocate `num_bytes` bytes and keep track of both the ponter and the length of the buffer. We dispose `r96_byte_buffer` instances via, you guessed it, `r96_byte_buffer_dispose()`. I spare you the [implementation details](https://github.com/badlogic/r96/blob/blistering-fast-blits-00/src/r96/r96.c#LL14-L17C2).

The interesting one is `r96_byte_buffer_init_from_file()`. We need two implementations: one for the desktop and one for the web. Here's the desktop version:

--markdown-end
{{post.code("r96.c", "c", `
#ifndef __EMSCRIPTEN__
bool r96_byte_buffer_init_from_file(r96_byte_buffer *buffer, const char *path) {
	*buffer = (r96_byte_buffer){0};
	FILE *file = fopen(path, "rb");
	if (!file) return false;

	if (fseek(file, 0, SEEK_END)) goto _error;
	long int num_bytes = ftell(file);
	if (num_bytes == -1) goto _error;
	if (fseek(file, 0, SEEK_SET)) goto _error;

	buffer->num_bytes = num_bytes;
	buffer->bytes = R96_ALLOC_ARRAY(uint8_t, buffer->num_bytes);
	if (fread(buffer->bytes, sizeof(uint8_t), buffer->num_bytes, file) != buffer->num_bytes) goto _error;

	fclose(file);
	return true;

_error:
	fclose(file);
	if (buffer->bytes) R96_FREE(buffer);
	buffer->num_bytes = 0;
	return false;
}
#else
`)}}
--markdown-begin

Unceremonious with a creative use of `goto`. It will do. The real interesting bit is the Emscripten/web implementation, which will be used when `__EMSCRIPTEN__` is defined:

--markdown-end
{{post.code("r96.c", "c", `
#include <emscripten.h>

EM_ASYNC_JS(uint8_t *, load_file, (const char *path, size_t *size), {
	let url = "./" + UTF8ToString(path);
	let response = await fetch(url);
	if (!response.ok) return 0;
	let data = new Uint8Array(await response.arrayBuffer());
	let ptr = _malloc(data.byteLength);
	HEAPU8.set(data, ptr);
	HEAPU32[size >> 2] = data.byteLength;
	return ptr;
})

bool r96_byte_buffer_init_from_file(r96_byte_buffer *buffer, const char *path) {
	buffer->bytes = load_file(path, &buffer->num_bytes);
	return buffer->bytes != NULL;
}
#endif
`)}}
--markdown-begin

OK, there's JavaScript code in our C. We got to be strong now. It's how we can interact with the JavaScript world from our pristine C.

The [`EM_ASYNC_JS()`](https://emscripten.org/docs/porting/asyncify.html#making-async-web-apis-behave-as-if-they-were-synchronous) macro takes a function signature split up into return type, function name, and argument list, and the JavaScript implementation of the function. The macro will then generate a sort of trampoline that will call the JavaScript function from within WASM. The arguments are all passed as JavaScript numbers. And return values are numbers too.

The `_ASYNC_` part means, that the JavaScript function we define can use JavaScript's `await`, which will pause execution until the promise we wait for resolves. For our C code, it will look like `r96_byte_buffer_init()` is blocking. In reality, we hand back control to the browser, which will asynchronously download the data from the url (`path`).

The implementation itself resolves the passed in pointer `path` to a JavaScript string. We then throw that at [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) as a URL relative to the URL the WASM module is being run from. `fetch()` will asynchronously download the content from that URL. We then allocate memory on the WASM heap through `_malloc()` and copy the downloaded content over. Then we set the number of read bytes to the memory location specified by `size` and return the pointer. Pretty straight forward!

In the `r96_byte_buffer_init_from_file()` we just call this fancy JavaScript function, which sets up the `r96_byte_buffer` based on the data returned from JavaScript. Fancy. Let's load some images.

## Loading images
If we had a more masochist streak, we'd now be delving into image file formats and write a custom parser. Luckily for us, someone else has already done all the work, and we'll just stand on those particular giant's shoulders. [Sean Barrett](https://nothings.org/) has created an impressive set of [header-only file libraries](https://github.com/nothings/stb), which are easy to use and small.

[stb_image](https://github.com/nothings/stb/blob/master/stb_image.h) is the go-to solution for light-weight image loading. I've copied the header file to `src/r96/`, then included it in `src/r96.c` as per the "installation" instructions:

--markdown-end
{{post.code("src/r96/r96.c", "c", `
#define STBI_NO_STDIO
#define STBI_NO_HDR
#define STBI_NO_LINEAR
#define STBI_ONLY_JPEG
#define STBI_ONLY_PNG
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
`)}}
--markdown-begin

The last two lines would actually suffice, but we want our binaries to be as minimal as they can be. I thus disable usage of `stdio.h` APIs (we have our own file reading API now), HDR, and specify that we only want JPEG and PNG support. Finally, we define `STB_IMAGE_IMPLEMENTATION` and include the header, which will pull in all the function declarations and their definitions into `r96.c`. That's it!

And here's how we load image files into `r96_image`:

--markdown-end
{{post.code("src/r96/r96.c", "c", `
bool r96_image_init_from_file(r96_image *image, const char *path) {
	r96_byte_buffer buffer;
	if (!r96_byte_buffer_init_from_file(&buffer, path)) return false;
	image->pixels = (uint32_t *) stbi_load_from_memory(buffer.bytes, buffer.num_bytes, &image->width, &image->height, NULL, 4);
	r96_byte_buffer_dispose(&buffer);
	if (image->pixels == NULL) return false;
	return true;
}
`)}}
--markdown-begin

The new-fangled `r96_image_init_from_file()` takes an `r96_image` and a file path. We load the file contents via `r96_byte_buffer_init_from_file()`, then call `stbi_load_memory()` to decode the encoded image data to raw ARGB pixels, which get stored in the `r96_image` instance. If the image isn't ARGB, `stb_image` will helpfully convert it to that format for us.

## Demo: Loading images from files
Time for a new demo. I've added our first asset file `doom-grunt.png` to the `assets/` folder. Remember this little guy?

<img src="doom-grunt.png" style="margin: auto;"></img>

We can't really draw images yet, so we'll write a little terminal app called [`08_image_file.c`](https://github.com/badlogic/r96/blob/blistering-fast-blits-00/src/08_image_file.c) that loads the image and spits out its dimensions:

--markdown-end
{{post.code("src/08_image_file.c", "c", `
#include <stdio.h>
#include "r96/r96.h"

int main(void) {
    r96_image image;
    if (!r96_image_init_from_file(&image, "assets/doom-grunt.png")) {
        printf("Couldn't load file 'assets/doom-grunt.png'\n");
        return -1;
    }
    printf("Loaded file 'assets/doom-grunt.png', %ix%i pixels\n", image.width, image.height);
    r96_image_dispose(&image);
    return 0;
}
`)}}
--markdown-begin

Which, as expected, spits out `Loaded file 'assets/doom-grunt.png', 64x64 pixels`, both on the desktop and the web. Let's check if the pixels we loaded actually look like our little buddy above.

## Blitting images

Discuss this post on [Twitter]() or [Mastodon]().

--markdown-end
<script>tableOfContents()</script>

{{include "../../../_templates/post_footer.bt.html"}}