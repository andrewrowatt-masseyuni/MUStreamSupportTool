
var urlAlias = {
	"bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css"
}

getInjectDataFromStorage().then(function(injectionData) {
	if (injectionData == undefined) return;
	updateCss((injectionData.project1enabled ? injectionData.cssInjection : '') + ' ' + (injectionData.project2enabled ? injectionData.cssInjection1 : '') + ' ' + (injectionData.project3enabled ? injectionData.cssInjection2 : '') + ' ' + (injectionData.project4enabled ? injectionData.cssInjection3 : ''));
	
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



