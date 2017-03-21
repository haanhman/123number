package org.cocos2dx.javascript;

import android.util.Log;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;


/**
 * Created by hobach on 8/3/16.
 */
public class BridgeAndroid {
    private static Cocos2dxActivity activity;


    public static native void BeginDownload(String textStr);

    public static void beginDownloadFile(String str_leaderboad_i) {

//        String downloadUrl = "http://54.218.122.252/5ba9b58b4ffd825a51fa04dc60bf426696bc67400b872c8d06d8df6be390c4eb.zip";
//        String downloadUrl = "https://github.com/MaVuong/GameAnalytics/blob/master/videodata.zip?raw=true";
        String downloadUrl = str_leaderboad_i;
        Log.d("Download", downloadUrl);
        BeginDownload(downloadUrl);// goi sang C++ , chi can goi the nay thoi

//        activity = (Cocos2dxActivity)Cocos2dxActivity.getContext();
//
//        activity.runOnUiThread(new Runnable() {
//
//            @Override
//            public void run() {
//                String downloadUrl = "http://54.218.122.252/5ba9b58b4ffd825a51fa04dc60bf426696bc67400b872c8d06d8df6be390c4eb.zip";
//                Log.d("Download", downloadUrl);
//                BeginDownload(downloadUrl);// goi sang C++ , chi can goi the nay thoi
//            }
//        });
    }

}
