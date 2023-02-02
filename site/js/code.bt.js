{{include raw "_highlight.min.js"}}
{{include raw "_highlightjs-line-numbers.min.js"}}
{{include raw "_q5.min.js"}}
{{include raw "_tween.js"}}

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
	q5.pixelDensity(devicePixelRatio);
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

	q5.grid = (x, y, w, h, stroke, pixelCenters) => {
		stroke = stroke !== undefined ? stroke : "black";
		pixelCenters = pixelCenters !== undefined ? pixelCenters : false;
		q5.noFill()
		q5.stroke(stroke)
		for (let yy = 0; yy < h; yy++) {
			for(let xx = 0; xx < w; xx++) {
				q5.rect((xx + x) * blockSize, (yy + y) * blockSize, blockSize, blockSize);
				if (pixelCenters) q5.circle((xx + x) * blockSize + blockSize / 2, (yy + y) * blockSize + blockSize / 2, blockSize / 10);
			}
		}
	}

	q5.pixels = (x, y, w, h, pixels, stroke, pixelCenters) => {
		stroke = stroke !== undefined ? stroke : "black";
		pixelCenters = pixelCenters !== undefined ? pixelCenters : false;
		q5.stroke(stroke);
		for (let yy = 0; yy < h; yy++) {
			for(let xx = 0; xx < w; xx++) {
				q5.fill(pixels[xx + yy * w]);
				q5.rect((xx + x) * blockSize, (yy + y) * blockSize, blockSize, blockSize);
				if (pixelCenters) q5.circle((xx + x) * blockSize + blockSize / 2, (yy + y) * blockSize + blockSize / 2, blockSize / 10);
			}
		}
	}

	q5.block = (x, y, fill, stroke) => {
		stroke = stroke !== undefined ? stroke : "black";
		q5.fill(fill)
		if (stroke == "none")
			q5.noStroke();
		else
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
		let x2 = x + width - 1;
		let y2 = y + height - 1;
		for(; y <= y2; y++)
			for(let sx = x; sx <= x2; sx++)
				q5.block(sx, y, fill, stroke);
	}

	return q5;
}

function line(canvas, x1, y1, x2, y2, color) {
	ctx = canvas.getContext("2d");
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(x1 * devicePixelRatio, y1 * devicePixelRatio);
	ctx.lineTo(x2 * devicePixelRatio, y2 * devicePixelRatio);
	ctx.stroke();
}

function rect(canvas, x, y, width, height, color) {
	ctx = canvas.getContext("2d");
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.rect(x * devicePixelRatio, y * devicePixelRatio, width * devicePixelRatio, height * devicePixelRatio);
	ctx.stroke();
}

function fillRect(canvas, x, y, width, height, color) {
	ctx = canvas.getContext("2d");
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.rect(x * devicePixelRatio, y * devicePixelRatio, width * devicePixelRatio, height * devicePixelRatio);
	ctx.fill();
}

function circle(canvas, x, y, radius, color) {
	ctx = canvas.getContext("2d");
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(x * devicePixelRatio, y * devicePixelRatio, radius * devicePixelRatio, 0, 2 * Math.PI);
	ctx.stroke();
}

function grid(canvas, gridSize, color) {
	ctx = canvas.getContext("2d");
	ctx.strokeStyle = color;
	ctx.beginPath();
	for (let y = 0; y < canvas.height; y += gridSize) {
	   for (let x = 0; x < canvas.width; x += gridSize) {		  
		  ctx.rect(x * devicePixelRatio, y * devicePixelRatio, gridSize * devicePixelRatio, gridSize * devicePixelRatio);
	   }
	}
	ctx.stroke();
}

function text(canvas, text, x, y, color, center) {
	ctx = canvas.getContext("2d");
	ctx.fillStyle = color;	
	if (center) {
		let textMeasure = ctx.measureText(text);
		ctx.fillText(text, x * devicePixelRatio - textMeasure.width / 2, y * devicePixelRatio);	
	} else {
		ctx.fillText(text, x * devicePixelRatio, y * devicePixelRatio);
	}
}

function makeObjectsDraggable(canvas, objects, mouseToWorld, dragged, redraw) {
	let dragStart = { x: 0, y: 0 };
	let draggedObject = null;	

	function findClosestObject(x, y) {
		let closest = null;
		let closestDist = Number.MAX_VALUE;
		for (let object of objects) {
			if (object.hasOwnProperty("radius")) {
				let dist = Math.sqrt((object.x - x) * (object.x - x) + (object.y - y) * (object.y - y));
				if (dist < object.radius) {
					if (dist < closestDist) {
						closest = object;
						closestDist = dist;
					}
				}
			} else if (object.hasOwnPropery("width")) {
				let cx = object.x + object.width / 2;
				let cy = object.y + object.height / 2;
				if (x >= object.x && x < object.x + object.width && y >= object.y && y <= object.y + object.height) {
					let dist = Math.sqrt((cx - x) * (cx - x) + (cy - y) * (cy - y));
					if (dist < closestDist) {
						closest = object;
						closestDist = dist;
					}
				}
			}
		}

		return closest;
	}

	function down(x, y) {
		draggedObject = findClosestObject(x, y);		
		dragStart.x = x;
		dragStart.y = y;
		requestAnimationFrame(redraw);
	}

	function move(x, y) {
		if (draggedObject) {
			let deltaX = x - dragStart.x;
			let deltaY = y - dragStart.y;
			draggedObject.x += deltaX;
			draggedObject.y += deltaY;
			dragStart.x = x;
			dragStart.y = y;
			if (!dragged(draggedObject)) {
				draggedObject = null;
			}
		}
		requestAnimationFrame(redraw);
	}

	canvas.addEventListener("mousedown", function (mouseEvent) {
		let pos = mouseToWorld(mouseEvent.offsetX, mouseEvent.offsetY);
		down(pos.x, pos.y);
	}, false);

	canvas.addEventListener("touchstart", function (touchEvent) {
		touchEvent.preventDefault();
		const touch = touchEvent.targetTouches[0];
		let rect = touchEvent.target.getBoundingClientRect();
		let x = touch.pageX - rect.left;
		let y = touch.pageY - rect.top;
		let pos = mouseToWorld(x, y);
		down(pos.x, pos.y);
	})

	canvas.addEventListener("mousemove", function (mouseEvent) {
		let pos = mouseToWorld(mouseEvent.offsetX, mouseEvent.offsetY);
		move(pos.x, pos.y);
	});

	canvas.addEventListener("touchmove", function (touchEvent) {
		touchEvent.preventDefault();
		const touch = touchEvent.targetTouches[0];
		let rect = touchEvent.target.getBoundingClientRect();
		let x = touch.pageX - rect.left;
		let y = touch.pageY - rect.top;
		let pos = mouseToWorld(mouseEvent.offsetX, mouseEvent.offsetY);
		move(pos.x, pos.y);
	})

	canvas.addEventListener("mouseup", function (mouseEvent) {
		if (draggedObject) dragged(draggedObject, true);	
		draggedObject = null;
	}, false);

	canvas.addEventListener("mouseleave", function () {
		if (draggedObject) dragged(draggedObject, true);	
		draggedObject = null;		
	})

	canvas.addEventListener("touchend", () => {
		if (draggedObject) dragged(draggedObject, true);	
		draggedObject = null;
	});
}