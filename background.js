chrome.runtime.onInstalled.addListener(function() {
	console.log("AJR:chrome.runtime.onInstalled background.js");
	
	chrome.contextMenus.create({
        title: "Open page in prestream",
        contexts: ["page"],
        id: "open_prestream"
    });
	
	chrome.contextMenus.create({
        title: "Open page in stream",
        contexts: ["page"],
        id: "open_stream"
    });
	
	chrome.contextMenus.create({
        title: "Open page in recovery-stream (requires alt login)",
        contexts: ["page"],
        id: "open_recovery-stream"
    });
	
	chrome.contextMenus.create({
        title: "Open page in stream-dev (Moodle 4.1)",
        contexts: ["page"],
        id: "open_stream-dev"
    });
	
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId.substring(0,5) === "open_") {
        openPageOnOtherHost(info,false);
    }
})

openPageOnOtherHost = function(onClickData,tab){
	var url = onClickData.pageUrl;
	var host = onClickData.menuItemId.substring(5);
	url = url.replace(/\/\/(stream|stream-dev|prestream|recovery-stream)/,"*").replace("*",`//${host}`);
	
    chrome.tabs.create({url: url});
 };

