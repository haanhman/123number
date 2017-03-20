//
//  DownloadCPlus.cpp
//  Archery3DAndroid
//
//  Created by HoBach on 3/12/17.
//
//

#include "DownloadCPlus.hpp"
#include "network/CCDownloader.h"



#include "cocos2d.h"
#include "js_module_register.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "platform/android/jni/JniHelper.h"
#include <jni.h>
#endif



#define step_download 3
int skipstep;

USING_NS_CC;

// singleton stuff
static DownloadCPlus *s_download = nullptr;
static  bool downloading;

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
extern "C"
{
    void Java_org_cocos2dx_javascript_BridgeAndroid_BeginDownload(JNIEnv* env, jobject thiz,jstring textStr)
    {
        const char* str;
        str = env->GetStringUTFChars(textStr, NULL);
        CCLOG("----BridgeAndroid--------XXXX----: %s",str);
        DownloadCPlus::getInstance()->beginDownload(str);
    }
}

#endif










bool DownloadCPlus::init()
{
    return true;
}

DownloadCPlus* DownloadCPlus::getInstance()
{
    if (!s_download)
    {
        s_download=new DownloadCPlus();
        
    }
    
    return s_download;
}


void DownloadCPlus::beginDownload(const char* c_str_input){
    if (downloading) {
        CCLOG("------ dang ton tai 1 luong download roi----");
        return;
    }
  
    downloading=true;
    std::string url=c_str_input;// neu co loi la do ep kieu
    //url="https://github.com/MaVuong/GameAnalytics/blob/master/videodata.zip?raw=true";
    std::string filePath = FileUtils::getInstance()->getWritablePath() + "fullversion.zip";
    if(FileUtils::getInstance()->isFileExist(filePath)){
        CCLOG("------ remove file first-----");
        FileUtils::getInstance()->removeFile(filePath);
    }
    network::Downloader *downloader = new (std::nothrow) network::Downloader();
    
    downloader->onTaskProgress = ([] (const network::DownloadTask& task, int64_t bytesReceived, int64_t totalBytesReceived, int64_t totalBytesExpected) {
        //downloading progress
        float percent = float(totalBytesReceived * 100) / totalBytesExpected;
        //CCLOG("percent: %f",percent);
        DownloadCPlus::CallBackJS(percent);
        
    });
    
    downloader->onFileTaskSuccess = ([] (const network::DownloadTask& task) {
        //file downloaded, do what you need next
        std::string filePath = FileUtils::getInstance()->getWritablePath() + "peace.zip";
        CCLOG("download thanh cong: %s",filePath.c_str());
        s_download->unzipfile();
        DownloadCPlus::CallBackJSFinishDownload(1);
        downloading=false;
    });
    
    downloader->onTaskError = ([] (const network::DownloadTask& task, int errorCode, int errorCodeInternal, const std::string& errorStr) {
        //file downloading error
        DownloadCPlus::CallBackJSErrorDownload(errorCode);
        downloading=false;
        CCLOG("Failed to download : %s, identifier(%s) error code(%d), internal error code(%d) desc(%s)"
              , task.requestURL.c_str()
              , task.identifier.c_str()
              , errorCode
              , errorCodeInternal
              , errorStr.c_str());
    });
    
    downloader->createDownloadFileTask(url, filePath);
    //downloader->release();
    
}

void DownloadCPlus::stopAllDownload(){
    
}

void DownloadCPlus::unzipfile(){
    std::string filePath = FileUtils::getInstance()->getWritablePath() + "fullversion.zip";
    // cu unzip file , file path duoc vao 1 array string, neu iOS thi config them doan code skipbackup len icloud
    cocos2d::Data datafile=FileUtils::getInstance()->getDataFromFile(filePath);
    ssize_t size = datafile.getSize();
    unsigned char* bytes = datafile.getBytes();
    cocos2d::ZipFile *zFile = cocos2d::ZipFile::createWithBuffer(bytes, (unsigned long)size);
    
    if(!zFile){
        CCLOG("zip file corrupt");
        return;
    }
        
    
    std::string fileName = zFile->getFirstFilename();
    std::string file = fileName;
    
    ssize_t filesize;
    unsigned char* data = zFile->getFileData(fileName, &filesize);
    
    std::string directoryName = cocos2d::FileUtils::getInstance()->getWritablePath() + "data/";
    
    if ( !cocos2d::FileUtils::getInstance()->isDirectoryExist(directoryName))
    {
        cocos2d::FileUtils::getInstance()->createDirectory(directoryName);
    }
    
    while (data != nullptr)
    {
        
        std::string fullFileName = directoryName + file;
        
        //CCLOG("fullFileName : %s",fullFileName.c_str());
        
        FILE *fp = fopen(fullFileName.c_str(), "wb");
        
        if (fp)
        {
            fwrite(data, 1, filesize, fp);
            fclose(fp);
        }
        free(data);
        fileName = zFile->getNextFilename();
        file = fileName;
        
        data = zFile->getFileData(fileName, &filesize);
        
    }
    delete zFile;
    bytes=nullptr;
}



//------------------- call back js -----------

void DownloadCPlus::CallBackJS(float pr)
{
    skipstep++;
    if(skipstep<step_download){
        return;
    }
    skipstep=0;
    int spp=pr*1000;
    ScriptingCore * scriptingCore = ScriptingCore::getInstance();
    
    JSContext * context = scriptingCore->getGlobalContext();
    JS::RootedObject object(context, scriptingCore->getGlobalObject());
    JS::RootedValue owner(context);
    
    jsval * argumentsVector = new jsval[1];
    argumentsVector[0] = INT_TO_JSVAL(spp);
    
    JS_GetProperty(context, object, "NativeMobile", &owner);
    scriptingCore->executeFunctionWithOwner(owner, "downloadProgess", 1, argumentsVector);
    
    delete [] argumentsVector;
}
void DownloadCPlus::CallBackJSErrorDownload(int stt)
{
    int spp=stt;
    ScriptingCore * scriptingCore = ScriptingCore::getInstance();
    
    JSContext * context = scriptingCore->getGlobalContext();
    JS::RootedObject object(context, scriptingCore->getGlobalObject());
    JS::RootedValue owner(context);
    
    jsval * argumentsVector = new jsval[1];
    argumentsVector[0] = INT_TO_JSVAL(spp);
    
    JS_GetProperty(context, object, "NativeMobile", &owner);
    scriptingCore->executeFunctionWithOwner(owner, "downloadProgess", 1, argumentsVector);
    
    delete [] argumentsVector;
}
void DownloadCPlus::CallBackJSFinishDownload(int stt)
{
    int spp=stt;
    ScriptingCore * scriptingCore = ScriptingCore::getInstance();
    
    JSContext * context = scriptingCore->getGlobalContext();
    JS::RootedObject object(context, scriptingCore->getGlobalObject());
    JS::RootedValue owner(context);
    
    jsval * argumentsVector = new jsval[1];
    argumentsVector[0] = INT_TO_JSVAL(spp);
    
    JS_GetProperty(context, object, "NativeMobile", &owner);
    scriptingCore->executeFunctionWithOwner(owner, "finishDownload", 1, argumentsVector);
    
    delete [] argumentsVector;
}

/**
 var NativeMobile = require('NativeMobile');
 */













