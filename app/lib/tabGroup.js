// global vars
var tabGroup, win, background;

// get some basic device details
var device = {
    height: OS_IOS ? Ti.Platform.displayCaps.getPlatformHeight() : (Ti.Platform.displayCaps.getPlatformHeight() / (Ti.Platform.displayCaps.dpi / 160)),
    width: OS_IOS ? Ti.Platform.displayCaps.getPlatformWidth() : (Ti.Platform.displayCaps.getPlatformWidth() / (Ti.Platform.displayCaps.dpi / 160))
};

// creates an iOS style navbar with title, back support.
function createNavBar(w) {

    var navBar = Ti.UI.createView({
        height: OS_IOS ? 65 : 65,
        top: 0,
        backgroundColor: w.navTintColor || "#CCC"
    });

    var back = Ti.UI.createButton({
        left: 15,
        bottom: 5,
        top: 6,
        title: "< back",
        color: w.navTextColor || "#000",
        backgroundImage: "null",
        visible: false
    });

    var winTitle = Ti.UI.createLabel({
        top: 10,
        color: w.navTextColor || "#000",
        font: {
            fontWeight: "bold",
            fontSize: 18
        },
        text: w.title
    });

    w.leftNavButton = back;
    w.navBar = navBar;

    navBar.winTitle = winTitle;
    navBar.add(back);
    navBar.add(winTitle);

    w.add(navBar);
}

