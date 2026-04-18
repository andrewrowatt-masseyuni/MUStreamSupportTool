var tab;
var projects = [];
var storage = chrome.storage.sync;


function redrawEditor(editor) {
	editor.resize();
	editor.renderer.updateFull();
	editor.focus();
}

function buildProjectUI() {
	var tabsList = document.querySelector("ul.tabs");
	var container = document.getElementById("container");
	var toolsProjects = document.getElementById("tools_projects");
	var toolsTab = document.getElementById("toolsTab");
	var toolsContent = document.getElementById("tools");

	for (var i = 1; i <= PROJECT_COUNT; i++) {
		var tabEl = document.createElement("li");
		tabEl.id = "cssTab" + i;
		tabEl.className = "tab nav-item" + (i === 1 ? " selected" : "");
		tabEl.setAttribute("tab-content-id", "cssEditor" + i);
		tabEl.dataset.projectIndex = i;
		tabEl.textContent = "CSS (Project " + i + ")";
		tabsList.insertBefore(tabEl, toolsTab);

		var editorDiv = document.createElement("div");
		editorDiv.id = "cssEditor" + i;
		editorDiv.className = "tabContent cssEditor";
		if (i !== 1) editorDiv.style.display = "none";
		container.insertBefore(editorDiv, toolsContent);

		var row = document.createElement("div");
		row.className = "form-group form-row align-items-center";
		row.innerHTML =
			'<label for="project' + i + 'name" class="col-3 col-form-label">Project ' + i + '</label>' +
			'<input id="project' + i + 'name" type="text" value="" class="form-control col"/>' +
			'<div class="col-3"><div class="form-check form-check-inline">' +
				'<input id="project' + i + 'enabled" type="checkbox" checked="checked" class="form-check-input">' +
				'<label for="project' + i + 'enabled" class="form-check-label col-form-label">Inject</label>' +
			'</div></div>';
		toolsProjects.appendChild(row);
	}
}

function bindListeners() {
	document.querySelector("ul.tabs").addEventListener("click", function(event) {
		if (!event.target.classList.contains("tab")) return;
		var selectedTabEle = event.target;
		Array.prototype.forEach.call(this.querySelectorAll(".tab"), function(tabEle) {
			var targetEle = document.getElementById(tabEle.getAttribute("tab-content-id"));
			var selected = tabEle === selectedTabEle;
			tabEle.classList.toggle("selected", selected);
			targetEle.style.display = selected ? "block" : "none";
		});
		var idx = selectedTabEle.dataset.projectIndex;
		if (idx !== undefined) {
			var p = projects[parseInt(idx, 10) - 1];
			if (p) redrawEditor(p.editor);
		}
	});

	projects.forEach(function(p) {
		p.editor.on("change", function() {
			injectCss();
			saveEditorContent();
		});
	});

	document.getElementById("tools_projects").addEventListener("change", function() {
		saveEditorContent();
		injectCss();
		updateProjectTabNames();
	});
}
document.addEventListener("DOMContentLoaded", function() {
	buildProjectUI();

	for (var i = 1; i <= PROJECT_COUNT; i++) {
		var editor = ace.edit("cssEditor" + i);
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/css");
		projects.push({
			index: i,
			nameEl: document.getElementById("project" + i + "name"),
			enabledEl: document.getElementById("project" + i + "enabled"),
			editor: editor
		});
	}

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

		projects.forEach(function(p) {
			var css = injectionData["cssInjection" + p.index];
			if (css !== undefined) {
				p.editor.setValue(css);
				p.editor.clearSelection();
			}
			var name = injectionData["project" + p.index + "name"];
			if (name !== undefined) p.nameEl.value = name;
			var enabled = injectionData["project" + p.index + "enabled"];
			if (enabled !== undefined) p.enabledEl.checked = enabled;
		});

		updateProjectTabNames();
	});
}
function saveEditorContent() {
	var data = {};
	projects.forEach(function(p) {
		data["cssInjection" + p.index] = p.editor.getValue();
		data["project" + p.index + "name"] = p.nameEl.value;
		data["project" + p.index + "enabled"] = p.enabledEl.checked;
	});
	saveInjectDataToStorage(data);
}
async function injectCss() {
	console.log("injectCss");
	const [tab] = await chrome.tabs.query({currentWindow: true, active: true});
	var css = projects.map(function(p) {
		return p.enabledEl.checked ? p.editor.getValue() : '';
	}).join(' ');
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func: updateCss,
		args: [css],
	});

	// https://developer.chrome.com/docs/extensions/mv3/mv3-migration/#cs-func

	// https://stackoverflow.com/questions/70949491/chrome-extension-how-do-i-inject-a-script-that-the-user-provided/70949953#70949953
}

function updateProjectTabNames() {
	projects.forEach(function(p) {
		var tabEl = document.getElementById("cssTab" + p.index);
		if (tabEl) tabEl.textContent = p.nameEl.value || ("Project " + p.index);
	});
}

function getStreamDetails() {
	console.log("AJR:getStreamDetails - main.js");

	return {
		hostname: window.location.hostname,
		theme: M.cfg.theme,
		course_id: document.body.getAttribute("class").match(/course-(\d+)/)[1]
	};
}
