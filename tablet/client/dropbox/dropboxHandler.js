dropboxHandler = {};


dropboxHandler.getAutheticated = function(success,failure){
    $.mobile.changePage("dropbox.html");
    console.log(success);
    console.log(failure);
    $('#aspiringLogin').live('pageshow',function(event){
        $("#aspiringLoginButton").unbind();
        $("#password").val("");                    
        $("#aspiringLoginButton").click(function(){
        var userEmail = $("#email").val();
        var userPass = $("#password").val();
        console.log(userEmail);
        console.log(userPass);
        $.mobile.pageLoading();
        dropbox.setupoauth(userEmail,userPass,success,failure);
       
        });
    });
};


$('#filePage').live( 'pagebeforeshow',function(event){
                    var accessDetails = window.localStorage.getItem(dropbox.htmlAccessStorageKey);
                    if(!accessDetails){
                    $("#aspiringLogoutButton").hide();
                    }
                    else{
                    $("#aspiringLogoutButton").show();
                    }
                    });

dropboxHandler.logout = function(){
    $.mobile.pageLoading();
    $.ajax({
           url:"https://www.aspiringapps.com/logout",
           success:function(){
                $.mobile.pageLoading(true);
                window.localStorage.removeItem(dropbox.htmlAccessStorageKey);
                navigator.notification.alert("You have successfully signed out from Aspiring Apps",null,applicationName);
                $("#aspiringLogoutButton").hide();
           },
           error:function(){
               $.mobile.pageLoading(true);
               navigator.notification.alert("Network Error. Cannot sign out from Aspiring Apps",null,applicationName);
           }
    });
};

dropboxHandler.save = function(){
    promptConfirm =  function(fileStr){
        var fileObj = {};
        fileObj.mimeType = "text/plain";
        fileObj.name = fileStr;

        if (fileObj.name != 'null' && fileObj.name.length < 30){

            var fileData = SocialCalc.WorkBookControlSaveSheet();

            fileObj.name += ".msc";
            fileObj.string = encodeURIComponent(fileData);
            fileObj.length = fileObj.string.length;

            var success = function(){
                            $.mobile.pageLoading(true);
                            navigator.notification.alert("File saved at Aspiring Apps server",null,applicationName);
                    };

            var failure = function(){
                    $.mobile.pageLoading(true);
                    navigator.notification.alert("File could not be saved at Aspiring Apps server",null,applicationName);
                    };
            if(dropbox.setupHtml5Oauth()){
                $.mobile.pageLoading();
                dropbox.uploadFile("",fileObj,false,success,failure);
            }
            else{
               
                dropboxHandler.getAutheticated(function(){
                    dropbox.uploadFile("",fileObj,false,function(){
                        $.mobile.pageLoading(true);
                        $.mobile.changePage("file.html");
                        navigator.notification.alert("File saved at Aspiring Apps server",null,applicationName);
                    },function(){
                        
                        $.mobile.pageLoading(true);
                        $.mobile.changePage("file.html");
                        navigator.notification.alert("File could not be saved at Aspiring Apps server",null,applicationName);
                    });
                },
                function(){
                        
                        $.mobile.pageLoading(true);
                        $.mobile.changePage("file.html");
                        navigator.notification.alert("File could not be saved at Aspiring Apps server",null,applicationName);
                });
            }
        }
        else if(fileObj.name.length >=30){
            navigator.notification.alert("File name should be less than 30 characters",null,applicationName);

        }

        else
            navigator.notification.alert("File name invalid",null,applicationName);
    };
    window.plugins.Prompt.show(
                               "Enter File Name",
                               promptConfirm,
                               saveAsCancel,
                               "Submit", // ok button title (optional)
                               "Cancel", // cancel button title (optional)
                               "yes"
                               );

}

    dropboxHandler.populateList = function(){
        $.mobile.pageLoading();

        dropboxHandler.list = Array();
        success = function(data){
                        console.log(data);
                        if(data.contents.length == 0){
                            $.mobile.pageLoading(true);
                            navigator.notification.alert("No file at Aspiring Apps",null,applicationName);
                            $.mobile.changePage('file.html');
                        }
                        else{
                        for (item in data.contents){
                            var str = data.contents[item].path;
                            str = str.slice(1,-4);
                            dropboxHandler.list.push(str);
                            }

                        $.mobile.pageLoading(true);
        
                        $('#aspiringFileList').live( 'pagebeforeshow',function(event){
                            $("#aspiringList").empty();
                            for (item in dropboxHandler.list){
                                  var str = dropboxHandler.list[item];
                                                   console.log(str);
                                
        
                                $("#aspiringList").append(
                                       '<li class="fieldcontain">'+
                                       '<div class="ui-grid-b">'+
                                       '<div class="ui-block-a">'+
                                       '<span style="padding-left:1.2em;"><h2>'+str+'</h2></span>'+
                                       '</div>'+
                                       '<div class="ui-block-c">'+
                                       '<fieldset data-role="controlgroup" data-type="horizontal">'+
                                       '<button onclick=dropboxHandler.View("'+ encodeURI(str) +'");>Edit</button>'+
                                       //'<button onclick=dropboxHandler.saveLocal("'+str+'");>Save</button>'+
                                       '<button onclick=dropboxHandler.Delete("'+ encodeURI(str) +'");>Delete</button>'+
                                       '</fieldset>'+
                                       '</div></div></li>');
                            }
                            $("#aspiringFileList *" ).page();
                            $("#aspiringList").listview("refresh");
                        });

                        $.mobile.changePage("dropboxList.html",{ transition: "pop"});
                    }

	}

	failure = function (data){
		$.mobile.pageLoading(true);
        console.log(data);
        errorObj= JSON.parse(data.text);
        console.log(errorObj);
        errorStr = dropboxHandler.errorString(errorObj.error);
        console.log(errorStr);
        navigator.notification.alert("Connection was unsuccessful\n" + errorStr,null,applicationName);
	}

        if(dropbox.setupHtml5Oauth()){
            $.mobile.pageLoading();
            dropbox.getMetadata("",success,failure);
        }
        else{
            dropboxHandler.getAutheticated(function(){
                dropbox.getMetadata("",success,failure);
            },failure);
        }
}




