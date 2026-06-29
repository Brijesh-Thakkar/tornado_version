
// code to make apps universal

// templates for various devices
var DeviceTemplateTable = {
    "iPad":"sheetdata",
    "iPhone":"sheetdata1",
    "iPod":"sheetdata1",
    "default": "sheetdata" // make sure to keep a default
};
// footers for various devices
var DeviceFooterTable = {
    
    "iPad":'<table align="center"> <tr><td><div data-role="controlgroup" data-type="horizontal"><div id="footerbtn1" data-role="button" class="ui-btn-active ui-btn ui-corner-all" onclick="activateFooterBtn(1)"><H1>Intro</H1></div><div id="footerbtn2"  class="ui-btn ui-corner-all" data-role="button" onclick="activateFooterBtn(2)"><H1>Summary</H1></div><div id="footerbtn3" class="ui-btn ui-corner-all"  data-role="button" onclick="activateFooterBtn(3)"><H1>Monthly</H1></div><div id="footerbtn4" class="ui-btn ui-corner-all"  data-role="button" onclick="activateFooterBtn(4)"><H1>Weight</H1></div><div id="footerbtn5"  class="ui-btn ui-corner-all" data-role="button" onclick="activateFooterBtn(5)"><H1>Running</H1></div><div id="footerbtn6"  class="ui-btn ui-corner-all" data-role="button" onclick="activateFooterBtn(6)"><H1>Swimming</H1></div><div id="footerbtn7" class="ui-btn ui-corner-all"  data-role="button" onclick="activateFooterBtn(7)"><H1>Other</H1></div><div id="footerbtn8" class="ui-btn ui-corner-all"  data-role="button" onclick="activateFooterBtn(8)"><H1>Meal</H1></div><div id="footerbtn9" class="ui-btn ui-corner-all"  data-role="button" onclick="activateFooterBtn(9)"><H1>Meal</H1></div></div></td></tr></table>' ,

    
    "iPhone":'<table align="center"><tr><td><div data-role="controlgroup" data-type="horizontal"><div id="footerbtn1" data-role="button" class="ui-btn-active ui-btn ui-corner-all" onclick="activateFooterBtn(1)"><H1><small>Note</small></H1></div><div id="footerbtn2"  data-role="button" class="ui-btn ui-corner-all" onclick="activateFooterBtn(2)"><H1><small>Sum</small></H1></div><div id="footerbtn3" class="ui-btn ui-corner-all" data-role="button" onclick="activateFooterBtn(3)"><H1><small>Log1</small></H1></div><div id="footerbtn4" class="ui-btn ui-corner-all" data-role="button" onclick="activateFooterBtn(4)"><H1><small>Log2</small></H1></div><div id="footerbtn5" class="ui-btn ui-corner-all" data-role="button" onclick="activateFooterBtn(5)"><H1><small>Log3</small></H1></div><div></td></tr></table>',
    
    "iPod":'<table align="center"><tr><td><div data-role="controlgroup" data-type="horizontal"><div id="footerbtn1" data-role="button" class="ui-btn-active" onclick="activateFooterBtn(1)"><H1><small>Note</small></H1></div><div id="footerbtn2"  data-role="button" onclick="activateFooterBtn(2)"><H1><small>Sum</small></H1></div><div id="footerbtn3"  data-role="button" onclick="activateFooterBtn(3)"><H1><small>Log1</small></H1></div><div id="footerbtn4"  data-role="button" onclick="activateFooterBtn(4)"><H1><small>Log2</small></H1></div><div id="footerbtn5"  data-role="button" onclick="activateFooterBtn(5)"><H1><small>Log3</small></H1></div><div></td></tr></table>',
    
    
    "default": '<table align="center"> <tr><td><div data-role="controlgroup" data-type="horizontal"><div id="footerbtn1"  data-role="button"  class="ui-btn-active" onclick="activateFooterBtn(1)"><H1>Intro</H1></div><div id="footerbtn2"  data-role="button" onclick="activateFooterBtn(2)"><H1>Summary</H1></div></div><div data-role="controlgroup" data-type="horizontal"><div id="footerbtn3"  data-role="button" onclick="activateFooterBtn(3)"><H1>Monthly<br>Memos</H1></div>    <div id="footerbtn4"  data-role="button" onclick="activateFooterBtn(4)"><H1>Weight<br>Training</H1></div><div id="footerbtn5"  data-role="button" onclick="activateFooterBtn(5)"><H1>Running<br>Activity</H1></div><div id="footerbtn6"  data-role="button" onclick="activateFooterBtn(6)"><H1>Swimming<br>Activity</H1></div><div id="footerbtn7"  data-role="button" onclick="activateFooterBtn(7)"><H1>Other<br>Activities</H1></div><div id="footerbtn8"  data-role="button" onclick="activateFooterBtn(8)"><H1>Meal<br>W1</H1></div><div id="footerbtn9"  data-role="button" onclick="activateFooterBtn(9)"><H1>Meal<br>W2</H1></div></div></td></tr></table>'


};





