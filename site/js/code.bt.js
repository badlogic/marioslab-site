{{include raw "_highlight.pack.js"}}

hljs.initHighlightingOnLoad();

{{if reloadWS}}
var url = window.location;
new WebSocket("ws://" + url.host + "/api/reloadws").onmessage = function () {
	location.reload();
}
{{end}}

{{include raw "_vis-network.min.js"}}