dropboxHandler.View= function(str){
	$.mobile.pageLoading();
	success =	function(data){

		var fileContent = data.text;
		$.mobile.pageLoading(true);
                SocialCalc.WorkBookControlInsertWorkbook(decodeURIComponent(fileContent));
                SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.editor.state = "start";
                SocialCalc.GetCurrentWorkBookControl().workbook.spreadsheet.ExecuteCommand('redisplay', '');
		$.mobile.changePage("#indexPage",{ transition: "pop"});
	}
    str = decodeURI(str);
	var strFname = str +".msc";
    console.log(strFname);
	dropbox.getFile(strFname,success);
    
}

//function to handle delete in fileList
dropboxHandler.Delete = function (str){
	str = decodeURI(str);

    var deleteConfirm = function(){
        $.mobile.pageLoading();
        var fileNameStr = str + ".msc";
        success = function(data){
            $.mobile.pageLoading(true);
	    var filterfunc = function(index){
					if($(this).find('h2').text() == str)
						return true;
					else
						return false;
					};
            $("#aspiringList li").filter(filterfunc).remove();
			if($("#aspiringList li").length ==0){
			   $("#aspiringList").append('<li class="fieldcontain">No files in Dropbox</li>');
			}
            navigator.notification.alert("File Deleted!",null,applicationName);
	    console.log(data);
        };

	failure = function(data){
		$.mobile.pageLoading(true);
		navigator.notification.alert("File Could not be deleted",null,applicationName);
		console.log(data);
	};

	dropbox.deletePath(fileNameStr,success,failure);

    }
    navigator.notification.confirm("Are you sure you want to delete the file '" +str+"' ?",deleteConfirm,applicationName);


};

dropboxHandler.saveLocal = function(str){
    $.mobile.pageLoading();
	success = function(data){

		var fileContent = data.text;
		$.mobile.pageLoading(true);
                window.localStorage.setItem(str,fileContent);
                navigator.notification.alert("File moved to iPad successfully",null,applicationName);
	}
	
        failure = function(data){
		$.mobile.pageLoading(true);
		navigator.notification.alert("File could not be saved",null,applicationName);
		console.log(data);
	};
        var strFname = str + ".msc";
	dropbox.getFile(strFname,success);
	
	
    
}

dropboxHandler.saveLocalPage = function(){
    $.mobile.changePage("dropboxSaveLocal.html");
 $('#aspiringSaveList').live( 'pagebeforeshow',function(event){    
    $("#aspiringCheckList").empty();
    var fieldElement = $('<fieldset data-role="controlgroup"></fieldset>');
    for (item in dropboxHandler.list){
	var str = dropboxHandler.list[item];
	var checkboxElement = $('<input type="checkbox" name="checkbox-'+str+'" id="checkbox-'+str+'" />'+
	    '<label for="checkbox-'+str+'">'+str+'</label>');
	fieldElement.append(checkboxElement);
    }
    var divElement = $('<div data-role="controlgroup"></div>');
    divElement.append(fieldElement);
    divElement.page();
    $("#aspiringCheckList").append(divElement).trigger('create');
 });
};

dropboxHandler.saveLocalMultiple = function(str){
    $.mobile.pageLoading();
	var fileNames = [];
	
	$("#aspiringCheckList :checked").each(
	    function(index){
	    var fileName = $(this).attr("id").slice(9);
	    fileName = fileName + ".msc";
	    fileNames.push(fileName);
	});
	
	dropboxHandler.recursiveSave(fileNames);
    
}

dropboxHandler.recursiveSave= function(fileNames){

	if(fileNames.length!=0){
	    var fileName = fileNames.pop();
	    dropbox.getFile(fileName,function(data){
		var fileContent = data.text;
		var str = fileName.slice(0,-4);
                window.localStorage.setItem(str,fileContent);
		dropboxHandler.recursiveSave(fileNames);
		},function(data){
		$.mobile.pageLoading(true);
		navigator.notification.alert("Error occured while saving file",null,applicationName);
		console.log(data);
	    });
	}
	else{
	    $.mobile.pageLoading(true);
	    navigator.notification.alert("Files saved successfully",null,applicationName);
	}
}


dropboxHandler.errorString = function(str){
    if(str == "Token is not an authorized request token."){
        return "Login Error";
    }
    if(str == "Connection could not be established."){
        return "Connection could not be established. Check your Internet Connectivity.";
    }
    
    return "Undefined Error";
}