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
#include <iterator>
#include <iostream>

#include "js_module_register.h"
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
#include "NativeBridge.h"
#endif

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
    void Java_org_cocos2dx_javascript_BridgeAndroid_beginDownload(JNIEnv* env, jobject thiz,jstring textStr)
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

void DownloadCPlus::removeFile() {
    FileUtils::getInstance()->removeFile(s_download->fileSavePath);
}

void DownloadCPlus::beginDownload(const char* c_str_input){
    if (downloading) {
        CCLOG("------ dang ton tai 1 luong download roi----");
        return;
    }
  
    downloading=true;
    std::string url=c_str_input;// neu co loi la do ep kieu
    //url="https://github.com/MaVuong/GameAnalytics/blob/master/videodata.zip?raw=true";
    s_download->fileSavePath = FileUtils::getInstance()->getWritablePath() + "data.zip";
    if(FileUtils::getInstance()->isFileExist(s_download->fileSavePath)){
        CCLOG("------ remove file first-----");
        s_download->removeFile();
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
        CCLOG("download thanh cong: %s",s_download->fileSavePath.c_str());
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
    
    downloader->createDownloadFileTask(url, s_download->fileSavePath);
    //downloader->release();
    
}

void DownloadCPlus::stopAllDownload(){
    
}

void DownloadCPlus::unzipfile(){
    // cu unzip file , file path duoc vao 1 array string, neu iOS thi config them doan code skipbackup len icloud
    cocos2d::Data datafile=FileUtils::getInstance()->getDataFromFile(s_download->fileSavePath);
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
    
    cocos2d::FileUtils *fileUtils =  cocos2d::FileUtils::getInstance();
    
    
    std::string directoryName = fileUtils->getWritablePath();
    
    if (!fileUtils->isDirectoryExist(directoryName))
    {
        fileUtils->createDirectory(directoryName);
    }
    
    
    
    while (data != nullptr)
    {
        std::string fullFileName = directoryName + file;
        vector<string> paths = s_download->explode(fullFileName, '/');
        paths.erase(paths.end() - 1);
        
        string folder = s_download->joinStringVector(paths, "/");
        if (!fileUtils->isDirectoryExist(folder))
        {
            fileUtils->createDirectory(folder);
        }
        
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
        
        //bo qua backup iClould ko co apple reject app
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
        NativeBridge::addSkipBackupAttributeToItemAtPath(fileName);
#endif
    }
    delete zFile;
    bytes=nullptr;
    //xoa bo file sau khi da giai nen xong
    s_download->removeFile();
    s_download->CallBackJSUnzipFinish();
}

std::vector<string> DownloadCPlus::explode(const std::string& str, const char& ch) {
    string next;
    vector<string> result;
    // For each character in the string
    for (string::const_iterator it = str.begin(); it != str.end(); it++) {
        // If we've hit the terminal character
        if (*it == ch) {
            // If we have some characters accumulated
            if (!next.empty()) {
                // Add them to the result vector
                result.push_back(next);
                next.clear();
            }
        } else {
            // Accumulate the next character into the sequence
            next += *it;
        }
    }
    if (!next.empty())
        result.push_back(next);
    return result;
}

std::string DownloadCPlus::joinStringVector(std::vector<string> vv,std::string delimiter) {
    std::stringstream s;
    copy(vv.begin(),vv.end(), std::ostream_iterator<string>(s,delimiter.c_str()));
    std::string str = s.str();
    str = str.substr (0,str.length()-(delimiter.length()));
    return str;
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
void DownloadCPlus::CallBackJSUnzipFinish()
{
    ScriptingCore * scriptingCore = ScriptingCore::getInstance();
    
    JSContext * context = scriptingCore->getGlobalContext();
    JS::RootedObject object(context, scriptingCore->getGlobalObject());
    JS::RootedValue owner(context);
    
    jsval * argumentsVector = new jsval[1];
    
    JS_GetProperty(context, object, "NativeMobile", &owner);
    scriptingCore->executeFunctionWithOwner(owner, "unzipFinish", 1, argumentsVector);
    
    delete [] argumentsVector;
}

/**
 var NativeMobile = require('NativeMobile');
 */













