{{include raw "_highlight.pack.js"}}
{{include raw "_highlightjs-line-numbers.min.js"}}

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