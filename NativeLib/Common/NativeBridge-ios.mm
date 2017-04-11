#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
#include "NativeBridge.h"
USING_NS_CC;

void NativeBridge::addSkipBackupAttributeToItemAtPath(string filePathString)
{
    NSString *myPath = [NSString stringWithUTF8String: filePathString.c_str()];
    if([[NSFileManager defaultManager] fileExistsAtPath:myPath]){
        NSURL* URL= [NSURL fileURLWithPath: myPath];
        
        NSError *error = nil;
        BOOL success = [URL setResourceValue: [NSNumber numberWithBool: YES]
                                      forKey: NSURLIsExcludedFromBackupKey error: &error];
        if(!success){
            NSLog(@"Error excluding %@ from backup %@", [URL lastPathComponent], error);
        }
    }
}


#endif
