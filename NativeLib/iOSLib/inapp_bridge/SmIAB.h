#import <Foundation/Foundation.h>
#import "IAPShare.h"
@interface SmIAB : NSObject
+(void)unlockContent;
+(void)IABInit;
+(void)unlockDataSuccess;
+(void)unlockDataError;
+(void)setPrice:(NSString*)price andType:(int)type;

@end
