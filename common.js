const PROJECT_COUNT = 5;

var urlAlias = {
	"bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css"
}
function getHost() {
	var url = window.location.href;
	if (window.tab && window.tab.url) {
		url = tab.url;
	}
	if(url.indexOf('.massey.ac.nz') == -1) {
		return url.match(/[^\/]+\/\/[^\/]+/)[0];
	} else {
		return "https://stream.massey.ac.nz";
	}
}

// Legacy schema used `cssInjection` (no suffix) for project 1 and `cssInjection1`..`cssInjection3`
// for projects 2..4. Normalize to `cssInjection1`..`cssInjectionN` mapped 1:1 to projects 1..N.
function migrateLegacyProjectKeys(data) {
	if (!('cssInjection' in data)) return data;
	var legacy = [data.cssInjection, data.cssInjection1, data.cssInjection2, data.cssInjection3];
	delete data.cssInjection;
	delete data.cssInjection1;
	delete data.cssInjection2;
	delete data.cssInjection3;
	for (var i = 0; i < legacy.length; i++) {
		if (legacy[i] !== undefined) data['cssInjection' + (i + 1)] = legacy[i];
	}
	return data;
}

function getInjectDataFromStorage() {
	var currentUrl = getHost();
	return new Promise(function(resolve, reject) {
		chrome.storage.local.get(currentUrl, function(data) {
			data = data[currentUrl];
			if (data == undefined) {
				resolve();
				return;
			}
			resolve(migrateLegacyProjectKeys(data));
		});
	});
}
function saveInjectDataToStorage(data) {
	var currentUrl = getHost();
	var payload = {};
	payload[currentUrl] = data;
	chrome.storage.local.set(payload);
}

function updateCss(css) {
	console.log("AJR updateCss - common.js");

	if (css) css = css.trim();

	var style = document.querySelector("style#sgqInjectCss");
	if (style === null) {
		if (css === "") return;
		style = document.createElement("style");
		style.type = "text/css";
		style.id = "sgqInjectCss";
		style.classList.add("sgqInjectMark");
		document.head.appendChild(style);
	}
	style.innerHTML = css;
}
