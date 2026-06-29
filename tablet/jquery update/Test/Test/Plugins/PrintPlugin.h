//
//  PrintPlugin.h
//  Print Plugin
//
//  Rewritten for cordova 2.8.1
//


#import <Cordova/CDV.h>
#import "PrintPlugin.h"


@interface PrintPlugin : CDVPlugin 

- (void) print:(CDVInvokedUrlCommand*)command;

- (void) isPrintingAvailable:(CDVInvokedUrlCommand*)command;

@end
