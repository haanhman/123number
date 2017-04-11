package org.cocos2dx.javascript;

import android.content.Intent;
import android.os.Debug;
import android.text.Html;
import android.util.DebugUtils;
import android.util.Log;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

/**
 * Created by hobach on 8/3/16.
 */
public class BridgeAndroid extends Cocos2dxActivity {
    private static String TAG = "BridgeAndroid";
    private static Cocos2dxActivity activity;

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

    public static void actionFeedBack(String mailSupport) {
        activity = (Cocos2dxActivity)Cocos2dxActivity.getContext();
        try {
            Intent i = new Intent(Intent.ACTION_SEND);
            i.setType("plain/text");
            String[] to = {mailSupport};
            i.putExtra(Intent.EXTRA_EMAIL, to);
            i.putExtra(Intent.EXTRA_SUBJECT, "Need help with ABC Phonic");
            i.putExtra(Intent.EXTRA_TEXT, "");
            activity.startActivity(Intent.createChooser(i, "Select application"));
        } catch (Exception e) {
            Log.e("EduNativeBridge", e.getMessage());
        }
    }

    public static void actionShareApp(String appUrl) {
        activity = (Cocos2dxActivity)Cocos2dxActivity.getContext();
        Log.d(TAG, "==> actionShareApp: " + appUrl);
        Intent sendIntent = new Intent();
        sendIntent.setAction(Intent.ACTION_SEND);
        sendIntent.putExtra(Intent.EXTRA_TEXT, "ABC Phonic. " + appUrl);
        sendIntent.setType("text/plain");
        activity.startActivity(sendIntent);
    }
}
