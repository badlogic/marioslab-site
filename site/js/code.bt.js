{{include raw "_highlight.pack.js"}}

hljs.configure({ useBR: true });
hljs.initHighlightingOnLoad();

{{if reloadWS}}
var url = window.location;
new WebSocket("ws://" + url.host + "/api/reloadws").onmessage = function () {
	location.reload();
}
{{end}}