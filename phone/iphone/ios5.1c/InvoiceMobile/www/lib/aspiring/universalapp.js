
// code to make apps universal

// templates for various devices
var DeviceTemplateTable = {
    "iPhone":"sheetdata",
    "iPod":"sheetdata",
    "iPad":"sheetdata1",
    "default": "sheetdata" // make sure to keep a default
};
// footers for various devices
var DeviceFooterTable = {
    "iPhone": '<table align="center"> <tr><td><div id="mainfooterdiv" data-role="controlgroup" data-type="horizontal"><div id="footerbtn1"  data-role="button"  class="ui-btn-active" onclick="activateFooterBtn(1)"><small>Type1</small></div><div id="footerbtn2"  data-role="button" onclick="activateFooterBtn(2)"><small>Type2</small></div><div id="footerbtn3"  data-role="button" onclick="activateFooterBtn(3)"><small>Type3</small></div><div id="footerbtn4"  data-role="button" onclick="activateFooterBtn(4)"><small>Detail1</small></div><div id="footerbtn5"  data-role="button" onclick="activateFooterBtn(5)"><small>Detail2</small></div></div></td></tr></table>',

    "iPod": '<table align="center"> <tr><td><div id="mainfooterdiv" data-role="controlgroup" data-type="horizontal"><div id="footerbtn1"  data-role="button"  class="ui-btn-active" onclick="activateFooterBtn(1)"><small>Type1</small></div><div id="footerbtn2"  data-role="button" onclick="activateFooterBtn(2)"><small>Type2</small></div><div id="footerbtn3"  data-role="button" onclick="activateFooterBtn(3)"><small>Type3</small></div><div id="footerbtn4"  data-role="button" onclick="activateFooterBtn(4)"><small>Detail1</small></div><div id="footerbtn5"  data-role="button" onclick="activateFooterBtn(5)"><small>Detail2</small></div></div></td></tr></table>',

    "iPad":'<table align="center"> <tr><td> \
          <div data-role="controlgroup" data-type="horizontal"> \
            <div id="footerbtn1" data-role="button" class="ui-btn-active" onclick="activateFooterBtn(1)"><H1>Invoice 1</H1></div> \
            <div id="footerbtn2"  data-role="button" onclick="activateFooterBtn(2)"><H1>Invoice 2</H1></div> \
            <div id="footerbtn3"  data-role="button" onclick="activateFooterBtn(3)"><H1>Company Invoice 1</H1></div> \
            <div id="footerbtn4"  data-role="button" onclick="activateFooterBtn(4)"><H1>Company Invoice 2</H1></div> \
     <div> \
                        </td></tr> \
    </table>' ,

    "default": '<table align="center"> <tr><td><div id="mainfooterdiv" data-role="controlgroup" data-type="horizontal"><div id="footerbtn1"  data-role="button"  class="ui-btn-active" onclick="activateFooterBtn(1)"><small>Type1</small></div><div id="footerbtn2"  data-role="button" onclick="activateFooterBtn(2)"><small>Type2</small></div><div id="footerbtn3"  data-role="button" onclick="activateFooterBtn(3)"><small>Type3</small></div><div id="footerbtn4"  data-role="button" onclick="activateFooterBtn(4)"><small>Detail1</small></div><div id="footerbtn5"  data-role="button" onclick="activateFooterBtn(5)"><small>Detail2</small></div></div></td></tr></table>'


};





var DeviceHeaderTable = {
    "iPhone": '<div class="ui-grid-solo"><div class="ui-block-a"><div data-role="controlgroup" data-inline="true" data-type="horizontal"><div data-role="button" data-inline="true" data-mini="true" onclick="showEmailComposer();"><small>Email</small></div><div data-role="button" data-inline="true" data-mini="true"  onclick="showPrintDialog();"><small>Print</small></div><a href="file.html" data-role="button" data-mini="true"  data-inline="true"><small>File</small></a><!-- <div data-role="button" data-inline="true" onclick="showhelp();"><small>Help</h1></small> --><a href="helpjq.html" data-role="button" data-mini="true" data-inline="true"><small>Help</small></a><span id="indexPage-fname" style="vertical-align:middle;display:none"><small>default</small></span></div></div></div>',
    
    "iPod": '<div class="ui-grid-solo"><div class="ui-block-a"><div data-role="controlgroup" data-inline="true" data-type="horizontal"><div data-role="button" data-inline="true" data-mini="true" onclick="showEmailComposer();"><small>Email</small></div><div data-role="button" data-inline="true" data-mini="true"  onclick="showPrintDialog();"><small>Print</small></div><a href="file.html" data-role="button" data-mini="true"  data-inline="true"><small>File</small></a><!-- <div data-role="button" data-inline="true" onclick="showhelp();"><small>Help</h1></small> --><a href="helpjq.html" data-role="button" data-mini="true" data-inline="true"><small>Help</small></a><span id="indexPage-fname" style="vertical-align:middle;display:none"><small>default</small></span></div></div></div>',
    
    "iPad":'<div class="ui-grid-solo"><div class="ui-block-a"><div data-role="controlgroup" data-inline="true" data-type="horizontal"><div data-role="button" data-inline="true" data-mini="true" onclick="showEmailComposer();">Email</div><div data-role="button" data-inline="true" data-mini="true"  onclick="showPrintDialog();">Print</div><a href="file.html" data-role="button" data-mini="true"  data-inline="true">File</a><!-- <div data-role="button" data-inline="true" onclick="showhelp();">Help</h1> --><a href="helpjq.html" data-role="button" data-mini="true" data-inline="true">Help1</a><span id="indexPage-fname" style="vertical-align:middle;display:none">default</span></div></div></div>' ,
    
    "default": '<div class="ui-grid-solo"><div class="ui-block-a"><div data-role="controlgroup" data-inline="true" data-type="horizontal"><div data-role="button" data-inline="true" data-mini="true" onclick="showEmailComposer();">Email</div><div data-role="button" data-inline="true" data-mini="true"  onclick="showPrintDialog();">Print</div><a href="file.html" data-role="button" data-mini="true"  data-inline="true">File</a><!-- <div data-role="button" data-inline="true" onclick="showhelp();">Help</h1> --><a href="helpjq.html" data-role="button" data-mini="true" data-inline="true">Help1</a><span id="indexPage-fname" style="vertical-align:middle;display:none">default</span></div></div></div>'
    
    
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