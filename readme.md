# TabGroup for Alloy 

## Overview
This demo app for [Appcelerator](http://www.appcelerator.com) [Alloy](http://projects.appcelerator.com/alloy/docs/Alloy-bootstrap/index.html) MVC framework provides an (Android initially although it should work on iOS) DIRECT TabGroup replacement.

This project came out of my talks at [TiConf](http://www.ticonf.org) in New York and Amsterdam where I demonstrated the use of the "module" Alloy attribute to take a standard TabGroup tag and override it, returning a custom element for Android.

The idea was to come up with something that could "just work" on Android and could be implemented by simply adding a module="tabGroup" element to an existing Alloy TabGroup definition.

### NOTE: This is very much "work in progress" and I'm tweaking as I use this in current projects. Please feel free to fork, and submit Pull Requests with any updates. See the wishlist.

## Latest
* Initial commit - tested on Android - on iOS you get a standard TabGroup
* won't support all TabGroup events / properties / methods yet - adding them currently
* test project removes the actionBar for the whole project so we can use our own NavBar

## Features
* Easy to add to existing XML
* Simply add tabGroup.js to the /lib folder and module="tabGroup" to existing TabGroup, Tab and Window definitions within an existing TabGroup
* Easy to customise
* Designed for Android - on iOS it returns standard TabGroup, Tab, Window

### Wishlist
* Support subwindows like normal tabGroups on iOS


## Quick Start
* [Download the latest version of the commonJS module](https://github.com/jasonkneen/com.jasonkneen.tabdemo/blob/master/app/lib/tabGroup.js) 
* copy tabGroup.js to your project /lib folder
* modified your existing TabGroup tags, add module="tabGroup" to the TabGroup, any Tabs and any Window elements in the tabs.

```xml
<Alloy>
	<TabGroup module="tabGroup">
		<Tab module="tabGroup" title="Tab 1" icon="/images/icons/519-tools-1.png" activeIcon="/images/icons/519-tools-1_active.png" activeColor="#fff">
			<Window module="tabGroup" title="Tab 1">
				<Label onClick="openWin1">Tab 1</Label>
			</Window>
		</Tab>
		<Tab module="tabGroup" title="Tab 2" icon="/images/icons/516-archive-box.png" activeIcon="/images/icons/516-archive-box_active.png" activeColor="#fff">
			<Window module="tabGroup"  title="Tab 2">
				<Label onClick="openWin2">Tab 2</Label>
			</Window>
		</Tab>
		<Tab module="tabGroup" title="Tab 3" icon="/images/icons/522-floppy-disk.png" activeIcon="/images/icons/522-floppy-disk_active.png" activeColor="#fff">
			<Window module="tabGroup"  title="Tab 3">
				<Label >Tab 3</Label>
			</Window>
		</Tab>
	</TabGroup>
</Alloy>
```

or simply add the following to JUST the first Alloy tag:

```xml
<Alloy module="tabGroup">
```

## License

<pre>
Copyright 2016 Jason Kneen

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
</pre>
