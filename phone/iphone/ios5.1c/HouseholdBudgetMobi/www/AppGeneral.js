//////////////////////////////
//
//  App General -- These form the general UI and other stuff
//  common to all templated apps
//
//////////////////////////////

var Aspiring = {};

htmlEncryptionKey = "EncryptionKeyisLooooooooooooooooooongEnough";
metaInfoFileName = "MetaFileInfoLoooooooooooooooooooooooooooongEnough";
applicationName = "Household Budget";

function setLastEditedFileName(filename)
{
    // check meta file exists
    var filedata = window.localStorage.getItem(metaInfoFileName);
    var fileobj = {};
    if (filedata) {
	try {
	    fileobj = JSON.parse(filedata);
	} catch (e) {
	    fileobj = {};	    
	}
    } else {
	fileobj = {};
    }
    fileobj["lastedited"] = filename;
    window.localStorage.setItem(metaInfoFileName, JSON.stringify(fileobj));
}

function getLastEditedFileName()
{
    var filedata = window.localStorage.getItem(metaInfoFileName);
    if (filedata) {
	try {
	    var fileobj = JSON.parse(filedata);
	    return fileobj["lastedited"]
	} catch (e) {
	    return null;
	}
    }
    return null;
}

function getLastEditedFileData()
{
    console.log("in init file data")
    var lasteditedfile = getLastEditedFileName();
    console.log("in init file data name:"+lasteditedfile)
    if (lasteditedfile) {
	if (lasteditedfile != "default") {
	    var filedata = window.localStorage.getItem(lasteditedfile);
	    if (filedata != null)
		return decodeURIComponent(filedata);
	} else {
	    return document.getElementById("sheetdata").value
	}
    }
    console.log("no init file data")
    return null;
}


function showEmailComposer()
{
    var control = SocialCalc.GetCurrentWorkBookControl();
    var content = control.workbook.spreadsheet.CreateSheetHTML();
    //alert("b4 show");
    window.plugins.emailComposer.showEmailComposer("Household Budget",content, "", "", "",true);
    //confirm("after show");
    //var inp = prompt("enter value");
    //alert(inp);
}

function deleteFileInDropBox() {
    alert("in delete");
    var promise = dropbox.deletePath("/test.msc");
    
    alert("done");
}

function saveFileToDropBox() {
    var control = SocialCalc.GetCurrentWorkBookControl();
    var content = control.workbook.spreadsheet.CreateSheetHTML();
    var promise1 = dropbox.createFile("/test.msc");
    promise1.done(function () {dropbox.writeString("/test.msc",content).done(alert('done'))});
    promise1.fail(alert("create file failed"));
}

var AUTH_CODE = '';
var CLIENT_ID = '488202883318.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';
var CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
var REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

function gdHandleClientLoad() {
    alert('test1');
    window.setTimeout(gdCheckAuth, 1);
}

function gdCheckAuth() {
    alert('test2');
    gapi.auth.authorize(
                        {'client_id': CLIENT_ID, 'scope': SCOPES, client_secret: CLIENT_SECRET,
                        'immediate': true, redirect_uri: REDIRECT_URI},
                        gdHandleAuthResult);
}

function gdHandleAuthResult(authResult) {
    alert('done');
}

function showPrintDialog()
{
    var control = SocialCalc.GetCurrentWorkBookControl();
    var html = control.workbook.spreadsheet.CreateSheetHTML();
    var promise = PrintPlugin.print(html);
    //promise.always(alert('print done'));
}

function showBuyLink()
{
    window.open("http://itunes.apple.com/us/app/angry-birds-rio/id420635506?mt=8&uo=4");
}
function showHelp()
{
    var strPath = String(window.location);
    var path = strPath.substr(0,strPath.lastIndexOf("/"));
    PhoneGap.exec('ChildBrowserCommand.showWebPage',encodeURI(path + '/help.html'));
    
}


SocialCalc.oldBtnActive = 1;

function getSheetIds() {
    var control = SocialCalc.GetCurrentWorkBookControl();
    var sheets = [];
    for (key in control.sheetButtonArr) {
        //console.log(key);
        sheets.push(key);
    }
    return sheets;
}


SocialCalc.Callbacks.preSheetSwitch = function(sheetid) {
    
    //var cmdstr = "set A1 constant n 3 \n";
    //var control = SocialCalc.GetCurrentWorkBookControl();
    //console.log("presheetswitch sh id="+sheetid);
    //cmd = {cmdtype:"scmd", id:sheetid, cmdstr: cmdstr, saveundo: false};
    //control.ExecuteWorkBookControlCommand(cmd, false);
    
}


