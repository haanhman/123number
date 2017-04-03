#include "CardData.h"
#include "js_module_register.h"
#include "DownloadCPlus.hpp"

// singleton stuff
static CardData *instance = nullptr;

CardData* CardData::getInstance()
{
    if (!instance)
    {
        instance= new CardData();
        
    }
    return instance;
}

void CardData::clearCache() {
    SpriteFrameCache::getInstance()->removeUnusedSpriteFrames();
    Director::getInstance()->getTextureCache()->removeUnusedTextures();
}

void CardData::copyCardData() {
    FileUtils *fileManager = FileUtils::getInstance();
    CCLOG("Document: %s", fileManager->getWritablePath().c_str());
    string checkFileExist = fileManager->getWritablePath() + "resources/cards/a.json";
    if(!fileManager->isFileExist(checkFileExist)) {
        CCLOG("copy card data");
        string zipFile = "videocard.zip";
        string dest = fileManager->getWritablePath() + zipFile;
        Data db_data = fileManager->getDataFromFile(zipFile);
        fileManager->writeDataToFile(db_data, dest);
        
        DownloadCPlus *download = DownloadCPlus::getInstance();
        download->fileSavePath = dest;
        download->unzipfile();
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        ScriptingCore::getInstance()->runScript("install_data_success.js");
#endif
    }
}


#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
extern "C"
{
    void Java_org_cocos2dx_javascript_BridgeAndroid_beginInstallCardData(JNIEnv* env, jobject thiz)
    {
        CardData::getInstance()->copyCardData();
    }
}

#endif
