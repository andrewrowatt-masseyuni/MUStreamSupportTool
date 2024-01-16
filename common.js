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
function getInjectDataFromStorage() {
	var currentUrl = getHost();
	return new Promise(function(resolve, reject) {
		//chrome.storage.sync.get(currentUrl, function(data) {
		chrome.storage.local.get(currentUrl, function(data) {
			data = data[currentUrl];
			if (data == undefined) {
				resolve();
				return;
			}
			var injectData = {};
			if (data.cssInjection  != undefined) injectData["cssInjection"]  = data.cssInjection;
			if (data.cssInjection1 != undefined) injectData["cssInjection1"] = data.cssInjection1;
			if (data.cssInjection2 != undefined) injectData["cssInjection2"] = data.cssInjection2;
			if (data.cssInjection3 != undefined) injectData["cssInjection3"] = data.cssInjection3;
			
			if (data.project1name != undefined) injectData["project1name"] = data.project1name;
			if (data.project1enabled != undefined) injectData["project1enabled"] = data.project1enabled;

			if (data.project2name != undefined) injectData["project2name"] = data.project2name;
			if (data.project2enabled != undefined) injectData["project2enabled"] = data.project2enabled;
			
			if (data.project3name != undefined) injectData["project3name"] = data.project3name;
			if (data.project3enabled != undefined) injectData["project3enabled"] = data.project3enabled;
			
			if (data.project4name != undefined) injectData["project4name"] = data.project4name;
			if (data.project4enabled != undefined) injectData["project4enabled"] = data.project4enabled;
			
			resolve(injectData);
		});
	});
}
function saveInjectDataToStorage(
	cssInjection, cssInjection1, cssInjection2, cssInjection3,
	project1name, project1enabled, project2name, project2enabled,project3name, project3enabled,project4name, project4enabled) {
	var currentUrl = getHost();
	var data = {};
	data[currentUrl] = {
		cssInjection: cssInjection,
		cssInjection1: cssInjection1,
		cssInjection2: cssInjection2,
		cssInjection3: cssInjection3,
		project1name: project1name,
		project1enabled: project1enabled,
		project2name: project2name,
		project2enabled: project2enabled,
		project3name: project3name,
		project3enabled: project3enabled,
		project4name: project4name,
		project4enabled: project4enabled
		
	};
	//chrome.storage.sync.set(data);
	chrome.storage.local.set(data);
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
/*
async function execInPage(code) {
  const [tab] = await chrome.tabs.query({currentWindow: true, active: true});
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: code => {
      const el = document.createElement('script');
      el.textContent = code;
      document.documentElement.appendChild(el);
      el.remove();
    },
    args: [code],
    world: 'MAIN',
    //injectImmediately: true, // Chrome 102+
  });
}
*/