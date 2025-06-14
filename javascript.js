document.addEventListener('DOMContentLoaded', function() {  /* Helper links on the course search page */
	console.log("AJR:Executing injected JS - javascript.js");
	
	// copyToClipboardAJR styles
	$('head').append('<style type="text/css">button.copy-to-clipboard-ajr {background-color:#00000011;border:none;padding:0.4em;border-radius: 4px;font-size: 12px;line-height: 12px;} button.copy-to-clipboard-ajr::before {content: \'\\f0c5\';font-family:\'FontAwesome\';padding-right:4px}</style>');
	
	// Custom reports copy
	$('head').append('<style type="text/css">.copy-to-clipboard-ajr tbody td, .copy-to-clipboard-ajr tbody th {position: relative;} .copy-to-clipboard-ajr tbody td:hover::before, .copy-to-clipboard-ajr tbody th:hover::before {content: \'\\f0c5\';font-family:\'FontAwesome\';position:absolute;right:-8px;z-index:100;font-weight:normal;border-radius:12px;padding:2px 4px;font-size:12px;color:white;background-color:#00000099;}</style>');
	$("#page-admin-report-customsql-view .generaltable").addClass("copy-to-clipboard-ajr").click((e) => {if(e.target.tagName != "A") {navigator.clipboard.writeText(e.target.innerText.trim());}});
	
	// Search helper links
    $("#page-course-search .course-search-result .coursebox, #page-course-index-category .category-browse .coursebox").each(function() {
		cid = $(this).data("courseid");
		shortname = $(this).find(".coursename a").text();
		sn = shortname.match(/\((.*?)\)/)[1];
		c = $(this).find(".moreinfo");

		var ql = '<div class="quicklinks">';
		ql += `<span><a target='_blank' href="/course/edit.php?id=${cid}">Edit</a></span>`;
		ql += `<span><a target="_blank" href="/user/index.php?id=${cid}">Enrol</a></span>`;
		ql += `<span><a target="_blank" href="/enrol/instances.php?id=${cid}">Methods</a></span>`;
		ql += `<span><a target="_blank" href="/mod/assign/index.php?id=${cid}">Assignments</a></span>`;
		ql += `<span><a target="_blank" href="/mod/quiz/index.php?id=${cid}">Quizzes</a></span>`;
		ql += `<span><a target="_blank" href="/grade/edit/tree/index.php?id=${cid}">Gradebook</a></span>`;

		ql += `<button class="copy-to-clipboard-ajr" onclick="navigator.clipboard.writeText('${sn}')" title="Copy shortname to clipboard">${sn}</button>`;
		ql += `<button class="copy-to-clipboard-ajr" onclick="navigator.clipboard.writeText('${cid}')" title="Copy Course ID clipboard">${cid}</button>`;
		ql += `<button class="copy-to-clipboard-ajr" onclick="navigator.clipboard.writeText('https://stream.massey.ac.nz/course/view.php?id=${cid}')" title="Copy course URL clipboard">URL</button>`;
		ql += `</div>`;

		c.append(ql);
    });
	
	/* Helper links on the assignment list page e.g.: https://stream.massey.ac.nz/mod/assign/index.php?id=3153 */
	$("#page-mod-assign-index td.cell.c1").each(function() {
		a = $(this).find("a");
		id = a.attr("href").match(/id=([^&#]*)/)[1];
		if(id) {
			a.after(" | <a target='_blank' href='/course/modedit.php?update=" + id + "&return=1'>Settings</a>");
		}
	});
	
	/* Helper links on the quiz list page e.g.: https://stream.massey.ac.nz/mod/quiz/index.php?id=3153 */
	$("#page-mod-quiz-index td.cell.c1").each(function() {
		a = $(this).find("a");
		id = a.attr("href").match(/id=([^&#]*)/)[1];
		if(id) {
			a.after(" | <a target='_blank' href='/course/modedit.php?update=" + id + "&return=1'>Settings</a>");
		}
	});
	
	$("#page-admin-tool-courseimport-course table[name='courseimport-course'] tr:not(.emptyrow)").each(function () {
		c = $(this).find("td.c7");
		t = c.text();
		// if(t == "Complete") {
			m = $(this).find("td.c1").text().substring(0,6);
			y = $(this).find("td.c3").text();p = $(this).find("td.c4").text();o = $(this).find("td.c2").text();
			c.html(t + " (<a target='_blank' href='/course/search.php?search=" + m + "_" + y + "_" + p + "_" + o + "'>Search</a>)");
		// }
	});
	
	/* Helper links for Course Administration menu */
	var cids = document.getElementsByTagName("body")[0].getAttribute("class").match(/course-(\d+)/)
	if(cids) {
		cid = cids[1];
		/* Add in reverse priority order */
		$("#settingsnav li.type_course > ul").prepend(`<p class="tree_item hasicon leaf tree_item_ajr"><a href="/report/log/index.php?id=${cid}" tabindex="-1"><i class="icon fa fa-area-chart fa-fw navicon" aria-hidden="true" tabindex="-1"></i>Logs</a></p>`).prepend(`<p class="tree_item hasicon leaf tree_item_ajr"><a href="/enrol/instances.php?id=${cid}" tabindex="-1"><i class="icon fa fa-user-plus fa-fw navicon" aria-hidden="true" tabindex="-1"></i>Enrolment methods</a></p>`).prepend(`<p class="tree_item hasicon leaf tree_item_ajr"><a href="/user/index.php?id=${cid}" tabindex="-1"><i class="icon fa fa-user-plus fa-fw navicon" aria-hidden="true" tabindex="-1"></i>Enrolled users</a></p>`);

		$("#xsettingsnav li.type_course > ul > li").find(":contains(\"Outcomes\"), :contains(\"Reset\"), :contains(\"Badges\"), :contains(\"xCopy course\")").each(function() {
			$(this).css("display","none");
		});
	}
	
	/* Helper for nav bar*/
	$("#page-header .breadcrumb-nav .breadcrumb-item a").each(function() {
		n = $(this);
		c = this.outerHTML;
		t = c.replaceAll('"','\\x22');
		this.outerHTML = `<div>${c}<span><button class="copy-to-clipboard-ajr" onclick="navigator.clipboard.writeText('${n.attr("href")}')" title="Copy URL to clipboard"><i class="fa fa-link" aria-hidden="true"></i></button>&nbsp;<button class="copy-to-clipboard-ajr" onclick="navigator.clipboard.writeText('${n.text()}')" title="Copy text to clipboard"><i class="fa fa-font" aria-hidden="true"></i></button>&nbsp;<button class="copy-to-clipboard-ajr" onclick=';navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob(["${t}"], { type: "text/html" }) })]);' title="Copy HTML link to clipboard"><i class="fa fa-file-text-o" aria-hidden="true"></i></button></span></div>`;
	});
	
	
	/* Helper book editing*/
	$("#page-mod-book-view:not(.editing) .block_book_toc a").each(function() {
		l = $(this).attr("href").replace("view.php","edit.php").replace("?id=","?cmid=").replace("chapterid=","id=");
		$(`<a target="_blank" class="book-edit-helper" href="${l}"><i class="icon fa fa-cog fa-fw" aria-hidden="true" tabindex="-1"></i></a>`).insertAfter($(this));
	});
	/* Helper book editing for current chapter */
	$("#page-mod-book-view .book_toc strong").each(function() {
		l = window.location.href.replace("view.php","edit.php").replace("?id=","?cmid=").replace("chapterid=","id=");
		$(`<a target="_blank" class="book-edit-helper" href="${l}"><i class="icon fa fa-cog fa-fw" aria-hidden="true" tabindex="-1"></i></a>`).insertAfter($(this));
	});
	
	/* Flag non-production environments */
	/*
	if(window.location.hostname != 'stream.massey.ac.nz') {
		var te = document.querySelector('#page-header'), e = document.createElement("div");
		if(te) {
			e.innerHTML = '<div class="alert alert-success alert-block fade in"><button data-dismiss="alert" class="close" type="button">×</button><b>Note: </b>This is a non-production environment</div>';
			te.insertBefore(e,te.firstChild);
		}
	}
	*/
	
	/* Add {global_covidinternala} label */
	$("#page-mod-label-mod #id_submitbutton2").each(function () {
	    if(window.location.href.indexOf("ajr=global_covidinternala") != -1) {
			$("#id_introeditor").val('<p>{global_covidinternala}</p>');
			
			if(window.location.href.indexOf("ajr=global_covidinternala_with_restrictions") == -1) {
				$("#id_submitbutton2").click();
			} else {
				//console.log("AJR:Adding restriction");
				//$(".availability-button button").click();$("#availability_addrestriction_group").click();
				
				p = new URLSearchParams(window.location.search);
				// $("#id_availabilityconditionsjson").val('{"op":"&","c":[{"type":"group","id":"choose"}],"showc":[false],"errors":["availability_group:error_selectgroup"]}');
				$("#id_availabilityconditionsjson").val('{"op":"|","c":[{' + p.get("json") + '}],"show":false}');
				$("#id_submitbutton2").click();
			}
	    }
	})
	
	// MathsFirst / Readiness Course Reset
	$("#page-course-reset.course-8805").each(function () {
	    if(window.location.href.indexOf("autoreset=yes") != -1) {
			$("#id_reset_quiz_attempts").prop( "checked", true );
			$("#id_submitbutton").click();
	    }
	})
	
	/* https://stream.massey.ac.nz/course/modedit.php?update=4786147 */
	if(window.location.href.indexOf("ajr_action=lti_staff_rename") != -1) {
		$("#id_name").val('PSI set up - Assessment Services only');
		$("#id_submitbutton2").click();
	}

	/* https://stream.massey.ac.nz/course/modedit.php?update=5300384&ajr_action=course10a */
	if(window.location.href.indexOf("ajr_action=course10a") != -1) {
		const e = $("#id_page");
		var v = e.val();
		v = v.replaceAll('<h3><strong><img src="$IMS-CC-FILEBASE$/images/Icons%20-%20grayscale%20-%20small%20(40%20x%2040)/information_circle_icon_gray.png" alt="" /> Purpose</strong></h3>',
			'<h3 class="hicon purpose">Purpose</h3>');
		v = v.replaceAll('<h3><strong><img src="$IMS-CC-FILEBASE$/images/Icons%20-%20grayscale%20-%20small%20(40%20x%2040)/information_circle_icon_gray.png" alt="" /> Purpose </strong></h3>',
			'<h3 class="hicon purpose">Purpose</h3>');
                       
		v = v.replaceAll('<h3><strong><img src="$IMS-CC-FILEBASE$/images/Icons%20-%20grayscale%20-%20small%20(40%20x%2040)/workshop_circle_icon_gray.png" alt="" /> Prompt</strong></h3>',
			'<h3 class="hicon prompt">Prompt</h3>');
		v = v.replaceAll('<h3><strong><img src="$IMS-CC-FILEBASE$/images/Icons%20-%20grayscale%20-%20small%20(40%20x%2040)/workshop_circle_icon_gray.png" alt="" /> Prompts</strong></h3>',
			'<h3 class="hicon prompt">Prompts</h3>');

		v = v.replaceAll('<h3><strong><img src="$IMS-CC-FILEBASE$/images/Icons%20-%20grayscale%20-%20small%20(40%20x%2040)/information_circle_icon_gray.png" alt="" /> Explanation</strong></h3>',
			'<h3 class="hicon explanation">Explanation</h3>');
		v = v.replaceAll('<h3><strong><img src="$IMS-CC-FILEBASE$/images/Icons%20-%20grayscale%20-%20small%20(40%20x%2040)/discussion_circle_icon_gray.png" alt="" /> Examples</strong></h3>',
			'<h3 class="hicon examples">Examples</h3>');

		v = v.replaceAll('<h3><strong><img src="$IMS-CC-FILEBASE$/images/Icons%20-%20grayscale%20-%20small%20(40%20x%2040)/special_consideration_circle_icon_gray.png" alt="" /> Acknowledge</strong></h3>',
			'<h3 class="hicon acknowledge">Acknowledge</h3>');
		

		$("#id_page").val(v);

		// $("#id_submitbutton2").click();
	}

}, false);
