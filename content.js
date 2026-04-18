
var urlAlias = {
	"bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css"
}

getInjectDataFromStorage().then(function(injectionData) {
	if (injectionData == undefined) return;

	var parts = [];
	for (var i = 1; i <= PROJECT_COUNT; i++) {
		if (injectionData["project" + i + "enabled"]) {
			parts.push(injectionData["cssInjection" + i] || '');
		}
	}
	updateCss(parts.join(' '));

	console.log("AJR:updateCss - content.js");

	// eval(injectionData.jsInjection);
	// https://developer.chrome.com/docs/extensions/mv3/mv3-migration/#cs-func

	// https://stackoverflow.com/questions/70949491/chrome-extension-how-do-i-inject-a-script-that-the-user-provided/70949953#70949953

	document.addEventListener("DOMContentLoaded", function() {
		Array.prototype.forEach.call(document.querySelectorAll(".sgqInjectMark"), function(ele) {
			document.head.removeChild(ele);
			document.head.appendChild(ele);
		});
	});
});

document.addEventListener('DOMContentLoaded', function() {
	console.log("AJR:DOMContentLoaded content.js");
});



