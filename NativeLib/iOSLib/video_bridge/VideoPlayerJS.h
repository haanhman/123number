#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <AVKit/AVKit.h>

@interface VideoPlayerJS : NSObject
@property (nonatomic, retain) AVPlayerViewController *playerViewController;
-(void)openVideoPlayer:(NSString*)stringVideoName;
@end
