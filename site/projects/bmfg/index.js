import FreeTypeInit from "https://cdn.jsdelivr.net/npm/freetype-wasm@0/dist/freetype.js";
const Freetype = await FreeTypeInit();
let face = null;
let fontLoaded = false;

let fileInput = document.querySelector("#file");
fileInput.onchange = async function () {
    let reader = new FileReader();
    reader.onload = async function () {
        loadFont(this.result);
    }
    reader.readAsArrayBuffer(fileInput.files[0]);

}
document.querySelector("#load").onclick = () => fileInput.click();

let fontHeight = document.querySelector("#height");
fontHeight.onchange = () => {
    if (fontLoaded) {
        drawFreeType();
    }
}

async function loadFont(urlOrBuffer) {
    if (face != null) {
        Freetype.UnloadFont(face.family_name);
    }

    let buffer = null;
    if (typeof (urlOrBuffer) == "string") {
        let font = await fetch(urlOrBuffer);
        buffer = new Uint8Array(await font.arrayBuffer());
    } else {
        buffer = new Uint8Array(urlOrBuffer);
    }
    face = Freetype.LoadFontFromBytes(buffer)[0];
    const ftFont = Freetype.SetFont(face.family_name, face.style_name);

    fontLoaded = true;
    drawFreeType();
}

async function updateCache(cache) {
    const codes = [];
    for (let c = 32; c < 255; c++) {
        codes.push(c);
    }

    const newGlyphs = Freetype.LoadGlyphs(codes, Freetype.FT_LOAD_RENDER);
    for (const [code, glyph] of newGlyphs) {
        const char = String.fromCodePoint(code);
        let bitmap = null;
        if (glyph.bitmap.imagedata) {
            let pixels = glyph.bitmap.imagedata.data;
            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] == 255) {
                    pixels[i] = pixels[i + 1] = pixels[i + 2] = 255;
                }
            }
            bitmap = await createImageBitmap(glyph.bitmap.imagedata);
        }

        cache.set(char, {
            glyph,
            bitmap: bitmap
        });
    }
}

async function drawString(ctx, str, offsetx, offsety, cache) {
    let prev = null;
    for (const char of str) {
        const { glyph, bitmap } = cache.get(char) || {};
        if (glyph) {
            if (bitmap) {
                ctx.drawImage(
                    bitmap,
                    offsetx + glyph.bitmap_left,
                    offsety - glyph.bitmap_top
                );
            }

            offsetx += glyph.advance.x >> 6;
            prev = glyph;
        }
    }
}

async function drawFreeType() {
    const size = Freetype.SetPixelSize(0, fontHeight.value);
    const cmap = Freetype.SetCharmap(Freetype.FT_ENCODING_UNICODE);
    let cache = new Map();
    await updateCache(cache);
    let canvas = document.querySelector("#output");
    let ctx = canvas.getContext("2d");

    let charWidth = size.max_advance >> 6;
    let charHeight = size.height >> 6;
    let info = document.querySelector("#info");
    info.textContent = charWidth + "x" + charHeight;

    canvas.width = charWidth * 16;
    canvas.height = charHeight * 14;
    let c = 32
    ctx.fillStyle = "white";
    ctx.strokeStyle = "red";

    for (let y = 0; y < 14; y++) {
        let cStr = "";
        for (let i = 0; i < 16 && c <= 255; i++, c++) {
            cStr += c < 31 || (c >= 128 && c < 160) ? " " : String.fromCodePoint(c);
        }
        await drawString(ctx, cStr, 0, (y + 1) * charHeight + (size.descender >> 6), cache);

        // for (let x = 0; x < 16; x++) {
        //     ctx.rect(x * charWidth, y * charHeight, charWidth, charHeight);
        //     ctx.stroke()
        // }
    }
}

loadFont("./ibm_vga8.ttf");