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
using namespace cocos2d;
using namespace std;

class  DownloadCPlus
{
    
   
    
public:
    virtual bool init();
    static DownloadCPlus* getInstance();
    
    static void CallBackJS(float pr);
    static void CallBackJSErrorDownload(int stt);
    static void CallBackJSFinishDownload(int stt);
    
    void beginDownload(const char* str);
    void removeFile();
    void stopAllDownload();
    string fileSavePath;
    void unzipfile();
    std::vector<string> explode(const std::string& str, const char& ch);
    std::string joinStringVector(std::vector<string> vv,std::string delimiter);
    
};

#endif /* DownloadCPlus_hpp */
