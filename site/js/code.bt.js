{{include raw "_highlight.min.js"}}
{{include raw "_highlightjs-line-numbers.min.js"}}
{{include raw "_q5.min.js"}}

hljs.highlightAll();
hljs.initLineNumbersOnLoad();

{{if reloadWS}}
var url = window.location;
new WebSocket("ws://" + url.host + "/api/reloadws").onmessage = function () {
	location.reload();
}
{{end}}

function tableOfContents() {
	let content = document.getElementsByClassName("post_content")[0];
	let headers = content.querySelectorAll("h1,h2,h3,h4,h5");
	if (headers.length == 0) return;

	let toc = document.getElementsByClassName("table_of_contents")[0];

	let tocHeader = document.createElement("div");
	tocHeader.innerText = "Table of contents"
	toc.appendChild(tocHeader);
	for (let header of headers) {
		let text = header.textContent;
		header.id = text;
		let tocEntry = document.createElement("a");
		tocEntry.href = "#" + text;
		tocEntry.innerText = "- " + text;

		let indent = (header.tagName.charAt(1) - '1') * 28;
		if (indent > 0) tocEntry.style.marginLeft = indent + "px";

		toc.appendChild(tocEntry);
	}
}

function q5Diagram(width, height, divId) {
	let q5 = new Q5("offscreen");
	let canvas = q5.createCanvas(width, height);
	q5.pixelDensity(2);
	canvas.style["max-width"] = "100%";
	canvas.style.width = "";
	canvas.style.height = "";
	document.getElementById(divId).appendChild(canvas);

	q5.textSize(16);
	q5.textAlign(q5.CENTER, q5.CENTER)
	q5.noLoop();

	let blockSize = 40;
	q5.blockSize = (bs) => {
		if (bs !== undefined) blockSize = bs;
		return blockSize;
	}

	q5.grid = (x, y, w, h, stroke) => {
		stroke = stroke !== undefined ? stroke : "black";
		q5.noFill()
		q5.stroke(stroke)
		for (let yy = 0; yy < h; yy++)
			for(let xx = 0; xx < w; xx++)
				q5.rect((xx + x) * blockSize, (yy + y) * blockSize, blockSize, blockSize);
	}

	q5.block = (x, y, fill, stroke) => {
		stroke = stroke !== undefined ? stroke : "black";
		q5.fill(fill)
		q5.stroke(stroke);
		q5.rect(x * blockSize, y * blockSize, blockSize, blockSize);
	}

	q5.blockText = (text, x, y, fill) => {
		x += 0.5;
		y += 0.5;
		q5.fill(fill)
		q5.noStroke();
		q5.text(text, x * blockSize, y * blockSize);
	}

	q5.blockRect = (x, y, width, height, fill, stroke) => {
		stroke = stroke !== undefined ? stroke : "black";
		q5.fill(fill)
		q5.stroke(stroke);
		let x2 = x + width - 1;
		let y2 = y + height - 1;
		for(; y <= y2; y++)
			for(let sx = x; sx <= x2; sx++)
				q5.block(sx, y, fill, stroke);
	}

	return q5;
}