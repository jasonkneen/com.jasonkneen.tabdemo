function openWin1() {
	var win = Ti.UI.createWindow({
		title : "Tab 1 / Sub Window",
		backgroundColor : "#fff",
		navTintColor : "#000", // this will set the background of the nav bar
		navTextColor : "#fff" // this will set the text of the nav bar, back buttons etc.
	});

	var label = Ti.UI.createLabel({
		text : "window 2"
	});

	win.add(label);

	$.getView().activeTab.open(win);
}


$.getView().addEventListener("focus", function(e) {
	//console.log(e);
});

function openWin2() {
	var win = Ti.UI.createWindow({
		title : "Tab 2 / SubWindow",
		backgroundColor : "#fff" // not setting any nav colors here, so it'll default
	});

	var label = Ti.UI.createLabel({
		text : "window 3"
	});

	win.add(label);

	$.getView().activeTab.open(win);
}

$.index.open();
