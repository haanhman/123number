#import "BridgeJS2IOS.h"
#include "DownloadCPlus.hpp"
#import "VideoPlayerJS.h"
#include "AppController.h"
#import "CardData.h"
#import <MessageUI/MessageUI.h>
#import <MessageUI/MFMailComposeViewController.h>
@interface BridgeJS2IOS(){
}
@end

@implementation BridgeJS2IOS
static BridgeJS2IOS *bridge_ios;


//MARK: -------------BEGIN STATIC METHOD ----------------------

+(void)beginDownloadData:(NSString *)strurlDownload {
    // goi sang C++
    DownloadCPlus::getInstance()->beginDownload(strurlDownload.UTF8String);
}

+(void)stopDownload {
    DownloadCPlus::getInstance()->stopAllDownload();
}

+(void)playVideo:(NSString *)videoPath {
    VideoPlayerJS *videoJS = [[VideoPlayerJS alloc] init];
    [videoJS openVideoPlayer:videoPath];
}

+(void)installCardData {
    CardData::getInstance()->copyCardData();
}

+(BridgeJS2IOS*)shareInstance{
    if (bridge_ios==nil) {
        bridge_ios=[[BridgeJS2IOS alloc] init];
    }
    return bridge_ios;
}

+(void)actionFeedBack:(NSString *)emailAdress{
    [[BridgeJS2IOS shareInstance] sendMailFeedBack:emailAdress];
}
+(void)actionShareApp:(NSString*)strurl{
    AppController *appcntroller=(AppController *)[[UIApplication sharedApplication] delegate];
    NSURL *url=[NSURL URLWithString:strurl];
    NSArray *activityItems = @[@"ABC Phonic. ",strurl,url];
    UIActivityViewController *activityController = [[UIActivityViewController alloc] initWithActivityItems:activityItems applicationActivities:nil];
    if (([[[UIDevice currentDevice] systemVersion] floatValue])>=8) {
        activityController.popoverPresentationController.sourceView = [appcntroller rootView].view;
        
    }
    [activityController setValue:@"" forKey:@"subject"];
    [[appcntroller rootView] presentViewController:activityController   animated:YES completion:nil];
}


//MARK: -------------END STATIC METHOD ------------------------

-(void)sendMailFeedBack:(NSString *)emailAdress{
    if([MFMailComposeViewController canSendMail]) {
        
        AppController *appcntroller=(AppController *)[[UIApplication sharedApplication] delegate];
        
        MFMailComposeViewController *mailCont = [[MFMailComposeViewController alloc] init];
        mailCont.mailComposeDelegate =(id)self;        // Required to invoke mailComposeController when send
        
        [mailCont setSubject:@"Need help with ABC Phonic"];
        [mailCont setToRecipients:[NSArray arrayWithObject:emailAdress]];
        [mailCont setMessageBody:@"" isHTML:NO];
        
        [[appcntroller rootView] presentViewController:mailCont animated:YES completion:nil];
    } else {
        
        UIAlertView *alertview=[[UIAlertView alloc] initWithTitle:@"Login Mail" message:@"You need to set up your mail on this device first." delegate:nil cancelButtonTitle:@"Close" otherButtonTitles: nil];
        [alertview show];
        
    }
}
- (void)mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error {
    [controller dismissViewControllerAnimated:YES completion:nil];
}

@end







