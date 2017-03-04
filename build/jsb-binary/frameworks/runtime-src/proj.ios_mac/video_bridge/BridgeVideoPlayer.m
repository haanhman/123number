#import "BridgeVideoPlayer.h"
#import "VideoPlayerJS.h"
@implementation BridgeVideoPlayer
+(void)playVideo:(NSString *)videoPath {
    VideoPlayerJS *videoJS = [[VideoPlayerJS alloc] init];
    [videoJS openVideoPlayer:videoPath];
}
@end
