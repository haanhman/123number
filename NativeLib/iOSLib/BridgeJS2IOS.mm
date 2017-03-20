#import "BridgeJS2IOS.h"
#include "DownloadCPlus.hpp"
@interface BridgeJS2IOS(){
}
@end

@implementation BridgeJS2IOS
static BridgeJS2IOS *bridge_ios;


#pragma mark -------------BEGIN STATIC METHOD ----------------------

+(void)beginDownloadData:(NSString *)strurlDownload;{
    // goi sang C++
    DownloadCPlus::getInstance()->beginDownload(strurlDownload.UTF8String);
}




#pragma mark -------------END STATIC METHOD ------------------------


+(BridgeJS2IOS*)shareInstance{
    if (bridge_ios==nil) {
        bridge_ios=[[BridgeJS2IOS alloc] init];
    }
    return bridge_ios;
}
@end







