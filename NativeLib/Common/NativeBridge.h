#ifndef __Vkids__NativeBridge__
#define __Vkids__NativeBridge__

#include "cocos2d.h"
using namespace std;
USING_NS_CC;
class NativeBridge
{
public:
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    static void addSkipBackupAttributeToItemAtPath(string filePathString);
#endif
};

#endif /* defined(__Monkey__NativeBridge__) */
