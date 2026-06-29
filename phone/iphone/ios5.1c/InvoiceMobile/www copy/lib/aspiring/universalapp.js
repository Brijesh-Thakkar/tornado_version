
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

function isDefaultInputPrompt()
{
    var devicetype = getDeviceType();
    if ((devicetype == "iPhone") || (devicetype == "iPod"))
    {
	return true;
    }
    return false;
}