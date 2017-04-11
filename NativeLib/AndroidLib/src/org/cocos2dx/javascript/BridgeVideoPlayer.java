package org.cocos2dx.javascript;

import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.VideoView;

import org.cocos2d.helloworld.R;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

/**
 * Created by anhmantk on 3/3/17.
 */

public class BridgeVideoPlayer extends Cocos2dxActivity {
    private static String TAG = "BridgeVideoPlayer";
    private static VideoView _video = null;
    private static RelativeLayout _layout = null;
    private static ImageButton _homeBtn = null;
    private static LinearLayout _btnLayout = null;
    private static Cocos2dxActivity _cocosActivity = null;
    private static String videoPath = "";
    private static int stopPosition = 0;


    public static void playVideo(final String videoUrl){
        restartParams();
        _cocosActivity = (Cocos2dxActivity)Cocos2dxActivity.getContext();

        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                startVideo(videoUrl);
            }
        });
    }

    private static void startVideo(String videoUrl) {
        try {
            Uri myUri = Uri.parse(videoUrl);
            Log.d(TAG, myUri.toString());
            DisplayMetrics displayMetrics = new DisplayMetrics();
            _cocosActivity.getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
            int height = displayMetrics.heightPixels;
            int width = displayMetrics.widthPixels;

            _video = new VideoView(_cocosActivity);
            _video.requestFocus();
            _video.setZOrderOnTop(true);
            _video.setZOrderMediaOverlay(true);
            _video.setVideoURI(myUri);
            _video.setLayoutParams(new FrameLayout.LayoutParams(width, height));

            _layout = new RelativeLayout(_cocosActivity.getApplicationContext());
            _layout.setLayoutParams(new FrameLayout.LayoutParams(width, height, Gravity.CENTER));
            _layout.addView(_video);

            _video.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                @Override
                public void onCompletion(MediaPlayer mediaPlayer) {
                    completeVideo();
                }
            });

            createHomeButton();
            _video.start();

        } catch (Exception ex)
        {
            Log.d("BridgeVideoPlayer", ex.getMessage());
        }
    }


    private static void createHomeButton() {
        _homeBtn = new ImageButton(_cocosActivity);
        _homeBtn.setImageResource(R.drawable.close);
        _homeBtn.setClickable(true);
        _homeBtn.setBackgroundDrawable(null);

        DisplayMetrics displayMetrics = new DisplayMetrics();
        _cocosActivity.getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
        int height = displayMetrics.heightPixels;
        int width = displayMetrics.widthPixels;

        Log.e("Size", "W: " + width + " H: " + height);

        int x = (int)(width * 0.0625);
        int y = x;

        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(x, y, Gravity.RIGHT);


        _btnLayout = new LinearLayout(_cocosActivity);
        _btnLayout.setLayoutParams(layoutParams);
        _btnLayout.addView(_homeBtn);


        View rootView = _cocosActivity.getWindow().getDecorView().getRootView();
        int rootViewWidth = rootView.getWidth();

        int paddingTop = (int)(y * 0.25);
        int paddingRight = (int)(y * 0.25) + (rootViewWidth - width);
        layoutParams.setMargins(0, paddingTop, paddingRight, 0);
        FrameLayout rootLayout = (FrameLayout)rootView;

        rootLayout.addView(_layout, 1);
        rootLayout.addView(_btnLayout, 2);

        _homeBtn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                closeVideo();
            }
        });

        _layout.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                return true;
            }
        });

    }

    private static void completeVideo() {
        removeVideo();

        Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("var currentsc = cc.director.getScene();\n" +
                        "var runningScene = currentsc.children[0].getComponent(\"VideoScene\");\n" +
                        "runningScene.videoCompleteCallback();");
            }
        });
    }

    private static void closeVideo() {
        removeVideo();

        Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("var currentsc = cc.director.getScene();\n" +
                        "var runningScene = currentsc.children[0].getComponent(\"VideoScene\");\n" +
                        "runningScene.closeVideoButton();");
            }
        });
    }

    public static void pauseVideo() {
        if(_video != null) {
            stopPosition = _video.getCurrentPosition(); //stopPosition is an int
            _video.pause();
        }
    }



    public static void checkVideoResume() {
        if(_video != null) {
            _video.seekTo(stopPosition);
            _video.start();
        }
    }

    private static void removeVideo() {
        _btnLayout.removeAllViews();
        _layout.setOnTouchListener(null);
        _layout.removeAllViews();
        restartParams();
    }

    private static void restartParams() {
        stopPosition = 0;
        _video = null;
        _layout = null;
        _homeBtn = null;
        _btnLayout = null;
        _cocosActivity = null;
        videoPath = "";
    }

}