// create our tabGroup
exports.createTabGroup = function(args) {

    if (OS_IOS) {
        return Ti.UI.createTabGroup(args);
    }

    // host heavyweight window
    win = Ti.UI.createWindow(args);

    // create the nav bar
    if (args.hasNavBar === true) createNavBar(win);

    // tabgroup is a view
    tabGroup = Ti.UI.createView({
        zIndex: 1000,
        height: 56,
        bottom: 0,
        //layout: "horizontal",
        backgroundColor: args.tabsBackgroundColor || "#CCC",
        backgroundImage: args.tabsBackgroundImage || null
    });

    tabGroup.add(Ti.UI.createView({
        height: 1,
        width: Ti.UI.FILL,
        backgroundColor: "#EEE"
    }));

    var background = Ti.UI.createView();

    background.applyProperties({
        zIndex: 1,
        height: 20,
        bottom: 0,
        borderRadius: 100,
        //left: (_.indexOf(args.tabs, selectedTab) * selectedTab.rect.width) + (selectedTab.rect.width / 2),
        width: 10,
        opacity: 0,
    });

    tabGroup.add(background);
    tabGroup.background = background;
    tabGroup.autoHideCaptions = args.autoHideCaptions;

    win.add(tabGroup);

    function showTabGroup() {
        tabGroup.show();
        tabGroup.animate({
            bottom: 0,
            duration: 150
        }, function() {

        });
    }

    function hideTabGroup() {
        tabGroup.animate({
            bottom: -112,
            duration: 150
        }, function() {
            tabGroup.hide();
        });
    }

    if (args.autoHide === true) {
        var y = 0,
            yPos;

        args.tabs[0].window.addEventListener("scroll", function(e) {

            yPos = e.y || e.firstVisibleItem;

            if (yPos > y && tabGroup.visible) {
                hideTabGroup();
            }

            if ((yPos < y) || e.firstItemVisible === 0 && !tabGroup.visible) {
                showTabGroup();
            }

            y = yPos;
        });
    }

    // open the tabGroup window
    tabGroup.open = function() {
        win.open();
    };

    var tabCount = 1;

    // position the tabs based on count / %age
    args.tabs.forEach(function(tab) {

        tabGroup.add(tab);

        tab.applyProperties({
            left: (tabCount - 1) * (device.width / tabCount),
            width: (100 / args.tabs.length) + "%"
        });

        if (win.navBar) tab.window.top = 45;
        //tab.window.bottom = 56;
        tab.window.visible = false;

        win.add(tab.window);

        tab.window.children.forEach(function(child) {
            tab.window.add(child);
        });

        tabCount++;
    });

    args.tabs[0].window.visible = true;

    // holds the last tab
    var lastTab;

    if (win.navBar) {
        win.navBar.winTitle.applyProperties({
            text: args.tabs[0].window.title,
            color: args.tabs[0].window.navTextColor
        });

        if (lastTab) win.navBar.backgroundColor = lastTab.window.barColor || "#ccc";
    }

    // set initial highlights / active elements
    //lastTab.icon.__backgroundImage = lastTab.icon.backgroundImage;
    //lastTab.caption.__color = lastTab.caption.color;

    //lastTab.icon.backgroundImage = lastTab.icon.backgroundActiveImage;
    //lastTab.caption.color = lastTab.activeColor;

    args.tabs.forEach(function(tab) {
        setActiveTab(tab);
    });

    setActiveTab(args.tabs[0]);

    if (tabGroup.activeTab.selectedBackgroundColor) tabGroup.setBackgroundColor(tabGroup.activeTab.selectedBackgroundColor);

    tabGroup.setActiveTab = function(index) {
        setActiveTab(args.tabs[index]);
    };

    // clicking a tab

    tabGroup.addEventListener("click", function(e) {
        setActiveTab(e);
    });

    function setActiveTab(e) {

        var selectedTab = e.source || e;

        // make the tab window visible
        selectedTab.window.visible = true;

        // if we have a lastTab, reset it
        if (lastTab && lastTab != selectedTab) {
            lastTab.window.visible = false;
            lastTab.icon.backgroundImage = lastTab.icon.__backgroundImage;
            lastTab.caption.color = lastTab.caption.__color;

            if (tabGroup.autoHideCaptions) {
                lastTab.caption.animate({
                    opacity: 0,
                    duration: 50
                });

                lastTab.icon.animate({
                    top: 15,
                    duration: 50
                });
            }
        }

        // hightlight the caption / icon
        selectedTab.icon.__backgroundImage = selectedTab.icon.backgroundImage;
        selectedTab.icon.backgroundImage = selectedTab.icon.backgroundActiveImage || selectedTab.icon.backgroundImage;

        selectedTab.caption.__color = selectedTab.caption.color;
        selectedTab.caption.color = selectedTab.activeColor || "#000";

        if (tabGroup.autoHideCaptions) {
            selectedTab.icon.animate({
                top: 8,
                duration: 50
            });

            selectedTab.caption.animate({
                opacity: 1,
                duration: 50
            });
        }

        tabGroup.background.applyProperties({
            zIndex: 1,
            height: 20,
            bottom: 22,
            borderRadius: 50,
            left: (_.indexOf(args.tabs, selectedTab) * selectedTab.rect.width) + (selectedTab.rect.width / 2),
            width: 10,
            opacity: 0,
            //backgroundColor: "red"
            backgroundColor: selectedTab.selectedBackgroundColor
        });

        tabGroup.background.animate({
            width: 800,
            left: -100,
            right: 0,
            height: 56,
            duration: 50,
            opacity: 1,
            bottom: 0
        }, function() {
            if (tabGroup.activeTab.selectedBackgroundColor) tabGroup.setBackgroundColor(tabGroup.activeTab.selectedBackgroundColor);
        });

        // set the title to the current view title
        if (win.navBar) {
            win.navBar.applyProperties({
                text: "test", //selectedTab.window.title,
                backgroundColor: selectedTab.window.barColor || "#ccc",
            });

            win.navBar.winTitle.applyProperties({
                color: selectedTab.window.navTextColor,
                text: selectedTab.window.title,
            });
        }

        // emulate the focus event
        tabGroup.fireEvent("focus", {
            type: "focus",
            previousTab: lastTab,
            previousIndex: _.indexOf(args.tabs, lastTab),
            tab: selectedTab,
            index: _.indexOf(args.tabs, selectedTab),
            source: tabGroup
        });

        // set the activeTab property
        tabGroup.activeTab = selectedTab;

        // save the current / last tab selected
        lastTab = selectedTab;

        showTabGroup();
    }
    return tabGroup;
};

exports.createTab = function(args) {

    if (OS_IOS) {
        return Ti.UI.createTab(args);
    }

    // create an instance of a tab
    var tab = Ti.UI.createView(args);

    tab.top=1;

    tab.zIndex = 1000;

    // if we have an icon, use it
    if (args.icon) {
        var icon = Ti.UI.createView({
            backgroundImage: args.icon,
            backgroundActiveImage: args.activeIcon,
            width: 24,
            height: 24,
            color: "#F00",
            top: 8,
            touchEnabled: false
        });
    }

    // create the caption
    var caption = Ti.UI.createLabel({
        text: args.title,
        color: args.color || "black",
        bottom: 2,
        opacity: 1,
        font: {
            fontSize: 11
        },
        touchEnabled: false
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
