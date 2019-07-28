
Radium development tree

Radium is a PoS-based cryptocurrency.

Development process
===========================

Developers work in their own trees, then submit pull requests when
they think their feature or bug fix is ready.

The patch will be accepted if there is broad consensus that it is a
good thing.  Developers should expect to rework and resubmit patches
if they don't match the project's coding conventions (see coding.txt)
or are controversial.

The master branch is regularly built and tested, but is not guaranteed
to be completely stable. Tags are regularly created to indicate new
stable release versions of radium.

Feature branches are created when there are major new features being
worked on by several people.

From time to time a pull request will become outdated. If this occurs, and
the pull is no longer automatically mergeable; a comment on the pull will
be used to issue a warning of closure. The pull will be closed 15 days
after the warning if action is not taken by the author. Pull requests closed
in this manner will have their corresponding issue labeled 'stagnant'.

Issues with no commits will be given a similar warning, and closed after
15 days from their last activity. Issues closed in this manner will be 
labeled 'stale'.

Project Structure. 
===========================

This project is written in Typescript and dot net Core (c#). 

This project is a javascript web application that is locally hosted by a 
Kestral server implemented in dot net Core. 


The following files control 
#### Kestral server settings and functions particularly SSL and Listen URL's

- /Program.cs 
- /Startup.cs

#### Used by Webpack to build the main.js at runtime. 
 - /webpack.config.js
- /tsconfig.js


#### Project Folders
| Folder| Purpose|
| ------ | ------ |
|/Assets|Contains media, images, logos, etc|
| /ClientApp |Contains the main GUI files <- Important stuff here|
| /Controllers|Base files required by Kestrel |
| /types |Typescript definitions needed for custom signing lib |
| /Views |Base HTML files required by Kestrel |

#### /ClientApp Folder
| Folder| Purpose|
| ------ | ------ |
|/ClientApp/components | Contains most of the GUI files 
|/ClientApp/css | GUI CSS files|
|/ClientApp/boot.tsx |Loads main APP|
|/ClientApp/routes.tsx |Links url routes to main GUI pages. |

#### /ClientApp/components Folder
| Folder| Purpose|
| ------ | ------ |
|/Global | Various GUI elements that are used in multiple locations.|
|/Language |unfinished translations/localization|
|/MainPages| Code for the main pages of the GUI|

#### /ClientApp/components/Global  Files
(self explanitory files omited)

| FIle| Purpose|
| ------ | ------ |
|/Global/API.tsx | Static class used by all components to call the API to GET or POST data. |
|/Global/settings.tsx | Static class that contains various global vars.|
|/Global/SmartTxSendResultComponent.tsx | Handles the transaction signing and sending of signed smart transactions to the API.|

#### /ClientApp/components/MainPages Folders
(unused code folders omited)

| Folder| Purpose|
| ------ | ------ |
|/MainPages/_interfaces| Reusable data structures|
|/MainPages/AssetClasses| Asset Group GUI components|
|/MainPages/Elections| Election GUI components|
|/MainPages/Loading| Loading, Syncing, and API finding splash pages|
|/MainPages/Login| Login and key generation components|
|/MainPages/_interfaces| Asset Group GUI components|
|/MainPages/MyProfile| Profile page GUI components|
|/MainPages/NetworkStats| Stats page GUI components|
|/MainPages/Records| Records page GUI components|
|/MainPages/SignedMessages| Message signing page GUI components|
|/MainPages/Users| Users page GUI components|