function activateFooterBtn(index) {
    if (index == SocialCalc.oldBtnActive) return;
    
    var oldbtn = "footerbtn"+ SocialCalc.oldBtnActive;
    var newbtn = "footerbtn"+ index;
    
    $("#"+newbtn).addClass("ui-btn-active");
    $("#"+oldbtn).removeClass("ui-btn-active");
    
    var sheets = getSheetIds()
    // disable active edit boxes
    var control = SocialCalc.GetCurrentWorkBookControl();
    var spreadsheet = control.workbook.spreadsheet;
    var ele = document.getElementById(spreadsheet.formulabarDiv.id);
    if (ele) {
        SocialCalc.ToggleInputLineButtons(false);
        var input = ele.firstChild;
        input.style.display="none";
        spreadsheet.editor.state = "start";
    }
    if (SocialCalc.Callbacks.preSheetSwitch) {
        SocialCalc.Callbacks.preSheetSwitch(sheets[index-1]);
    }
    SocialCalc.WorkBookControlActivateSheet(sheets[index-1]);
    if (SocialCalc.Callbacks.postSheetSwitch) {
        SocialCalc.Callbacks.postSheetSwitch(sheets[index-1]);
    }
    
    SocialCalc.oldBtnActive = index;
    
    $("#indexPageSheetName").html($("#"+newbtn).attr("name"))
}

function getFormattedTimestamp(timestr) {
    var d = new Date(timestr);
    if (d) {
	return d.toDateString()
    }
    return "";
}

function getFileDateString(filename) {
    var filedata = window.localStorage.getItem(filename);
    if (filedata) {
	filedata = decodeURIComponent(filedata);
	var data = JSON.parse(filedata);
	if (data && data["timestamp"]) {
	    return getFormattedTimestamp(data["timestamp"])
	}
    }
    return ""
}

function tweakUpdateList() {
    console.log("in list page")
    var ele1 = document.getElementById("filelist1");
    var str = document.getElementById("filelist").innerHTML;
    
    var passwordObject = window.localStorage.getItem(htmlEncryptionKey);
    if (passwordObject)
        passwordObject = JSON.parse(passwordObject);
    protectedImg = '<span style="vertical-align:middle;position: absolute;top:1.2em;"><img src="lib/jquery/images/protected.png" /></span>'
    
    // for each file in the store, replace the template with the filename
    
    // for each file in the store, replace the template with the filename
    var hstr = "";
    var i = 0;
    console.log(window.localStorage.length);
    for (i=0; i < window.localStorage.length; i++) {
        var temp = str;
        if(window.localStorage.key(i).length >=30)
            continue;
        filename = 	window.localStorage.key(i);
	var datestring = "<br><small><i>"+getFileDateString(filename)+"</i></small>";
        temp = temp.replace("!--Template1--",filename+datestring);
        temp = temp.replace("!--Template2--",filename);
        temp = temp.replace("!--Template3--",filename);
        if (passwordObject && passwordObject[filename])
            temp = temp.replace("<!--ProtectedImagePlace-->",protectedImg);
        hstr = hstr + temp;
        
    }
    
    // add the default file name
    var temp = str;
    temp = temp.replace("!--Template1--", "default");
    temp = temp.replace("!--Template2--", "default");
    temp = temp.replace("!--Template3--", "default");
    hstr = hstr + temp;
    
    
    console.log(hstr);
    ele1.innerHTML=hstr;
    console.log("edited list page")
    
}

/*
 $('#listPage').live('pagebeforeshow', function(event) {
 tweakUpdateList();
 });
 */

function saveFileSubmit() {
    console.log("file is:");
    var fname = document.getElementById("saveasname").value;
    var val = SocialCalc.WorkBookControlSaveSheet();
    console.log(val.length);
    var val1 = encodeURIComponent(val);
    console.log(val1.length);
    window.localStorage.setItem(fname, val1);
    alert("Saved as: "+fname)
}


function changePage(pageid) {
    $.mobile.changePage(($(pageid)), { transition: "slideup"} );
}

function updateFileName(fname) {

    if (selectedFile != fname) {
	setLastEditedFileName(fname)
    }
    selectedFile = fname;
    //Aspiring.AutoSave.selectedFile = fname;

    
    document.getElementById("indexPage-fname").innerHTML="Editing: "+fname;
   // document.getElementById("listPage-fname").innerHTML="Editing: "+fname;
    //document.getElementById("filePage-fname").innerHTML="Editing: "+fname;
    
}


function viewFile(filename) {
    //alert("viewFile: "+selectedFile)
    console.log("view file "+filename);
    //$.mobile.showPageLoadingMsg()
    //selectedFile = filename;
    var data = "";
    
    /*Changes for Encryption Implementation Start*/
    
    if (filename != "default") {
        var decrypt = decryptFileOpen(filename); //change
        if (decrypt == true){               //change
            data = window.localStorage.getItem(filename)
            console.log(data.length)
            SocialCalc.WorkBookControlInsertWorkbook(decodeURIComponent(data))
        }
        else{ return;}     //change
        /*Changes for Encryption Implementation End*/
        
    } else {
        data = document.getElementById("sheetdata").value;
        SocialCalc.WorkBookControlInsertWorkbook(data)
    }
    updateFileName(filename);
    
    // reset the editor state
    
    SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.editor.state = "start";
    
    SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.ExecuteCommand('redisplay', '');
    //$.mobile.hidePageLoadingMsg()
    //$.mobile.changePage(($("#indexPage")), { transition: "slideup"} );
    //window.setTimeout(
    //function() {
    //$.mobile.hidePageLoadingMsg()
    //SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.DoOnResize();
    $.mobile.changePage(($("#indexPage")), { transition: "slideup"} );

    window.setTimeout(function() {
    SocialCalc.ScrollRelativeBoth(SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.editor, 1, 0);
    SocialCalc.ScrollRelativeBoth(SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.editor, -1, 0);
    },1000);



    //},2000
    //);
}

