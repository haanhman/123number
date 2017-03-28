#import "VideoPlayerJS.h"
#include "ScriptingCore.h"
#include "js_module_register.h"
@implementation VideoPlayerJS


-(void)openVideoPlayer:(NSString*)stringVideoName {
    UIViewController *rootView = [UIApplication sharedApplication].keyWindow.rootViewController;
    
    NSLog(@"stringVideoName: %@",stringVideoName);
    if (![[NSFileManager defaultManager] fileExistsAtPath:stringVideoName]) {
        NSLog(@"video not found");
    }
    NSURL *urlVideoFile = [NSURL fileURLWithPath:stringVideoName];
    AVPlayerItem *item = [[AVPlayerItem alloc] initWithURL:urlVideoFile];
    _playerViewController = [[AVPlayerViewController alloc] init];
    _playerViewController.player = [AVPlayer playerWithPlayerItem:item];
    _playerViewController.view.frame = rootView.view.bounds;
    _playerViewController.showsPlaybackControls = NO;
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(itemDidFinishPlaying:) name:AVPlayerItemDidPlayToEndTimeNotification object:[_playerViewController.player currentItem]];
    
    
    [[NSNotificationCenter defaultCenter] addObserverForName:UIApplicationDidBecomeActiveNotification object:[UIApplication sharedApplication] queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification *note) {
        [_playerViewController.player play];
    }];
    
    [self createHomeButton];
    _playerViewController.view.backgroundColor=[UIColor whiteColor];
    [rootView.view addSubview:_playerViewController.view];
    rootView.view.autoresizesSubviews = YES;
    
    [_playerViewController.player play];
}

-(void)createHomeButton {
    CGSize sceneSize = [UIScreen mainScreen].bounds.size;
    UIImage *homeImg = [UIImage imageNamed:@"closebutton.png"];
    UIImageView *homeButton = [[UIImageView alloc] initWithImage:homeImg];
    
    // app cua minh bat ke man hinh nao thi deu co do cao la 640
    // button size 40x40 _>retina =80*80 tile la 40/640;
    float sc_scale=sceneSize.height/320.0f;
    NSLog(@"sc_scale: %f",sc_scale);
    float size_h=sceneSize.height*80/640.0f;
    float size_w=homeImg.size.width*size_h/homeImg.size.height;
    
    
    
    [homeButton setFrame:CGRectMake(sceneSize.width - 45*sc_scale, 5*sc_scale,size_w, size_h)];
    
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
