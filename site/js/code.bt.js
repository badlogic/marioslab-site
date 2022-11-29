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