/*
function deleteFilePrompt(filename) {
    
    
    if (filename == "default") {
        window.plugins.Prompt.show(
                                   "Cannot Delete File"+filename,
                                   saveAsCancel,
                                   saveAsCancel,
                                   "nope", // ok button title - not used
                                   "OK", // cancel button title
                                   "no"
                                   );
        
        return;
    }
    //Changes for Encryption Implementation Start
    var okfn = function () {
        var decrypt = decryptFileDelete(filename); //change
        if(decrypt == true){                       //change
            deleteFile(filename);
        }
    };
    //Changes for Encryption Implementation End
    
    window.plugins.Prompt.show(
                               "Delete file: "+filename+" ?",
                               okfn,
                               saveAsCancel,
                               "Submit", // ok button title
                               "Cancel", // cancel button title
                               "no"
                               );
}
*/


/* Message Box Delete function */


Aspiring.showPopUp = function(msg) {
    console.log("in popup");
    var callbackfn = function() {
        
        console.log("in popup"+msg);
        
        
        window.plugins.messageBox.prompt({title: 'Message Box', message: msg}, function(button, value) {
                                         var args = Array.prototype.slice.call(arguments, 0);
                                         if(button == 'ok'){
                                         console.log("save as success");
                                         saveAsCancel();
                                         }
                                         else{
                                         //                                     alert("Cancelled");
                                         saveAsCancel();
                                         }
                                         //                                 console.log("button : "+button);
                                         //                                     console.log("1- "+JSON.stringify(args)[0]+"2- "+JSON.stringify(args)[1]);
                                         //                                   console.log("messageBox.prompt:" + JSON.stringify(args));
                                         });

        
        /*
        
        window.plugins.Prompt.show(
                                   msg,
                                   saveAsCancel,
                                   saveAsCancel,
                                   "nope", // ok button title - not used
                                   "OK", // cancel button title
                                   "no"
                                   );   */
    };
    window.setTimeOut(callbackfn, 100);
}




function deleteFileMessage(filename) {
    if (filename == "default") {
        window.plugins.messageBox.alert({title: 'Invalid Request', message: 'Cannot update default file!'}, function(button) {
                                        var args = Array.prototype.slice.call(arguments, 0);
                                        console.log("messageBox.alert:" + JSON.stringify(args));
                                        });        
        return;
    }

    window.plugins.messageBox.confirm({title: 'Delete', message: 'Delete the save file: '+filename+'?'}, function(button) {
                                      if(button == 'yes'){
                                        console.log("yes execution");
                                        var decrypt = decryptFileDelete(filename); //change
                                        if(decrypt == true){                       //change
                                        deleteFile(filename);
                                        console.log('deleted');
                                        }
                                      }
                                      var args = Array.prototype.slice.call(arguments, 0);
                                      console.log("messageBox.confirm:" + JSON.stringify(args));
                                      });
}


function deleteFile(filename) {
    
    
    window.localStorage.removeItem(filename);
    //alert("Deleted file: "+filename)
    tweakUpdateList();
    // refresh the page
    //$("#listPage").refresh();
    
    if (selectedFile == filename) {
        // set the selected file back to default
        updateFileName("default");
        // load the default file into socialcalc
    }
    
}
/*
function saveAsOk(fname) {
    
    // do some validation checks on file name
    if (fname == "default") {
        window.plugins.Prompt.show(
                                   "Cannot update default file \n\n Use another file name",
                                   saveAsCancel,
                                   saveAsCancel,
                                   "nope", // ok button title - not used
                                   "OK", // cancel button title
                                   "no"
                                   );
        return;
    }
    
    if (fname == "") {
        window.plugins.Prompt.show(
                                   "Empty filename, Please use another file name",
                                   saveAsCancel,
                                   saveAsCancel,
                                   "nope", // ok button title - not used
                                   "OK", // cancel button title
                                   "no"
                                   );
        return;
    }
    
    if (fname.length > 30) {
        window.plugins.Prompt.show(
                                   "Filename too long  \n\n Please enter a file name less than 30 characters",
                                   saveAsCancel,
                                   saveAsCancel,
                                   "nope", // ok button title - not used
                                   "OK", // cancel button title
                                   "no"
                                   );
        return;
    }
    
    var val = SocialCalc.WorkBookControlSaveSheet();
    console.log(val.length);
    var val1 = encodeURIComponent(val);
    console.log(val1.length);
    window.localStorage.setItem(fname, val1);
    console.log("saved as "+fname);
    
    // set the top right file to selected file
    updateFileName(fname);
    
    
}
*/

