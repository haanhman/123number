package org.cocos2dx.javascript;

import android.util.Log;

import org.cocos2dx.lib.Cocos2dxActivity;

/**
 * Created by hobach on 8/3/16.
 */
public class BridgeAndroid extends Cocos2dxActivity {
    private static String TAG = "BridgeAndroid";


    public static native void BeginDownload(String textStr);

    public static void beginDownloadFile(String urlDownload) {
        Log.d(TAG, urlDownload);
        BeginDownload(urlDownload);// goi sang C++ , chi can goi the nay thoi
    }

    public static void playVideo(String videoPath) {
        Log.d(TAG, videoPath);
        BridgeVideoPlayer.playVideo(videoPath);
    }
}