var DeviceHeaderTable = {
    
    "iPad":'<div class="ui-grid-solo"><div class="ui-block-a"><div data-role="controlgroup" data-inline="true" data-type="horizontal"><!--<div data-role="button" class="ui-btn ui-corner-all" data-inline="true" data-mini="true" onclick="showEmailComposer();">Email</div>--><a class="ui-btn ui-corner-all" href="email.html" data-role="button" data-mini="true"  data-inline="true">Email</a><div data-role="button" class="ui-btn ui-corner-all" data-inline="true" data-mini="true"  onclick="showPrintDialog();">Print</div><a class="ui-btn ui-corner-all" href="file.html" data-role="button" data-mini="true"  data-inline="true">File</a><a href="helpipad.html" class="ui-btn ui-corner-all" data-role="button" data-mini="true" data-inline="true">Help</a><span id="indexPage-fname" style="vertical-align:middle;display:none">default</span></div></div></div>' ,

    "iPhone": '<div class="ui-grid-solo"><div class="ui-block-a"><div data-role="controlgroup" data-inline="true" data-type="horizontal"><a class="ui-btn ui-corner-all" href="email.html" data-role="button" data-mini="true"  data-inline="true"><small>Email</small></a><div class="ui-btn ui-corner-all" data-role="button" data-inline="true" data-mini="true"  onclick="showPrintDialog();"><small>Print</small></div><a class="ui-btn ui-corner-all" href="file.html" data-role="button" data-mini="true"  data-inline="true"><small>File</small></a><!-- <div data-role="button" data-inline="true" onclick="showhelp();"><small>Help</h1></small> --><a href="helpphone.html" class="ui-btn ui-corner-all" data-role="button" data-mini="true" data-inline="true"><small>Help</small></a><span id="indexPage-fname" style="vertical-align:middle;display:none"><small>default</small></span></div></div></div>',
    
    "iPod": '<div class="ui-grid-solo"><div class="ui-block-a"><div data-role="controlgroup" data-inline="true" data-type="horizontal"><div data-role="button" data-inline="true" data-mini="true" onclick="showEmailComposer();"><small>Email</small></div><div data-role="button" data-inline="true" data-mini="true"  onclick="showPrintDialog();"><small>Print</small></div><a href="file.html" data-role="button" data-mini="true"  data-inline="true"><small>File</small></a><!-- <div data-role="button" data-inline="true" onclick="showhelp();"><small>Help</h1></small> --><a href="helpphone.html" data-role="button" data-mini="true" data-inline="true"><small>Help</small></a><span id="indexPage-fname" style="vertical-align:middle;display:none"><small>default</small></span></div></div></div>',
    
    
    "default": '<div class="ui-grid-solo"><div class="ui-block-a"><div data-role="controlgroup" data-inline="true" data-type="horizontal"><!--<div data-role="button" class="ui-btn ui-corner-all" data-inline="true" data-mini="true" onclick="showEmailComposer();">Email</div>--><a class="ui-btn ui-corner-all" href="email.html" data-role="button" data-mini="true"  data-inline="true">Email</a><div data-role="button" class="ui-btn ui-corner-all" data-inline="true" data-mini="true"  onclick="showPrintDialog();">Print</div><a class="ui-btn ui-corner-all" href="file.html" data-role="button" data-mini="true"  data-inline="true">File</a><a href="helpipad.html" class="ui-btn ui-corner-all" data-role="button" data-mini="true" data-inline="true">Help</a><span id="indexPage-fname" style="vertical-align:middle;display:none">default</span></div></div></div>'
    
    
};





function getDeviceType()
{
    console.log("user agent is:"+navigator.userAgent)
    if (navigator.userAgent.match(/iPod/)) return "iPod";
    if (navigator.userAgent.match(/iPad/)) return "iPad";
    if (navigator.userAgent.match(/iPhone/)) return "iPhone";
    return "default";
}
function getSheetDataForDevice()
{
    var devicetype = getDeviceType();
    console.log("device is "+devicetype);
    var sheetdataid = DeviceTemplateTable["default"];
    if (DeviceTemplateTable.hasOwnProperty(devicetype))
    {
        sheetdataid = DeviceTemplateTable[devicetype];     
    }
    console.log("sheetdataid is:"+sheetdataid)
    return document.getElementById(sheetdataid).value
}

function renderFooterForDevice() 
{
    var devicetype = getDeviceType();
    console.log("device is "+devicetype);
    var footer = DeviceFooterTable[devicetype];
    console.log(footer);
    $('[data-role="footer"]').html(footer).trigger('create');
}




function renderHeaderForDevice()
{
    var devicetype = getDeviceType();
    console.log("device is "+devicetype);
    var header = DeviceHeaderTable[devicetype];
    console.log(header);
    $('[data-role="header"]').html(header).trigger('create');
    
}

 




function isDefaultInputPrompt()
{
    var devicetype = getDeviceType();
    if ((devicetype == "iPhone") || (devicetype == "iPod"))
    {
	return true;
    }
    return false;
}