/* Updated saveAsOk*/
function saveAsOk(fname) {
    // do some validation checks on file name
    console.log("running 0");
    if ((fname == "default") || (fname == "Untitled")) {
        window.plugins.messageBox.alert({title: 'Invalid Request', message: 'Cannot update default file!'}, function(button) {
                                        var args = Array.prototype.slice.call(arguments, 0);
                                        console.log("messageBox.alert:" + JSON.stringify(args));
                                        });
        return;
    }
    console.log("running 1");

    if (fname == "") {
        window.plugins.messageBox.alert({title: 'Invalid Request', message: 'Cannot use empty filename'}, function(button) {
                                        var args = Array.prototype.slice.call(arguments, 0);
                                        console.log("messageBox.alert:" + JSON.stringify(args));
                                        });
    return;
    }
    
    console.log("running 2");
    if (fname.length > 30) {
    
        window.plugins.messageBox.alert({title: 'Invalid Request', message: 'Filename too long  \n\n Please enter a file name less than 30 characters'}, function(button) {
                                        var args = Array.prototype.slice.call(arguments, 0);
                                        console.log("messageBox.alert:" + JSON.stringify(args));
                                        });

        return;
    }
    console.log("running 4");

    var val = SocialCalc.WorkBookControlSaveSheet();
    console.log(val.length);
    var val1 = encodeURIComponent(val);
    console.log(val1.length);
    window.localStorage.setItem(fname, val1);
    console.log("saved as "+fname);
    
    // set the top right file to selected file
    updateFileName(fname);
}



function saveAsCancel() {
    console.log("saveas canceled");
}

function saveAsPrompt() {
    //alert("in prompt");
    window.plugins.Prompt.show(
                               "Enter File Name",
                               saveAsOk,
                               saveAsCancel,
                               "Submit", // ok button title (optional)
                               "Cancel", // cancel button title (optional)
                               "yes"
                               );
}

/* replace saveAsPrompt in cordova 2.8.1 */
function saveAsMessage() {
    
    window.plugins.messageBox.prompt({title: 'Save As', message: 'Enter File Name'}, function(button, value) {
                                     var args = Array.prototype.slice.call(arguments, 0);
                                     if(button == 'ok'){
                                     console.log("save as success");
                                     saveAsOk(value);
                                     }
                                     else{
//                                     alert("Cancelled");
                                     saveAsCancel();
                                     }
    //                                 console.log("button : "+button);
//                                     console.log("1- "+JSON.stringify(args)[0]+"2- "+JSON.stringify(args)[1]);
  //                                   console.log("messageBox.prompt:" + JSON.stringify(args));
                                     });
}

function saveCurrentFile() {
    
    if (selectedFile == "default") {
        window.plugins.Prompt.show(
                                   "Cannot update default file! \n\n Use SaveAs",
                                   saveAsCancel,
                                   saveAsCancel,
                                   "nope", // ok button title - not used
                                   "OK", // cancel button title
                                   "no"
                                   );
        return;
    }
    
    console.log("saving current file "+selectedFile)
    var val = SocialCalc.WorkBookControlSaveSheet();
    console.log(val.length);
    var val1 = encodeURIComponent(val);
    console.log(val1.length);
    window.localStorage.setItem(selectedFile, val1);
    console.log("saved as "+selectedFile);
    
    window.plugins.Prompt.show(
                               "Saved file : "+selectedFile,
                               saveAsCancel,
                               saveAsCancel,
                               "nope", // ok button title - not used
                               "OK", // cancel button title
                               "no"
                               );
    
    
}

/* replace saveCurrentFile in cordova 2.8.1 */
function saveCurrentMessage() {
    
    if (selectedFile == "default") {
        
        window.plugins.messageBox.alert({title: 'Invalid Request', message: 'Cannot update default file! \n\n Use Save As'}, function(button) {
                                        var args = Array.prototype.slice.call(arguments, 0);
                                        console.log("messageBox.alert:" + JSON.stringify(args));
                                        });
        return;
    }
    
    console.log("saving current file "+selectedFile)
    var val = SocialCalc.WorkBookControlSaveSheet();
    console.log(val.length);
    var val1 = encodeURIComponent(val);
    console.log(val1.length);
    window.localStorage.setItem(selectedFile, val1);
    console.log("saved as "+selectedFile);

    window.plugins.messageBox.alert({title: 'Confirmation', message: 'Saved file :'+selectedFile}, function(button) {
                                    var args = Array.prototype.slice.call(arguments, 0);
                                    console.log("messageBox.alert:" + JSON.stringify(args));
                                    });
}


//edited by rajeev - parameter: link --> data

function logoAddOk(link) {
    console.log(link);
    
    var i=1;
    
    var cmd = 'set F4 text t <img src="'+link+'" height="100px" align="middle"></img>'+"\n"
    console.log(cmd);
    var control = SocialCalc.GetCurrentWorkBookControl();
    
    var currsheet = control.currentSheetButton.id
    
    if (currsheet == "sheet1" || currsheet == "sheet2" || currsheet == "sheet3" || currsheet == "sheet4")
    {
        
        cmd = {cmdtype:"scmd", id:currsheet, cmdstr: cmd, saveundo: false};
        control.ExecuteWorkBookControlCommand(cmd, false);
        
    }
   // SocialCalc.Dropbox.Session = "false";
   // $.mobile.changePage("indexPage");
    
}







