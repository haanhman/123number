package org.cocos2dx.javascript;

import android.app.Activity;
import android.content.Intent;
/**
 * Created by hobach on 8/3/16.
 */
public class BridgeAndroid {

    public static native void BeginDownload(String textStr);


    public static void beginDownloadFile(String str_leaderboad_i) {
        System.out.println("----------begin download.....");
        BeginDownload(str_leaderboad_i);// goi sang C++ , chi can goi the nay thoi
    }

}
