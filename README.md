


# ![alt text](https://raw.githubusercontent.com/tseiman/ATFunctionalRunnerEL/master/icons/png/icon64x64.png) ATFunctionalRunnerEL 


**NOTE: this is highly experimental and meant for self education - it it neither meant to be good code or an example of good coding**
**it is as well not meant to be secure software by purpose - testing tools are there to perform tests which requires a lot of freedom**


ATFunctionalRunner(EL) is meant to be a functional script-able test framework which gives some graphical representation of acquired data and the possibility to interact e.g. with a device under test. Originally it was meant to control IoT modems via AT commands, fetching unsolicited messages and polling information such as RSSI values and display those in a graph etc. Nevertheless the use of the tool might be far beyond that.

ATFunctionalRunner(EL) is a Electron application (yes electron, yes insecure, yes hipster yes javascript ....) (originally it was node.js...) which brings up a screen which can be more or less freely populated with different widgets (by definition trough XML) such as Input/Output text fields or Graphs. In the back-end a user defined JavaScript is executed in a sand-box which allows to interact with the GUI and which can perform various IO - such as IO over COM ports towards IoT modems (but for sure much more).