function logoRemoveOk() {
    console.log("remove logo")
    var cmd = 'erase F4 formulas'
    
    var control = SocialCalc.GetCurrentWorkBookControl();
    var currsheet = control.currentSheetButton.id
    
    if (currsheet == "sheet1" || currsheet == "sheet2" || currsheet == "sheet3" || currsheet == "sheet4")
    {
        cmd = {cmdtype:"scmd", id:currsheet, cmdstr: cmd, saveundo: false};
        control.ExecuteWorkBookControlCommand(cmd, false);
    }
    
    
}


/*
function showHelp()
{
    var strPath = String(window.location);
    var path = strPath.substr(0,strPath.lastIndexOf("/"));
    console.log(path)
    Cordova.exec('ChildBrowserCommand.showWebPage',encodeURI(path + '/definitions.html'));
    
}

*/

function showAddLogo() {
   /* window.plugins.Prompt.show(
                               "Enter Image Url",
                               logoAddOk,
                               saveAsCancel,
                               "Submit", // ok button title (optional)
                               "Cancel", // cancel button title (optional)
                               "yes"
                               ); */
    
    
    window.plugins.messageBox.prompt({title: 'Add Logo', message: 'Enter Image Url'}, function(button, value) {
                                     var args = Array.prototype.slice.call(arguments, 0);
                                     if(button == 'ok'){
                                     console.log("save as success");
                                     logoAddOk;
                                     }
                                     else{
                                     //                                     alert("Cancelled");
                                     saveAsCancel();
                                     }
                                     //                                 console.log("button : "+button);
                                     //                                     console.log("1- "+JSON.stringify(args)[0]+"2- "+JSON.stringify(args)[1]);
                                     //                                   console.log("messageBox.prompt:" + JSON.stringify(args));
                                     });
    
    
        
    
}


//edited by rajeev
//var SocialCalc.Dropbox = {};
//var SocialCalc.Dropbox.Session="false";

/*
function showAddLogo(){
    console.log("addlogo event received");
    $.mobile.changePage("dropbox-list.html");
//    SocialCalc.Dropbox.Session = "true";
}

 */

function showClearLogo() {
   /* window.plugins.Prompt.show(
                               "Remove Logo ?",
                               logoRemoveOk,
                               saveAsCancel,
                               "Submit", // ok button title
                               "Cancel", // cancel button title
                               "no"
                               ); */
    
    
    window.plugins.messageBox.prompt({title: 'Remove Logo', message: 'Remove Logo ?'}, function(button, value) {
                                     var args = Array.prototype.slice.call(arguments, 0);
                                     if(button == 'ok'){
                                     console.log("save as success");
                                     logoRemoveOk;
                                     }
                                     else{
                                     //                                     alert("Cancelled");
                                     saveAsCancel();
                                     }
                                     //                                 console.log("button : "+button);
                                     //                                     console.log("1- "+JSON.stringify(args)[0]+"2- "+JSON.stringify(args)[1]);
                                     //                                   console.log("messageBox.prompt:" + JSON.stringify(args));
                                     });

    
    
    
}

function isFilePassworded(filename) {
    var passwordObject = window.localStorage.getItem(htmlEncryptionKey);
    if (passwordObject)
	passwordObject = JSON.parse(passwordObject);
    else
	passwordObject = {};
    
    if (passwordObject && passwordObject[filename])
    {
	return true;
    }
    return false;
}

function encryptFile(){
	var passwordObject = window.localStorage.getItem(htmlEncryptionKey);
	if (passwordObject)
		passwordObject = JSON.parse(passwordObject);
	else
		passwordObject = {};
	var promptFile= function(filename){
        
        if(filename ==''){
            navigator.notification.alert("Filename cannot be empty",null,applicationName);
            return;
        }
        else if(filename.length>=30){
            navigator.notification.alert("Filename cannot be more than 30 characters",null,applicationName);
            return;
        }
        if (window.localStorage.getItem(filename)){
            navigator.notification.alert("File with the same name already exists",null,applicationName);
            return;
        }
        var promptPass = function passString(passString){
            if(passString ==''){
                navigator.notification.alert("Password cannot be empty",null,applicationName);
                return;
            }
            else if(passString.length>=30){
                navigator.notification.alert("Password cannot be more than 30 characters",null,applicationName);
                return;
            }
            
            passwordObject[filename] = passString;
            var val = SocialCalc.WorkBookControlSaveSheet();
            console.log(val.length);
            var val1 = encodeURIComponent(val);
            console.log(val1.length);
            window.localStorage.setItem(filename, val1);
            passwordObject = JSON.stringify(passwordObject);
            window.localStorage.setItem(htmlEncryptionKey,passwordObject);
	    updateFileName(filename);
        }
       
        window.plugins.messageBox.prompt({title: 'Save', message: 'Enter Password'}, function(button, value) {
                                         var args = Array.prototype.slice.call(arguments, 0);
                                         if(button == 'ok'){
                                         console.log("save as success");
                                         promptPass(value);
                                         }
                                         else{
                                         //                                     alert("Cancelled");
                                         saveAsCancel();
                                         }
                                         
                                         });
        
        
       /* window.plugins.Prompt.show(
                                   "Enter Password",
                                   promptPass,
                                   null,
                                   "Submit", // ok button title (optional)
                                   "Cancel", // cancel button title (optional)
                                   "yes"
                                   ); */
    }
    
   /* window.plugins.Prompt.show(
                               "Enter File Name",
                               promptFile,
                               null,
                               "Submit", // ok button title (optional)
                               "Cancel", // cancel button title (optional)
                               "yes"
                               ); */
    
    window.plugins.messageBox.prompt({title: 'Save', message: 'Enter File'}, function(button, value) {
                                     var args = Array.prototype.slice.call(arguments, 0);
                                     if(button == 'ok'){
                                     console.log("save as success");
                                     promptFile(value);
                                     }
                                     else{
                                     //                                     alert("Cancelled");
                                     saveAsCancel();
                                     }
                                     
                                     });

    
    
    
    
}

