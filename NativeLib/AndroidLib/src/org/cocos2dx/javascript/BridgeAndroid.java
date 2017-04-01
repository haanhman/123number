package org.cocos2dx.javascript;

import android.util.Log;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

/**
 * Created by hobach on 8/3/16.
 */
public class BridgeAndroid extends Cocos2dxActivity {
    private static String TAG = "BridgeAndroid";


    public static native void beginDownload(String textStr);
    public static native void beginInstallCardData();
    public static native void stopDownloadCardData();

    public static void beginDownloadFile(String urlDownload) {
        Log.d(TAG, urlDownload);
        beginDownload(urlDownload);// goi sang C++ , chi can goi the nay thoi
    }

    public static void stopDownload() {
        stopDownloadCardData();
    }

    public static void playVideo(String videoPath) {
        Log.d(TAG, videoPath);
        BridgeVideoPlayer.playVideo(videoPath);
    }

    public static void installCardData() {
        beginInstallCardData();
        Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("var currentsc = cc.director.getScene();\n" +
                        "var runningScene = currentsc.children[0].getComponent(\"HomeUIScript\");\n" +
                        "runningScene.removePopupInstallData();");
            }
        });
    }
}
