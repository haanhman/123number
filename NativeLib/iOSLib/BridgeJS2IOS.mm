#import "BridgeJS2IOS.h"
#include "DownloadCPlus.hpp"
#import "VideoPlayerJS.h"
#import "CardData.h"
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

+(void)playVideo:(NSString *)videoPath {
    VideoPlayerJS *videoJS = [[VideoPlayerJS alloc] init];
    [videoJS openVideoPlayer:videoPath];
}

+(void)installCardData {
    CardData::getInstance()->copyCardData();
}

//MARK: -------------END STATIC METHOD ------------------------


+(BridgeJS2IOS*)shareInstance{
    if (bridge_ios==nil) {
        bridge_ios=[[BridgeJS2IOS alloc] init];
    }
    return bridge_ios;
}
@end