function decryptFileOpen(filename){
    var passwordObject = window.localStorage.getItem(htmlEncryptionKey);
    console.log(passwordObject);
	passwordObject = JSON.parse(passwordObject);
    
	
	if (!passwordObject){
		return true;	
	}
	if (!passwordObject[filename]){
		return true;
	}
	
	var promptPass = function(passString){
        
        if (passString == passwordObject[filename])
        {
            data = window.localStorage.getItem(filename);
            console.log(data.length);
            SocialCalc.WorkBookControlInsertWorkbook(decodeURIComponent(data));
            SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.editor.state = "start";
            SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.ExecuteCommand('redisplay', '');
            updateFileName(filename);

            $.mobile.changePage(($("#indexPage")), { transition: "slideup"} );


	    window.setTimeout(function() {
		SocialCalc.ScrollRelativeBoth(SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.editor, 1, 0);
		SocialCalc.ScrollRelativeBoth(SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.editor, -1, 0);
	    },1000);

            
        } 
        else
        {
            navigator.notification.alert("You have entered wrong Password",null,applicationName);
		}
    }
    
  /*   window.plugins.Prompt.show(
                               "Enter password for this File",
                               promptPass,
                               null,
                               "Submit", // ok button title (optional)
                               "Cancel", // cancel button title (optional)
                               "yes"
                               ); */
    
    window.plugins.messageBox.prompt({title: 'Save', message: 'Enter Password'}, function(button, value) {
                                     var args = Array.prototype.slice.call(arguments, 0);
                                     if(button == 'ok'){
                                     console.log("save as success");
                                     promptPass(value);
                                     }
                                     else{
                                     //                                     alert("Cancelled");
                                     saveAsCancel();
                                     }
                                     
                                     });    
    
    return false;
}

function decryptFileDelete(filename){
    var passwordObject = window.localStorage.getItem(htmlEncryptionKey);
    console.log(passwordObject);
	passwordObject = JSON.parse(passwordObject);
    
	
	if (!passwordObject){
		return true;	
	}
	if (!passwordObject[filename]){
		return true;
	}
	
	var promptPass = function(passString){
        
        if (passString == passwordObject[filename])
        {
            deleteFile(filename);
            delete passwordObject[filename];
            passwordObject = JSON.stringify(passwordObject);
            window.localStorage.setItem(htmlEncryptionKey,passwordObject);
        } 
        else
        {
            navigator.notification.alert("You have entered wrong Password",null,applicationName);
		}
    }
    
    /*
    window.plugins.Prompt.show(
                               "Enter password for this File",
                               promptPass,
                               null,
                               "Submit", // ok button title (optional)
                               "Cancel", // cancel button title (optional)
                               "yes"
                               ); */
    
    
    window.plugins.messageBox.prompt({title: 'Save', message: 'Enter Password'}, function(button, value) {
                                     var args = Array.prototype.slice.call(arguments, 0);
                                     if(button == 'ok'){
                                     console.log("save as success");
                                     promptPass(value);
                                     }
                                     else{
                                     //                                     alert("Cancelled");
                                     saveAsCancel();
                                     }
                                     
                                     });

    
    
    
    
    return false;
}

function openEmptyFile(){
    
    function promptConfirm(button) {
        
        if (button==1)
        {
            
            sheetData = document.getElementById("emptysheetdata").value;
            console.log(sheetData);
            SocialCalc.WorkBookControlInsertWorkbook(sheetData);
            SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.editor.state = "start";
            SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.ExecuteCommand('redisplay', '');
            $.mobile.changePage(($("#indexPage")), { transition: "slideup"} );
        }
        
    }
    navigator.notification.confirm("Do you want to open a new file without saving current changes ?",promptConfirm,applicationName,"Yes,No");
}


if (!Aspiring) {
    var Aspiring = {};
}


Aspiring.dropbox = function() {
    //console.log("hello");
    var path = "http://www.dropbox.com";
    
    Cordova.exec('ChildBrowserCommand.showWebPage',encodeURI(path));
    console.log(path);
};

