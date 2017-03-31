

#import <Foundation/Foundation.h>
@interface BridgeJS2IOS : NSObject{
    int mytimeplay;
}
+(BridgeJS2IOS*)shareInstance;

+(void)beginDownloadData:(NSString *)strurlDownload;
+(void)playVideo:(NSString *)videoPath;

+(void)actionFeedBack:(NSString *)emailAdress;
+(void)actionShareApp:(NSString*)strurl;
+(void)installCardData;
@end
