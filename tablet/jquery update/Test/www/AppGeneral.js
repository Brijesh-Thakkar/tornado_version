//////////////////////////////
//
//  App General -- These form the general UI and other stuff
//  common to all templated apps
//
//////////////////////////////
htmlEncryptionKey = "EncryptionKeyisLooooooooooooooooooongEnough";
metaInfoFileName = "MetaFileInfoLoooooooooooooooooooooooooooongEnough";
applicationName = "Fitness Planner";

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

/*
function showEmailComposer()
{
    var control = SocialCalc.GetCurrentWorkBookControl();
    var content = control.workbook.spreadsheet.CreateSheetHTML();
    //alert("b4 show");
    window.plugins.emailComposer.showEmailComposer("Fitness Plan",content, "", "", "",true);
    //confirm("after show");
    //var inp = prompt("enter value");
    //alert(inp);
}

*/






function showFeedback()
{
    var control = SocialCalc.GetCurrentWorkBookControl();
    var content = control.workbook.spreadsheet.CreateSheetHTML();
    var helpstr = "Thank you for being our valued user. We look forward to hearing your feedback.\n"
    window.plugins.emailComposer.showEmailComposer("Fitness Planner - Feedback",helpstr, "marketing@tickervalue.com", "", "",false);
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
    SocialCalc.WorkBookControlActivateSheet(sheets[index-1]);
    
    SocialCalc.oldBtnActive = index;
    
    $("#indexPageSheetName").html($("#"+newbtn).attr("name"))
}

