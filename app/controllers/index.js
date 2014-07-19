function openWin1() {
	var win = Ti.UI.createWindow({
		title: "Tab 1 / Sub Window",		
		backgroundColor: "#fff"
	});
	
	var label = Ti.UI.createLabel({text: "window 2"});
	
	win.add(label);
	
	$.getView().activeTab.open(win);
}

$.getView().addEventListener("focus", function(e){
	console.log(e);
})

function openWin2() {
	var win = Ti.UI.createWindow({
		title: "Tab 2 / SubWindow",		
		backgroundColor: "#fff"	
	});
	
	var label = Ti.UI.createLabel({text: "window 3"});
	
	win.add(label);
	
	$.getView().activeTab.open(win);
}

$.index.open();
