#import "VideoPlayerJS.h"
#include "ScriptingCore.h"
#include "js_module_register.h"
@implementation VideoPlayerJS


-(void)openVideoPlayer:(NSString*)stringVideoName {
    UIViewController *rootView = [UIApplication sharedApplication].keyWindow.rootViewController;
    
    NSString *stringVideoPath = [[NSBundle mainBundle] pathForResource:stringVideoName ofType:nil];
    NSLog(@"Video path: %@", stringVideoPath);
    NSURL *urlVideoFile = [NSURL fileURLWithPath:stringVideoPath];
    AVPlayerItem *item = [[AVPlayerItem alloc] initWithURL:urlVideoFile];
    _playerViewController = [[AVPlayerViewController alloc] init];
    _playerViewController.player = [AVPlayer playerWithPlayerItem:item];
    _playerViewController.view.frame = rootView.view.bounds;
    _playerViewController.showsPlaybackControls = NO;
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(itemDidFinishPlaying:) name:AVPlayerItemDidPlayToEndTimeNotification object:[_playerViewController.player currentItem]];
    
    [self createHomeButton];
    [rootView.view addSubview:_playerViewController.view];
    rootView.view.autoresizesSubviews = YES;
    
    [_playerViewController.player play];
}

-(void)createHomeButton {
    CGSize sceneSize = [UIScreen mainScreen].bounds.size;
    
    UIImage *homeImg = [UIImage imageNamed:@"close.png"];
    UIImageView *homeButton = [[UIImageView alloc] initWithImage:homeImg];
    [homeButton setFrame:CGRectMake(sceneSize.width - 45, 5, 40, 40)];
    
    UITapGestureRecognizer *singleTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(backToHomeScene)];
    [homeButton setUserInteractionEnabled:YES];
    [homeButton addGestureRecognizer:singleTap];
    
    [_playerViewController.view addSubview:homeButton];
}

-(void)backToHomeScene {
    [self removeVideoPlayer];
    ScriptingCore::getInstance()->runScript("close_video_button.js");
}

-(void)itemDidFinishPlaying:(NSNotification *) notification {
    [self removeVideoPlayer];
    ScriptingCore::getInstance()->runScript("complete_video.js");
}

-(void)removeVideoPlayer {
    [_playerViewController.player pause];
    _playerViewController.player = nil;
    [_playerViewController.view removeFromSuperview];
}
@end
