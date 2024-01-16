var tab;
var project1name, project1enabled;
var project2name, project2enabled;
var project3name, project3enabled;
var project4name, project4enabled;
var cssEditor, cssEditor1, cssEditor2, cssEditor3;
var storage = chrome.storage.sync;


function redrawEditor(editor) {
	editor.resize();
	editor.renderer.updateFull();
	editor.focus();
}
function bindListeners() {
	document.querySelector("ul.tabs").addEventListener("click", function(event) {
		if (!event.target.classList.contains("tab")) return;
		var selectedTabEle = event.target;
		Array.prototype.forEach.call(this.querySelectorAll(".tab"), function(tabEle) {
			var targetEle = document.getElementById(tabEle.getAttribute("tab-content-id"));
			if (tabEle === selectedTabEle) {
				tabEle.classList.add("selected");
				targetEle.style.display = "block";
			}
			else {
				tabEle.classList.remove("selected");
				targetEle.style.display = "none";
			}
		});
		if      (selectedTabEle.id === "cssTab") {
			redrawEditor(cssEditor);
		}
		else if (selectedTabEle.id === "cssTab1") {
			redrawEditor(cssEditor1);
		}
		else if (selectedTabEle.id === "cssTab2") {
			redrawEditor(cssEditor2);
		}
		else if (selectedTabEle.id === "cssTab3") {
			redrawEditor(cssEditor3);
		}		
		else {
			//redrawEditor(externalCssEditor);
		}
	});
	cssEditor.on("change", function() {
		injectCss();
		saveEditorContent();
	});
	cssEditor1.on("change", function() {
		injectCss();
		saveEditorContent();
	});
	cssEditor2.on("change", function() {
		injectCss();
		saveEditorContent();
	});
	cssEditor3.on("change", function() {
		injectCss();
		saveEditorContent();
	});
	
	document.getElementById("tools_projects").addEventListener("change",() => {saveEditorContent();injectCss();updateProjectTabNames();});
}
document.addEventListener("DOMContentLoaded", function() {
	cssEditor = ace.edit("cssEditor");
	cssEditor.setTheme("ace/theme/monokai");
	cssEditor.getSession().setMode("ace/mode/css");
	
	cssEditor1 = ace.edit("cssEditor1");
	cssEditor1.setTheme("ace/theme/monokai");
	cssEditor1.getSession().setMode("ace/mode/css");
	
	cssEditor2 = ace.edit("cssEditor2");
	cssEditor2.setTheme("ace/theme/monokai");
	cssEditor2.getSession().setMode("ace/mode/css");

	cssEditor3 = ace.edit("cssEditor3");
	cssEditor3.setTheme("ace/theme/monokai");
	cssEditor3.getSession().setMode("ace/mode/css");
	
	project1name = document.getElementById("project1name");project1enabled = document.getElementById("project1enabled");
	project2name = document.getElementById("project2name");project2enabled = document.getElementById("project2enabled");
	project3name = document.getElementById("project3name");project3enabled = document.getElementById("project3enabled");
	project4name = document.getElementById("project4name");project4enabled = document.getElementById("project4enabled");
	

	chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
		window.tab = tabs[0];
		loadEditorContent().then(bindListeners);
	})
	
	// https://developer.chrome.com/docs/extensions/reference/scripting/#handling-results
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
		chrome.scripting.executeScript({
		target: {tabId: tabs[0].id},
		func: getStreamDetails,
		world:"MAIN",
		},
			(injectionResults) => {
				for (const result of injectionResults) {
					$("#theme").val(result.result.theme).change();$("#course_theme").val(result.result.theme);
					$("#course_id").val(result.result.course_id);
					$("#hostname").val(result.result.hostname);
				}
			}
		)
	});
	

	

	
	/*
	document.getElementById("tool1").addEventListener("click",function() {
		chrome.tabs.executeScript({
			code: "tool1Script();"
		});	
	});
	*/
	
	function setTheme(theme) {
		console.log("setEditor:" + theme);
		console.log(`https://${$("#hostname").val()}/webservice/rest/server.php?wstoken=xxx&wsfunction=core_course_update_courses&courses[0][id]=${course_id}&courses[0][forcetheme]=${theme}&moodlewsrestformat=json`);
		var course_id = $("#course_id").val();
		if(course_id==1) return;
		
		$.when( $.ajax( `https://${$("#hostname").val()}/webservice/rest/server.php?wstoken=xxx&wsfunction=core_course_update_courses&courses[0][id]=${course_id}&courses[0][forcetheme]=${theme}&moodlewsrestformat=json` ) ).then(function( data, textStatus, jqXHR ) {
			if(data.warnings && data.warnings.length==0) {
				console.log('Success');chrome.tabs.reload(tab.id);window.close();
			} else {
				console.log(data);alert(data);
			}});
	}
	
	document.getElementById("setTheme").addEventListener("click",function() {
		/* To do: rewrite eg setEditor below */
		setTheme($("#theme").val());
				
		//chrome.tabs.executeScript(tab.id,{code:`var cids = document.getElementsByTagName("body")[0].getAttribute("class").match(/course-(\\d+)/);if(cids&&cids[1]!="1") {cid=cids[1];var theme="${$("#theme").val()}";console.log("Setting theme for course " + cid + " to " + theme);$.when( $.ajax( "/webservice/rest/server.php?wstoken=6197db55774e47689265e3f33b11e408&wsfunction=core_course_update_courses&courses[0][id]=" + cid + "&courses[0][forcetheme]=" + theme + "&moodlewsrestformat=json" ) ).then(function( data, textStatus, jqXHR ) {  if(data.warnings && data.warnings.length==0) {console.log('Success');window.location.reload();} else {console.log(data);alert(data);}});}`});
		
		//window.close();
	});
	
	function setEditor(editor) {
		console.log("setEditor:" + editor);
		$.when( $.ajax( `https://${$("#hostname").val()}/webservice/rest/server.php?wstoken=xxx&wsfunction=core_user_set_user_preferences&preferences[0][userid]=11&moodlewsrestformat=json&preferences[0][name]=htmleditor&preferences[0][value]=${editor}` ) ).then(function( data, textStatus, jqXHR ) {
			if(data.warnings && data.warnings.length==0) {
				console.log('Success');chrome.tabs.reload(tab.id);window.close();
			} else {
				console.log(data);alert(data);
			}});
	}
	
	document.getElementById("setEditorAtto").addEventListener("click",() => setEditor('atto'));
	document.getElementById("setEditorTinyMCE").addEventListener("click",() => setEditor('tinymce'));
	document.getElementById("setEditorPlain").addEventListener("click",() => setEditor('textarea'));
	
	

	chrome.runtime.onMessage.addListener(function (message) {
		console.log("Received message in main.js:" + message.details);
		
		if(message.type == "STREAM_PAGE_DETAILS") {
			$("#theme").val(message.details.theme).change();$("#course_theme").val(message.details.theme);
			$("#course_id").val(message.details.course_id);
			$("#hostname").val(message.details.hostname);
		}
	});	
	
	
});
function loadEditorContent() {
	return getInjectDataFromStorage().then(function(injectionData) {
		if (injectionData == undefined) return;
		
		cssEditor.setValue(injectionData.cssInjection);
		cssEditor.clearSelection();
		
		cssEditor1.setValue(injectionData.cssInjection1);
		cssEditor1.clearSelection();
		
		cssEditor2.setValue(injectionData.cssInjection2);
		cssEditor2.clearSelection();
		
		cssEditor3.setValue(injectionData.cssInjection3);
		cssEditor3.clearSelection();
		
		project1name.value = injectionData.project1name;
		project1enabled.checked = injectionData.project1enabled;
		
		project2name.value = injectionData.project2name;
		project2enabled.checked = injectionData.project2enabled;
		
		project3name.value = injectionData.project3name;
		project3enabled.checked = injectionData.project3enabled;
		
		project4name.value = injectionData.project4name;
		project4enabled.checked = injectionData.project4enabled;
		
		updateProjectTabNames();
	});
}
function saveEditorContent() {
	saveInjectDataToStorage(
	cssEditor.getValue(),
	cssEditor1.getValue(),
	cssEditor2.getValue(),
	cssEditor3.getValue(),
	project1name.value,project1enabled.checked,
	project2name.value,project2enabled.checked,
	project3name.value,project3enabled.checked,
	project4name.value,project4enabled.checked);
}
async function injectCss() {
	console.log("injectCss");
	const [tab] = await chrome.tabs.query({currentWindow: true, active: true});
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func: updateCss,
		args:[(project1enabled.checked ? cssEditor.getValue() : '') + ' ' + 
		      (project2enabled.checked ? cssEditor1.getValue() : '') + ' ' + 
			  (project3enabled.checked ? cssEditor2.getValue() : '') + ' ' + 
			  (project4enabled.checked ? cssEditor3.getValue() : '')],

	});

	// https://developer.chrome.com/docs/extensions/mv3/mv3-migration/#cs-func
	
	// https://stackoverflow.com/questions/70949491/chrome-extension-how-do-i-inject-a-script-that-the-user-provided/70949953#70949953
}

function updateProjectTabNames() {
	document.querySelector("#cssTab").innerHTML = project1name.value;
	document.querySelector("#cssTab1").innerHTML = project2name.value;
	document.querySelector("#cssTab2").innerHTML = project3name.value;
	document.querySelector("#cssTab3").innerHTML = project4name.value;
}

function getStreamDetails() {
	console.log("AJR:getStreamDetails - main.js");

	return {
		hostname: window.location.hostname,
		theme: M.cfg.theme,
		course_id: document.body.getAttribute("class").match(/course-(\d+)/)[1]
	};
}