Aspiring.dropbox.saveFileToDropBox = function() {
    alert('test');
}



/*
function onSaveClicked() {
    function fail(error) {
        alert(error.code);
    }
    
    function gotFS(fileSystem) {
        var saveToPath = fileSystem.root.fullPath;
        downloadTo( saveToPath );
    }
    
    function downloadTo(path) {
        var fileTransfer = new FileTransfer();
        var imageUri = 'https://si0.twimg.com/profile_images/2284174758/v65oai7fxn47qv9nectx.png';
        var uri = encodeURI(imageUri);
        
        
        function success() {
            console.log('success');
        }
        
        function fail(err) {
          //  console.log('fail:err:'+err);
        }
        
        fileTransfer.download(
                              uri,
                              path + '/' + Date.now() + '.png',
                              function(entry) {
                              console.log("download complete: " + entry.fullPath);
                              window.plugins.SaveToPhotoAlbum.saveToPhotoAlbum( success, fail, entry.fullPath );
                              },
                              function(error) {
                              console.log("download error source " + error.source);
                              console.log("download error target " + error.target);
                              console.log("upload error code" + error.code);
                              }
                              );
    }
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    
    
}
*/

function showHelp()
{
    var strPath = String(window.location);
    var path = strPath.substr(0,strPath.lastIndexOf("/"));
    console.log(path);
    
     var ref1 = window.open(encodeURI(path + '/help.html'), '_self', 'location=yes');
    
    ref1.close();
    
}


Aspiring.appSpecificInputValidation = function(cellname, val) {
    var age = SocialCalc.GetCellDataValue("input1!F6");
    var ra = SocialCalc.GetCellDataValue("input1!F7");
    var le = SocialCalc.GetCellDataValue("input1!F8");
    
    if (cellname == "input1!F6") {
        age = val;
    }
    if (cellname == "input1!F7") {
        ra = val;
    }
    if (cellname == "input1!F8") {
        le = val;
    }
    
    if (age > ra) {
        Aspiring.showPopUp("Age="+age+" cannot be greater than retirement age="+ra);
        return false;
    };
    
    if (ra > le) {
        Aspiring.showPopUp("Retirement age="+ra+" cannot be greater than life expectancy="+le);
        return false;
    };
    
    
    return true;
}


function submitThesis() {
    //alert('hello');
    
    SocialCalc.saveAppData();
    
    window.plugins.Prompt.show(
                               "Set thesis",
                               saveAsCancel,
                               saveAsCancel,
                               "nope", // ok button title - not used
                               "OK", // cancel button title
                               "no"
                               );
    
    
    
}

function clearThesis() {
    //alert('hello');
    
    var clrokfn = function () {  $("#thesisAnalysis").val(''); };
    window.plugins.Prompt.show(
                               "Do you want to clear the analysis ? ",
                               clrokfn,
                               saveAsCancel,
                               "Yes", // ok button title
                               "No", // cancel button title
                               "no"
                               );    
    
}


SocialCalc.saveAppData = function() {
    SocialCalc.AppData = {};
    console.log("saving app data");
    if ($("#radio-choice-1").is(':checked')) {
        console.log("set 1");
        SocialCalc.AppData.radio = 0;
    }
    if ($("#radio-choice-2").is(':checked')) {
        console.log("set 2");
        SocialCalc.AppData.radio = 1;
    }
    if ($("#radio-choice-3").is(':checked')) {
        console.log("set 3");
        SocialCalc.AppData.radio = 2;
    }
    SocialCalc.AppData.thesis =  $("#thesisAnalysis").val() || "";
    
    console.log(SocialCalc.AppData.thesis);
}

function setRadioChecked(id) {
    console.log("here id="+id)
    /*
     if (id == 0)
     $('input:radio[name=radio-grp]:nth(0)').attr('checked',true);
     if (id == 1)
     $('input:radio[name=radio-grp]:nth(1)').attr('checked',true);
     if (id == 2)
     $('input:radio[name=radio-grp]:nth(2)').attr('checked',true);
     */
    var str1 =
    '<input type="radio" name="radio-grp" id="radio-choice-1"'+
    'value="1" checked="true"/>'+
    '<label for="radio-choice-1">Buy</label><br>'+
    '<input type="radio" name="radio-grp" id="radio-choice-2" value="2"  />'+
    '<label for="radio-choice-2">Sell</label><br>'+
    '<input type="radio" name="radio-grp" id="radio-choice-3" value="3"  />'+
    '<label for="radio-choice-3">No Opinion</label>';
    
    var str2 =
    '<input type="radio" name="radio-grp" id="radio-choice-1"'+
    'value="1" />'+
    '<label for="radio-choice-1">Buy</label><br>'+
    '<input type="radio" name="radio-grp" id="radio-choice-2" value="2"  checked="true"/>'+
    '<label for="radio-choice-2">Sell</label><br>'+
    '<input type="radio" name="radio-grp" id="radio-choice-3" value="3"  />'+
    '<label for="radio-choice-3">No Opinion</label>';
    
    var str3 =
    '<input type="radio" name="radio-grp" id="radio-choice-1"'+
    'value="1" />'+
    '<label for="radio-choice-1">Buy</label><br>'+
    '<input type="radio" name="radio-grp" id="radio-choice-2" value="2"  />'+
    '<label for="radio-choice-2">Sell</label><br>'+
    '<input type="radio" name="radio-grp" id="radio-choice-3" value="3"  checked="true"/>'+
    '<label for="radio-choice-3">No Opinion</label>';
    
    
    
    var ele = document.getElementById("buysellsenti");
    if (!ele) return;
    switch (id) {
        case 0: ele.innerHTML = str1;
            break;
        case 1: ele.innerHTML = str2;
            break;
        case 2: ele.innerHTML = str3;
            break;
    };
}


