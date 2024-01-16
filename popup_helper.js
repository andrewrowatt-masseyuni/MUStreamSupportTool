function getPageTheme1() {
	console.log("getPageTheme");
	//var actualCode = `chrome.runtime.sendMessage("lndjjohfbleggdpmhjollpogmbgocnck","getPageTheme result");console.log("getPageTheme inject:" + M.cfg.theme);`;
	var actualCode = `window.postMessage({ type: "FROM_PAGE", text: M.cfg.theme }, "*");console.log("getPageTheme inject:" + M.cfg.theme);`;
	
	
	var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head||document.documentElement).appendChild(script);
	script.remove();
}

//getPageTheme1();
//window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
// chrome.runtime.sendMessage("lndjjohfbleggdpmhjollpogmbgocnck","getPageTheme static result with ID");