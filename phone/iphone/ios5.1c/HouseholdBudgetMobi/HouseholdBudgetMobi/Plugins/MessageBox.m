//
//  MessageBox.m
//
// Created by Olivier Louvignes on 2011-11-26
// Updated on 2012-08-04 for Cordova ARC-2.1+
//
// Copyright 2011 Olivier Louvignes. All rights reserved.
// MIT Licensed

#import "MessageBox.h"

@implementation MessageBox

@synthesize callbackId = _callbackId;


#define SYSTEM_VERSION_EQUAL_TO(v)                  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedSame)
#define SYSTEM_VERSION_GREATER_THAN(v)              ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedDescending)
#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)
#define SYSTEM_VERSION_LESS_THAN(v)                 ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedAscending)
#define SYSTEM_VERSION_LESS_THAN_OR_EQUAL_TO(v)     ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedDescending)

- (void)prompt:(CDVInvokedUrlCommand*)command {

	self.callbackId = command.callbackId;
	NSDictionary *options = [command.arguments objectAtIndex:0];

	// Compiling options with defaults
	NSString *title = [options objectForKey:@"title"] ?: @"Input";
	NSMutableString *message = [NSMutableString stringWithString: ([options objectForKey:@"message"] ?: @"")];
	NSString *type = [options objectForKey:@"type"] ?: @"text";
	NSString *placeholder = [options objectForKey:@"placeholder"] ?: @"";
    NSString *okButtonTitle = [options objectForKey:@"okButtonTitle"] ?: @"OK";
    NSString *cancelButtonTitle = [options objectForKey:@"cancelButtonTitle"] ?: @"Cancel";
	NSInteger textFieldPositionRow = (int)[options objectForKey:@"textFieldPositionRow"] ?: 1;

    NSMutableString *textvalue = [NSMutableString stringWithString: ([options objectForKey:@"textvalue"] ?: @"")];
    
	// Increment textFieldPositionRow if there is a message
	if ([message length] != 0 && textFieldPositionRow == 1) {
		[message appendString: @"\n"];
		textFieldPositionRow = 2 + [message length] / 35;
	}
    
	// Append line-break to the message
	[message appendString: @"\n"];

	// Create UIAlertView popup
	UIAlertView *prompt = [[UIAlertView alloc] initWithTitle:title
													 message:message
													delegate:self
										   cancelButtonTitle:cancelButtonTitle
										   otherButtonTitles:okButtonTitle, nil];
  if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"7.0")) {
        prompt.alertViewStyle = UIAlertViewStylePlainTextInput;
   };
        
	// Create prompt textField
	UITextField *textField = [[UITextField alloc] initWithFrame:CGRectMake(12.0, 20.0 + textFieldPositionRow*25.0, 260.0, 25.0)]; // left, top, width, height
	[textField setBackgroundColor:[UIColor whiteColor]];
	if ([placeholder length] != 0) [textField setPlaceholder:placeholder];
	
    

    //textField.text = textvalue;
    
    //[textField setText:textvalue];
    
    NSLog(@"text value is %@",textvalue);
    
	[prompt addSubview:textField];

    
	// Position fix for iOS < 4
	NSString *iOSVersion = [[UIDevice currentDevice] systemVersion];
	if ([iOSVersion intValue] < 4) {
		[prompt setTransform:CGAffineTransformMakeTranslation(0.0, 110.0)];
	}

	// Display prompt
	[prompt show];
    UITextField *tf = NULL;
	
     if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"7.0")) {
         tf = [prompt textFieldAtIndex:0];
     } else {
         if ([prompt.subviews count] == 6) {
         tf = [prompt.subviews objectAtIndex:5];
         }
         if ([prompt.subviews count] == 5) {
             tf = [prompt.subviews objectAtIndex:4];
         }
         
     }
    
    if (tf == NULL) {
        return;
    }
    if ([[type lowercaseString] isEqualToString:@"numberpad"])
    {
        [tf resignFirstResponder];
        [tf setKeyboardType:UIKeyboardTypeNumberPad];
        [tf setText:textvalue];
        [tf becomeFirstResponder];
    }
    
    if ([[type lowercaseString] isEqualToString:@"numbersandpunctuation"])
    {
        [tf resignFirstResponder];
        [tf setKeyboardType:UIKeyboardTypeNumbersAndPunctuation];
        [tf setText:textvalue];
        [tf becomeFirstResponder];
    };

    
    if ([[type lowercaseString] isEqualToString:@"decimalpad"])
    {
        [tf resignFirstResponder];
        [tf setKeyboardType:UIKeyboardTypeDecimalPad];
        [tf setText:textvalue];
        [tf becomeFirstResponder];
    }
    if ([[type lowercaseString] isEqualToString:@"emailaddress"])
    {
        [tf resignFirstResponder];
        [tf setKeyboardType:UIKeyboardTypeEmailAddress];
        [tf setText:textvalue];
        [tf becomeFirstResponder];
    }
    if ([[type lowercaseString] isEqualToString:@"namephonepad"])
    {
        [tf resignFirstResponder];
        [tf setKeyboardType:UIKeyboardTypeNamePhonePad];
        [tf setText:textvalue];
        [tf becomeFirstResponder];
    }

    if ([[type lowercaseString] isEqualToString:@"text"])
    {
        [tf resignFirstResponder];
        [tf setKeyboardType:UIKeyboardTypeDefault];
        [tf setText:textvalue];
        [tf becomeFirstResponder];
    }
    
}

- (void)alertView:(UIAlertView *)view clickedButtonAtIndex:(NSInteger)buttonIndex {
	
	// Retreive textField object from view
	//
    UITextField *textField = NULL;
    if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"7.0")) {
            textField = [view textFieldAtIndex:0];
    } else {
            textField = [view.subviews objectAtIndex:5];
    };
	
	// Build returned result
	NSDictionary *result = [NSDictionary dictionaryWithObjectsAndKeys:
							textField.text, @"value",
							[NSNumber numberWithInteger:buttonIndex], @"buttonIndex", nil];
	
	// Create Plugin Result
	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
	
	// Checking if cancel was clicked
	if (buttonIndex != [view cancelButtonIndex]) {
		[self writeJavascript: [pluginResult toSuccessCallbackString:self.callbackId]];
	} else {
		//Call  the Failure Javascript function
		[self writeJavascript: [pluginResult toErrorCallbackString:self.callbackId]];
	}
	
}

@end