SocialCalc.Callbacks.mustshowprompt = function(coord)
{
    var control = SocialCalc.GetCurrentWorkBookControl();
    var editor = control.workbook.spreadsheet.editor;
    var cellname = editor.workingvalues.currentsheet+"!"+editor.ecell.coord;
    var constraint = SocialCalc.EditableCells.constraints[cellname];
    if (constraint)
    {
	if (constraint[0].slice(0,6)=="prompt")
	    return true;
    }
    // for phone apps always show prompt
    return true;
}
SocialCalc.Callbacks.getinputtype = function(coord)
{
    var control = SocialCalc.GetCurrentWorkBookControl();
    var editor = control.workbook.spreadsheet.editor;
    var cellname = editor.workingvalues.currentsheet+"!"+editor.ecell.coord;
    var constraint = SocialCalc.EditableCells.constraints[cellname];
    if (constraint)
    {
	if (constraint[0].slice(0,5)=="input")
	{
	    var inptype = constraint[0].slice(5);
	    if (inptype == "numeric")
	    {
		return "number";
	    }
	}
    }
    return null;
}
SocialCalc.Callbacks.prompttype = function(coord)
{
    var control = SocialCalc.GetCurrentWorkBookControl();
    var editor = control.workbook.spreadsheet.editor;
    var cellname = editor.workingvalues.currentsheet+"!"+editor.ecell.coord;
    var constraint = SocialCalc.EditableCells.constraints[cellname];
    if (constraint)
    {
	if (constraint[0].slice(0,6)=="prompt")
	{
	    var inptype = constraint[0].slice(6);
	    if (inptype == "numeric")
	    {
		return "numberpad";
	    }
	}
    }
    return null;
}


SocialCalc.Callbacks.showprompt = function(coord) {
    
    var control = SocialCalc.GetCurrentWorkBookControl();
    var editor = control.workbook.spreadsheet.editor;
    var cellname = editor.workingvalues.currentsheet+"!"+editor.ecell.coord;
    var constraint = SocialCalc.EditableCells.constraints[cellname];
    var highlights = editor.context.highlights;
    
    var wval = editor.workingvalues;
    if (wval.eccord) {
        wval.ecoord = null;
        console.log("return due to ecoord")
        return;
    }
    wval.ecoord = coord;
    if (!coord) coord = editor.ecell.coord;
    var text = SocialCalc.GetCellContents(editor.context.sheetobj, coord);
    console.log("in prompt, coord = "+coord+" text="+text);
    
    if (SocialCalc.Constants.SCNoQuoteInInputBox && (text.substring(0,1) == "'")) {
        text = text.substring(1);
    }
    console.log("continue...")
    
    var cell=SocialCalc.GetEditorCellElement(editor, editor.ecell.row, editor.ecell.col);
    
    var cancelfn = function() {
        wval.ecoord = null;
        delete highlights[editor.ecell.coord];
        editor.UpdateCellCSS(cell, editor.ecell.row, editor.ecell.col);
        
    };
    
    var okfn = function(val) {
        var callbackfn = function() {
            console.log("callback val "+val)
            SocialCalc.EditorSaveEdit(editor, val);
        };
        window.setTimeout(callbackfn, 100);
    };
    
    // highlight the cell
    delete highlights[editor.ecell.coord];
    highlights[editor.ecell.coord] = "cursor";
    editor.UpdateCellCSS(cell, editor.ecell.row, editor.ecell.col);
    
    var celltext = "Enter Value";
    var title = "Input";
    if (constraint)
    {
	if (constraint.length > 3) 
	{
	    celltext = constraint[3];
	}
	if (constraint.length > 4)
	{
	    title = constraint[4];
	}
    } else {
	console.log("cell text is null")
    }
    
    var options = {title: title};
    var prompttype = SocialCalc.Callbacks.prompttype(coord)
    if (prompttype) {
        options["type"] = prompttype;
    } else {
	options["type"] = "text";
    }

    options["message"] = celltext;
    console.log("text is "+text);
    options["textvalue"] = text;
    window.plugins.messageBox.prompt(options, function(button, value) {
        var args = Array.prototype.slice.call(arguments, 0);
        if(button == 'ok'){
            console.log("save as success");
            okfn(value);
            
        }
        else{
	    cancelfn();
        }
    });
    
    return true;
}

