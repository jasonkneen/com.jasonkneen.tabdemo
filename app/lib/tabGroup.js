// global vars
var tabGroup, win;

// creates an iOS style navbar with title, back support.
function createNavBar(win) {

	var navBar = Ti.UI.createView({
		height : OS_IOS ? 65 : 45,
		top : 0,
		backgroundColor : "#CCC"
	});

	var back = Ti.UI.createButton({
		left : 15,
		bottom : 5,
		top : 6,
		title : "< back",
		color : "black",
		backgroundImage : "null",
		visible : false
	});

	var winTitle = Ti.UI.createLabel({
		top : 10,
		color : "black",
		font : {
			fontWeight : "bold",
			fontSize : 18
		},
		text : win.title
	});

	win.leftNavButton = back;

	navBar.add(back);
	navBar.winTitle = winTitle;
	navBar.add(winTitle);

	win.navBar = navBar;
	win.add(navBar);
}

// create our tabGroup
exports.createTabGroup = function(args) {

	if (OS_IOS) {
		return Ti.UI.createTabGroup(args);
	}

	// host heavyweight window
	win = Ti.UI.createWindow({
		backgroundColor : "#fff",
	});

	// apply the properties passed through
	win.applyProperties(args);

	// create the nav bar
	createNavBar(win);

	// tabgroup is a view
	tabGroup = Ti.UI.createView({
		height : 55,
		bottom : 0,
		layout : "horizontal",
		backgroundColor : "#CCC"
	});

	win.add(tabGroup);

	// open the tabGroup window
	tabGroup.open = function() {
		win.open();
	};

	// position the tabs based on count / %age
	args.tabs.forEach(function(tab) {
		tabGroup.add(tab);
		tab.setWidth((99 / args.tabs.length) + "%");

		tab.window.top = 45;
		tab.window.bottom = 55;
		tab.window.visible = false;

		win.add(tab.window);

		tab.window.children.forEach(function(child) {
			tab.window.add(child);
		});

	});

	args.tabs[0].window.visible = true;

	win.navBar.winTitle.text = args.tabs[0].window.title;

	// set our default (first) tab
	var lastTab = args.tabs[0];

	// set initial highlights / active elements
	lastTab.icon.__backgroundImage = lastTab.icon.backgroundImage;
	lastTab.caption.__color = lastTab.caption.color;

	lastTab.icon.backgroundImage = lastTab.icon.backgroundActiveImage;
	lastTab.caption.color = lastTab.activeColor;

	tabGroup.activeTab = args.tabs[0];

	// clicking a tab
	tabGroup.addEventListener("click", function(e) {

		// if we have a lastTab, reset it
		if (lastTab) {
			lastTab.window.visible = false;
			lastTab.icon.backgroundImage = lastTab.icon.__backgroundImage;
			lastTab.caption.color = lastTab.caption.__color;
		}

		// make the tab window visible

		e.source.window.visible = true;

		// set the activeTab property
		tabGroup.activeTab = e.source;

		// hightlight the caption / icon
		e.source.icon.__backgroundImage = e.source.icon.backgroundImage;
		e.source.icon.backgroundImage = e.source.icon.backgroundActiveImage;

		e.source.caption.__color = e.source.caption.color;
		e.source.caption.color = e.source.activeColor;

		// set the title to the current view title
		win.navBar.winTitle.text = e.source.window.title;

		
		// emulate the focus event
		tabGroup.fireEvent("focus", {
			type : "focus",
			previousTab : lastTab,
			previousIndex : _.indexOf(args.tabs,lastTab),
			tab : e.source,
			index :  _.indexOf(args.tabs,e.source),
			source: tabGroup	
		});

		// save the current / last tab selected
		lastTab = e.source;

	});

	return tabGroup;
};

exports.createTab = function(args) {

	if (OS_IOS) {
		return Ti.UI.createTab(args);
	}

	// create an instance of a tab
	var tab = Ti.UI.createView(args);

	// if we have an icon, use it
	if (args.icon) {
		var icon = Ti.UI.createView({
			backgroundImage : args.icon,
			backgroundActiveImage : args.activeIcon,
			width : 26,
			height : 26,
			color : "#F00",
			top : 6,
			touchEnabled : false
		});
	}

	// create the caption
	var caption = Ti.UI.createLabel({
		text : args.title,
		color : "black",
		bottom : 2,
		font : {
			fontSize : 11
		},
		touchEnabled : false
	});

	// cache the icon / caption against the tab, easier to get at later
	tab.icon = icon;
	tab.caption = caption;

	tab.add(icon);
	tab.add(caption);

	tab.open = function(args) {
		// double check we're dealing with a window
		if (args.toString().indexOf("TiUIWindow")) {

			createNavBar(args);

			args.leftNavButton.title = "‹ " + tabGroup.activeTab.title;

			args.leftNavButton.visible = true;

			args.leftNavButton.addEventListener("click", function() {
				args.close();
				args = null;
			});

			args.open();
		} else {
			// throw the developer a bone
			throw "You need to pass a TiUIWindow";
		}

	};

	return tab;
};

exports.createWindow = function(args) {

	if (OS_IOS) {
		return Ti.UI.createWindow(args);
	}

	var win = Ti.UI.createView(args);

	return win;
};
