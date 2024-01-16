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
        title: "Open page in stream-dev",
        contexts: ["page"],
        id: "open_stream-dev"
    });

    chrome.contextMenus.create({
        title: "Open page in recovery-stream with alt login",
        contexts: ["page"],
        id: "open_recovery-stream_with_login"
    });
	
	
	chrome.contextMenus.create({
        title: "Open page in recovery-stream",
        contexts: ["page"],
        id: "open_recovery-stream"
    });
	
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if(info.menuItemId === "open_recovery-stream_with_login") {
        openPageOnOtherHost(info,true);
    }
    else if (info.menuItemId.substring(0,5) === "open_") {
        openPageOnOtherHost(info,false);
    };

})

openPageOnOtherHost = function(onClickData,recoveryAltLogin){
	var url = onClickData.pageUrl;
	var host = recoveryAltLogin ? "recovery-stream" : onClickData.menuItemId.substring(5);
	url = url.replace(/\/\/(stream|stream-dev|prestream|recovery-stream)/,"*").replace("*",`//${host}`);
	
    if(recoveryAltLogin) {
        chrome.tabs.create({url: `https://recovery-stream.massey.ac.nz/login/index.php?noredirect=1&wantsurl=${url}`});
    }
    else {
        chrome.tabs.create({url: url});
    }
 };

