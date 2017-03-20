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

class  DownloadCPlus
{
    
   
    
public:
    virtual bool init();
    static DownloadCPlus* getInstance();
    
    static void CallBackJS(float pr);
    static void CallBackJSErrorDownload(int stt);
    static void CallBackJSFinishDownload(int stt);
    
    void beginDownload(const char* str);
    
    void stopAllDownload();
    
    void unzipfile();
    
};

#endif /* DownloadCPlus_hpp */
