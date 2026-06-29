//
//  DropboxPlugin.m
//  PhoneGapSync
//
//  Created by Christophe Coenraets on 5/18/13.
//
//

#import "DropboxPlugin.h"

#import "AppDelegate.h"

#import <Dropbox/Dropbox.h>

@implementation DropboxPlugin


- (void) link:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Executing link()");
    
    AppDelegate *appDelegate = [[UIApplication sharedApplication] delegate];
    
    UIViewController *topView = appDelegate.viewController;
    
    CDVPluginResult* pluginResult = nil;
    
    [[DBAccountManager sharedManager] linkFromController:topView];
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}

- (void) checkLink:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Executing checklink()");
    
    CDVPluginResult* pluginResult = nil;
    
    DBAccount* account = [[DBAccountManager sharedManager] linkedAccount];
    
    pluginResult = [CDVPluginResult resultWithStatus:account ? CDVCommandStatus_OK : CDVCommandStatus_ERROR];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


- (void) unlink:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Executing unlink()");
    
    CDVPluginResult* pluginResult = nil;
    
    [[[DBAccountManager sharedManager] linkedAccount] unlink];
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)listFolder:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Executing listFolder()");
    
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;
        NSString* path = [command.arguments objectAtIndex:0];
        
        DBPath *newPath = [[DBPath root] childPath:path];
        NSArray *files = [[DBFilesystem sharedFilesystem] listFolder:newPath error:nil];
        
        NSMutableArray *items = [NSMutableArray array];
        
        for (DBFileInfo *file in files) {
            NSLog(@"\t%@", file.path.stringValue);
            NSMutableDictionary *dictionary = [[NSMutableDictionary alloc] init];
            [dictionary setObject:file.path.stringValue forKey:@"path"];
            [dictionary setObject:[NSNumber numberWithLongLong:[file.modifiedTime timeIntervalSince1970]*1000] forKey:@"modifiedTime"];
            [dictionary setObject:@(file.size) forKey:@"size"];
            [dictionary setValue:[NSNumber numberWithBool:file.isFolder] forKey:@"isFolder"];
            [items addObject:dictionary];
        }
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray: items];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}


- (void)addObserver:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Executing addObserver()");
    NSString* path = [command.arguments objectAtIndex:0];
    DBPath *newPath = [[DBPath root] childPath:path];
    
    [[DBFilesystem sharedFilesystem] addObserver:self forPathAndDescendants:newPath block:^() {
        NSLog(@"File change!");
        [self writeJavascript:@"dropbox_fileChange()"];
    }];
}


- (void)readData:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Executing readData()");
    
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;
        NSString* path = [command.arguments objectAtIndex:0];
        
        DBPath *newPath = [[DBPath root] childPath:path];
        DBFile *file = [[DBFilesystem sharedFilesystem] openFile:newPath error:nil];
        
        NSData *data = [file readData:nil];
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArrayBuffer: data];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
    
}


- (void)readString:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Executing readString()");
    
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;
        NSString* path = [command.arguments objectAtIndex:0];
        
        DBPath *newPath = [[DBPath root] childPath:path];
        DBFile *file = [[DBFilesystem sharedFilesystem] openFile:newPath error:nil];
        
        NSString *data = [file readString:nil];
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: data];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
    
    
}

-(void)createFile:(CDVInvokedUrlCommand*)command{
    NSLog(@"Executing createFile()");
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;
        NSString* path = [command.arguments objectAtIndex:0];
        DBPath *newPath = [[DBPath root] childPath:path];
        DBFile *file = [[DBFilesystem sharedFilesystem] createFile:newPath error:nil];
        pluginResult = [CDVPluginResult resultWithStatus:file ? CDVCommandStatus_OK : CDVCommandStatus_ERROR];

	//[file writeString:@"Hello World!" error:nil];
	[file close];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     
    }];
}

-(void)deletePath:(CDVInvokedUrlCommand*)command{
    NSLog(@"Executing deletePath()");
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;
        NSString* path = [command.arguments objectAtIndex:0];
        DBPath *newPath = [[DBPath root] childPath:path];
        BOOL result = [[DBFilesystem sharedFilesystem] deletePath:newPath error:nil];
        pluginResult = [CDVPluginResult resultWithStatus:result ? CDVCommandStatus_OK : CDVCommandStatus_ERROR];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)writeString:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Executing writeString()");
    
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;
        NSString* path = [command.arguments objectAtIndex:0];
        
        DBPath *newPath = [[DBPath root] childPath:path];
        DBFile *file = [[DBFilesystem sharedFilesystem] openFile:newPath error:nil];
        
        NSString *data = [command.arguments objectAtIndex:1];
        
        BOOL result = [file writeString:data error:nil];
        pluginResult = [CDVPluginResult resultWithStatus:result ? CDVCommandStatus_OK : CDVCommandStatus_ERROR]; 
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

        
    }];
    
    
}




@end