function getFormattedTimestamp(timestr) {
    var d = new Date(timestr);
    if (d) {
	return d.toLocaleString()
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
    Aspiring.AutoSave.selectedFile = fname;

    
    document.getElementById("indexPage-fname").innerHTML="Editing: "+fname;
    //document.getElementById("listPage-fname").innerHTML="Editing: "+fname;
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


function replaceImageUrl(inp)
{
    var out = inp;
    //var ind = out.indexOf("checkmark.png");
    //while (ind != -1) {
    //    out = out.slice(0,ind)+"http://img689.imageshack.us/img689/9234/checkmark.png"+out.slice(ind+13);
    //    ind = out.indexOf("checkmark.png", ind+60);
    //}
    var ind = out.indexOf('<img src="checkmark.png">');
    while (ind != -1) {
        out = out.slice(0,ind)+"&#10004"+out.slice(ind+25);
        ind = out.indexOf('<img src="checkmark.png">', ind+20);
    }
    return out;
}




function getHtmlContentForApp(val)
{
    var result = "";
    var control = SocialCalc.GetCurrentWorkBookControl();
    var currsheet = control.currentSheetButton.id
    
    var currentname = control.currentSheetButton.value;
    
    var appsheets;
    
    switch(val)
    
    {
        case "100000000": appsheets ={sheet1:"sheet1"};
            break;
        case "010000000": appsheets = {sheet2:"sheet2"};
            break;
        case "001000000": appsheets = {sheet3:"sheet3"};
            break;
        case "000100000": appsheets = {sheet4:"sheet4"};
            break;
        case "000010000": appsheets = {sheet5:"sheet5"};
            break;
        case "000001000": appsheets = {sheet6:"sheet6"};
            break;
        case "000000100": appsheets = {sheet7:"sheet7"};
            break;
        case "000000010": appsheets = {sheet8:"sheet8"};
            break;
        case "000000001": appsheets = {sheet9:"sheet9"};
            break;
            
       
            
            
            
    }
    
    
    
    result = SocialCalc.WorkbookControlCreateSheetHTML(appsheets);
    console.log("email size is "+result.length);
    return result;

}



/*email*/
function getFileForEmail(){
   
    
    var t1="0";var t2="0"; var t3="0";var t4="0";var t5="0"; var t6="0"; var t7="0";  var t8="0"; var t9="0"; var t10="0";
    
    var remember1 = document.getElementById('grid-checkbox-1');
    var remember2 = document.getElementById('grid-checkbox-2');
    var remember3 = document.getElementById('grid-checkbox-3');
    var remember4 = document.getElementById('grid-checkbox-4');
    var remember5 = document.getElementById('grid-checkbox-5');
    var remember6 = document.getElementById('grid-checkbox-6');
    var remember7 = document.getElementById('grid-checkbox-7');
    var remember8 = document.getElementById('grid-checkbox-8');
    var remember9 = document.getElementById('grid-checkbox-9');
  //  var remember10 = document.getElementById('grid-checkbox-10');
    if(remember1.checked==true){
        //	alert('reach');
        //alert(encode.substring(0,1));
        //encode = "p"+encode.substring(1,5)+" encode";
        //alert(''+encode);
        t1="1";
    }
    if(remember1.checked==false){
        //	alert('reach');
        //alert(encode.substring(0,1));
        //encode = "n"+encode.substring(1,5)+" encode";
        //alert(''+encode);
        t1="0";
    }
    if(remember2.checked==true){
        t2="1";
        //encode = encode.substring(0,1)+"p"+encode.substring(2,5)+" encode";
    }
    if(remember2.checked==false){
        t2="0";
        //encode = encode.substring(0,1)+"n"+encode.substring(2,5)+" encode";
    }
    if(remember3.checked==false){
        t3="0";;
        //encode = encode.substring(0,2)+"n"+encode.substring(3,5)+" encode";
    }
    if(remember3.checked==true){
        t3="1";
        //encode = encode.substring(0,2)+"p"+encode.substring(3,5)+" encode";
    }
    if(remember4.checked==true){
        t4="1";
        //encode = encode.substring(0,3)+"p"+encode.substring(4,5)+" encode";
    }
    if(remember4.checked==false){
        t4="0";
        //encode = encode.substring(0,3)+"n"+encode.substring(4,5)+" encode";
    }
    if(remember5.checked==true){
        t5="1";
        //encode = encode.substring(0,4)+"p"+" encode";
    }
    if(remember5.checked==false){
        t5="0";
        //encode = encode.substring(0,2)+"n"+" encode";
    }if(remember6.checked==true){
        t6="1";
        //encode = encode.substring(0,4)+"p"+" encode";
    }
    if(remember6.checked==false){
        t6="0";
        //encode = encode.substring(0,2)+"n"+" encode";
    }if(remember7.checked==true){
        t7="1";
        //encode = encode.substring(0,4)+"p"+" encode";
    }
    if(remember7.checked==false){
        t7="0";
        //encode = encode.substring(0,2)+"n"+" encode";
    }if(remember8.checked==true){
        t8="1";
        //encode = encode.substring(0,4)+"p"+" encode";
    }
    if(remember8.checked==false){
        t8="0";
        //encode = encode.substring(0,2)+"n"+" encode";
    }if(remember9.checked==true){
        t9="1";
        //encode = encode.substring(0,4)+"p"+" encode";
    }
    if(remember9.checked==false){
        t9="0";
        //encode = encode.substring(0,2)+"n"+" encode";
    }
    
    var str = t1+""+t2+""+t3+""+t4+""+t5+""+t6+""+t7+""+t8+""+t9;
    //alert("string :" +str99);
    console.log("string :"+str);
    //alert(t1+""+t2+""+t3+""+t4+""+t5);
    if(str=="000000000"){
        window.plugins.messageBox.alert({title: 'Cannot Send Email', message: 'You have not selected any file!'}, function(button) {
                                        var args = Array.prototype.slice.call(arguments, 0);
                                        console.log("messageBox.alert:" + JSON.stringify(args));
                                        });
    
    }
    else{
        showEmailComposer(str);
    }

    
}


function showEmailComposer(val)
{
    
    console.log("string got :"+val);
    var control = SocialCalc.GetCurrentWorkBookControl();
    var content = getHtmlContentForApp(val);
    content=replaceImageUrl(content);
    var tmoutFn = function() {
        
        window.plugins.emailComposer.showEmailComposer("Fitness Planner",content, "", "", "",true);
        
    };
    
    window.setTimeout(tmoutFn, 10);
    
}

function sendAllSheets(){
    var control = SocialCalc.GetCurrentWorkBookControl();
    var appsheets = {sheet1:"sheet1",sheet2:"sheet2", sheet3:"sheet3",sheet4:"sheet4",sheet5:"sheet5",sheet6:"sheet6",sheet7:"sheet7","sheet8":sheet8,"sheet9":sheet9};
    var content = SocialCalc.WorkbookControlCreateSheetHTML(appsheets);
    content=replaceImageUrl(content);
    
    
    var tmoutFn = function() {
        
        window.plugins.emailComposer.showEmailComposer("Fitness Planner",content, "", "", "",true);
        
    };
    
    window.setTimeout(tmoutFn, 100);
}

