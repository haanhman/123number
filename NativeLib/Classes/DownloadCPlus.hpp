//
//  DownloadCPlus.hpp
//  Archery3DAndroid
//
//  Created by HoBach on 3/12/17.
//
//

#ifndef DownloadCPlus_hpp
#define DownloadCPlus_hpp

#include <stdio.h>
#include <iostream>
#include <cstring>
#include <string>
#include "cocos2d.h"
#include "network/HttpClient.h"
#include "cocos-ext.h"

using namespace cocos2d::network;
using namespace cocos2d;
using namespace std;

class  DownloadCPlus
{
    
   
    
public:
    virtual bool init();
    static DownloadCPlus* getInstance();
    std::unique_ptr<network::Downloader> downloader;
    
    static void CallBackJS(float pr);
    static void CallBackJSErrorDownload(int stt);
    static void CallBackJSFinishDownload(int stt);
    static void CallBackJSUnzipFinish();
    
    void cachePriceAndroid(const char* strPrice, const char* strType);
    
    void beginDownload(const char* str);
    void removeFile();
    void stopAllDownload();
    string fileSavePath;
    void unzipfile();
    std::vector<string> explode(const std::string& str, const char& ch);
    std::string joinStringVector(std::vector<string> vv,std::string delimiter);
    
};

#endif /* DownloadCPlus_hpp */
