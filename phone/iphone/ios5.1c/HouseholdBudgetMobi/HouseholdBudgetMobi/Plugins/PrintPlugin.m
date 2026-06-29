//
//  PrintPlugin.m
//  Print Plugin
//
//  Rewritten for Cordova 2.8.1
//


#import "PrintPlugin.h"

#import "AppDelegate.h"

@interface PrintPlugin (Private)
- (BOOL) isPrintServiceAvailable;
@end

@implementation PrintPlugin

-(BOOL) isPrintServiceAvailable{
    Class myClass = NSClassFromString(@"UIPrintInteractionController");
    if (myClass) {
        UIPrintInteractionController *controller = [UIPrintInteractionController sharedPrintController];
        return (controller != nil) && [UIPrintInteractionController isPrintingAvailable];
    }    
    return NO;
}


- (void) isPrintingAvailable:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Executing isPrintingAvailable");
    CDVPluginResult* pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:[self isPrintServiceAvailable] ? CDVCommandStatus_OK : CDVCommandStatus_ERROR];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) print:(CDVInvokedUrlCommand*)command
{

    NSLog(@"Executing print");

  UIPrintInteractionController *controller = [UIPrintInteractionController sharedPrintController];
  
  if (!controller)
    {
      NSLog(@"print controller not found");
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:NO ? CDVCommandStatus_OK : CDVCommandStatus_ERROR] callbackId:command.callbackId];
        return;
    }
    else
    {
    NSString *data = [command.arguments objectAtIndex:0];

    if ([UIPrintInteractionController isPrintingAvailable])
      {        
	//Set the priner settings
	NSLog(@"print prniting is available");
        UIPrintInfo *printInfo = [UIPrintInfo printInfo];
        printInfo.outputType = UIPrintInfoOutputGeneral;
        controller.printInfo = printInfo;
        controller.showsPageRange = YES;
        
        //Set the base URL to be the www directory.
        NSString *dbFilePath = [[NSBundle mainBundle] pathForResource:@"www" ofType:nil ];
        NSURL *baseURL = [NSURL fileURLWithPath:dbFilePath];
        
        //Load page into a webview and use its formatter to print the page 
        UIWebView *webViewPrint = [[UIWebView alloc] init];
          [webViewPrint loadHTMLString:data baseURL:baseURL];
        
        //Get formatter for web (note: margin not required - done in web page)
	UIViewPrintFormatter *viewFormatter = [webViewPrint viewPrintFormatter];
        controller.printFormatter = viewFormatter;
        controller.showsPageRange = YES;
        
        
	void (^completionHandler)(UIPrintInteractionController *, BOOL, NSError *) =
	  ^(UIPrintInteractionController *printController, BOOL completed, NSError *error) 
	  {
	    if (!completed || error) 
	      {

		NSLog(@"print print failed");
               [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:NO ? CDVCommandStatus_OK : CDVCommandStatus_ERROR] callbackId:command.callbackId];
		[webViewPrint release];
	      }
	    else
	      {	      
		NSLog(@"print print ok");
		               [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:YES ? CDVCommandStatus_OK : CDVCommandStatus_ERROR] callbackId:command.callbackId];
		[webViewPrint release];
	      }
	  };
	/*
	  If iPad, and if button offsets passed, then show dilalog originating from offset
	*/
        if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
	  [controller presentFromRect:CGRectMake(95, 60, 0, 0) inView:self.webView animated:YES completionHandler:completionHandler];
        } else {
	  [controller presentAnimated:YES completionHandler:completionHandler];
        }
      }
    }
    
    
}
@end
