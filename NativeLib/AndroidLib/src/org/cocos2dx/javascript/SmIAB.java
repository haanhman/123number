package org.cocos2dx.javascript;

import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.RequestParams;
import com.loopj.android.http.ResponseHandlerInterface;
import com.sonman.inapp.IabException;
import com.sonman.inapp.IabHelper;
import com.sonman.inapp.IabResult;
import com.sonman.inapp.Inventory;
import com.sonman.inapp.Purchase;
import com.sonman.inapp.SkuDetails;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.util.EntityUtils;

/**
 * Created by anhmantk on 3/7/17.
 */

public class SmIAB {

    // Debug tag, for logging
    static final String TAG = "SmIAB";

    static final String product_id = "com.kidsapp.abcphonic.learnhandwriting.fullcontent";
    static final String product_original_id = "com.kidsapp.abcphonic.learnhandwriting.fullcontent_original";
    // (arbitrary) request code for the purchase flow
    static final int RC_REQUEST = 10111;

    // The helper object
    private static IabHelper mHelper;

    private static String base64EncodedPublicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkAhgQ9YQZFimEVDD2/vkZE7ZsZLELj+hKp5IoWK6ACiMY2YU1s/Fc3rMMy5a3MVzWP36g3gKgQYHCrALGENGY7Anpxjy5sSQ6p85NxduJagO9viaqoA4alrkBmQz1j9KWUgKT4hJCGhxNuLa+apRN5p73Z5UraAFWQg804pyxcAsrOrAbeFShJv2Jgw3Jy7h5/eI4b4A6KFJAKdsIwFQYM1qhMDPWu7O5tdt45Raibnv5dNitXOr7qJDdlwUOp+1kgfi0JBQEe1XYRknWAnt37Ro+cWZONAw0BBIJzntkUPASsamwEzC/lBsrjSHPV0rUerU8BXLHfApOvPAZdPEdQIDAQAB";

    private static String payload = "7kIm1Odyb3eF0HOXy3CD";
    private static Cocos2dxActivity activity;

    public static native void cachePrice(String strPrice, String type);

    public static void initIABHelper() {
        activity = (Cocos2dxActivity)Cocos2dxActivity.getContext();
        mHelper = new IabHelper(activity, base64EncodedPublicKey);

        mHelper.enableDebugLogging(true);

        final List<String> listPackage = new ArrayList<String>();
        listPackage.add(product_id);
        listPackage.add(product_original_id);




        // Start setup. This is asynchronous and the specified listener
        // will be called once setup completes.
        Log.d(TAG, "Starting setup.");
        mHelper.startSetup(new IabHelper.OnIabSetupFinishedListener() {
            public void onIabSetupFinished(IabResult result) {
                Log.d(TAG, "Setup finished.");

                if (!result.isSuccess()) {
                    // Oh noes, there was a problem.
                    // complain("Problem setting up in-app billing: " + result);
                    return;
                }

                // Have we been disposed off in the meantime? If so, quit.
                if (mHelper == null)
                    return;

                // IAB is fully set up. Now, let's get an inventory of stuff we
                // own.
                Log.d(TAG, "Setup successful. Querying inventory.");
                try {
//                    mHelper.queryInventoryAsync(mGotInventoryListener);
                    mHelper.queryInventoryAsync(true, listPackage, listPackage, mGotInventoryListener);
                } catch (IabHelper.IabAsyncInProgressException ex) {
                    Log.d(TAG, ex.getMessage());
                }
            }
        });
    }

    private static String createPayload() {
        Random r = new Random();
        int Low = 10;
        int High = 10000000;
        int Result = r.nextInt(High-Low) + Low;
        return Result + "";
    }

    // Listener that's called when we finish querying the items and
    // subscriptions we own
    static IabHelper.QueryInventoryFinishedListener mGotInventoryListener = new IabHelper.QueryInventoryFinishedListener() {
        public void onQueryInventoryFinished(IabResult result,
                                             Inventory inventory) {
            Log.d(TAG, "Query inventory finished.");

            // Have we been disposed of in the meantime? If so, quit.
            if (mHelper == null)
                return;

            // Is it a failure?
            if (result.isFailure()) {
                // complain("Failed to query inventory: " + result);
                return;
            }


            SkuDetails sku = inventory.getSkuDetails(product_id);
            if (sku == null) {
                Log.d(TAG, "co loi phan load goi mua ban 2");
                return;
            }

            Log.d(TAG, "============== PRODUCT ID =================");
            Log.d(TAG, "name: " + sku.getTitle());
            Log.d(TAG, "price: " + sku.getPrice());
            Log.d(TAG, "============== END PRODUCT ID =============");
            cachePrice(sku.getPrice(), "1");

            SkuDetails skuOriginal = inventory.getSkuDetails(product_original_id);
            if (skuOriginal == null) {
                Log.d(TAG, "co loi phan load goi mua ban 2");
                return;
            }

            Log.d(TAG, "============== PRODUCT ORIGINAL ID =================");
            Log.d(TAG, "name: " + skuOriginal.getTitle());
            Log.d(TAG, "price: " + skuOriginal.getPrice());
            Log.d(TAG, "============== END PRODUCT ORIGINAL ID =============");
            cachePrice(skuOriginal.getPrice(), "2");
        }
    };


    // unlock content
    public static void unlockContent() {
        payload = createPayload();
        Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "================ nguoi dung chon unlock data ================");

                try {
                    mHelper.launchPurchaseFlow(activity, product_id,
                            RC_REQUEST, mPurchaseFinishedListener, payload);
                } catch (Exception ex) {
                    Log.d(TAG, ex.getMessage());
                }
            }
        });
    }

    /** Verifies the developer payload of a purchase. */
    private static boolean verifyDeveloperPayload(Purchase p) {
        RequestParams params = new RequestParams();
        params.put("signed_data", p.getOriginalJson());
        params.put("signature", p.getSignature());

        String url = "http://54.218.122.252/api/receipt/android";

        AsyncHttpClient client = new AsyncHttpClient();

        client.post(url, params, new ResponseHandlerInterface() {
            @Override
            public void sendResponseMessage(HttpResponse httpResponse) throws IOException {

            }

            @Override
            public void sendStartMessage() {

            }

            @Override
            public void sendFinishMessage() {

            }

            @Override
            public void sendProgressMessage(long l, long l1) {

            }

            @Override
            public void sendCancelMessage() {

            }

            @Override
            public void sendSuccessMessage(int i, Header[] headers, byte[] bytes) {

            }

            @Override
            public void sendFailureMessage(int i, Header[] headers, byte[] bytes, Throwable throwable) {

            }

            @Override
            public void sendRetryMessage(int i) {

            }

            @Override
            public URI getRequestURI() {
                return null;
            }

            @Override
            public void setRequestURI(URI uri) {

            }

            @Override
            public Header[] getRequestHeaders() {
                return new Header[0];
            }

            @Override
            public void setRequestHeaders(Header[] headers) {

            }

            @Override
            public boolean getUseSynchronousMode() {
                return false;
            }

            @Override
            public void setUseSynchronousMode(boolean b) {

            }

            @Override
            public boolean getUsePoolThread() {
                return false;
            }

            @Override
            public void setUsePoolThread(boolean b) {

            }

            @Override
            public void onPreProcessResponse(ResponseHandlerInterface responseHandlerInterface, HttpResponse httpResponse) {

            }

            @Override
            public void onPostProcessResponse(ResponseHandlerInterface responseHandlerInterface, HttpResponse httpResponse) {
                try {
                    String result = EntityUtils.toString(httpResponse.getEntity());
                    JSONObject myObject = new JSONObject(result);
                    if(myObject.getInt("status") == 1) {
                        unlockContentSuccess();
                    } else {
                        complain("Error purchasing. Authenticity verification failed.");
                    }
                }catch (Exception ex) {
                    Log.d(TAG, ex.getMessage());
                }
            }

            @Override
            public Object getTag() {
                return null;
            }

            @Override
            public void setTag(Object o) {

            }
        });
        return false;

        /*
         * TODO: verify that the developer payload of the purchase is correct.
         * It will be the same one that you sent when initiating the purchase.
         *
         * WARNING: Locally generating a random string when starting a purchase
         * and verifying it here might seem like a good approach, but this will
         * fail in the case where the user purchases an item on one device and
         * then uses your app on a different device, because on the other device
         * you will not have access to the random string you originally
         * generated.
         *
         * So a good developer payload has these characteristics:
         *
         * 1. If two different users purchase an item, the payload is different
         * between them, so that one user's purchase can't be replayed to
         * another user.
         *
         * 2. The payload must be such that you can verify it even when the app
         * wasn't the one who initiated the purchase flow (so that items
         * purchased by the user on one device work on other devices owned by
         * the user).
         *
         * Using your own server to store and verify developer payloads across
         * app installations is recommended.
         */
        //return true;
    }

    public static boolean checkRestore() {
        try {
            Inventory ivo = mHelper.queryInventory();
            return ivo.hasPurchase(product_id);
        }catch (IabException ex) {
            return false;
        }
    }

    // Callback for when a purchase is finished
    static IabHelper.OnIabPurchaseFinishedListener mPurchaseFinishedListener = new IabHelper.OnIabPurchaseFinishedListener() {
        public void onIabPurchaseFinished(IabResult result, Purchase purchase) {
            Log.d(TAG, "Purchase finished: " + result + ", purchase: "
                    + purchase);

            // if we were disposed of in the meantime, quit.
            if (mHelper == null)
                return;

            if (result.isFailure()) {
                if(checkRestore()) {
                    unlockContentSuccess();
                }
                return;
            }


            Log.d(TAG, "Purchase successful.");

            if (purchase.getSku().equals(product_id)) {
                // bought the premium upgrade!
                verifyDeveloperPayload(purchase);
            }
        }
    };

    private static void unlockContentSuccess() {
        Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("var currentsc = cc.director.getScene();\n" +
                        "var runningScene = currentsc.children[0].getComponent(\"HomeUIScript\");\n" +
                        "runningScene.unlockDataSuccess();");
            }
        });
    }

    private static void unlockContentFail() {
        Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("var currentsc = cc.director.getScene();\n" +
                        "var runningScene = currentsc.children[0].getComponent(\"HomeUIScript\");\n" +
                        "runningScene.unlockDataError();");
            }
        });
    }


    private static void complain(String message) {
        unlockContentFail();
        alert(message);
    }

    private static void alert(final String message) {
        activity.runOnUiThread(new Runnable() {

            @Override
            public void run() {
                Toast.makeText(activity, message, Toast.LENGTH_LONG).show();
            }
        });
    }


    public static void onDestroy() {
        // very important:
        Log.d(TAG, "Destroying helper.");
        if (mHelper != null) {
            mHelper.disposeWhenFinished();
            mHelper = null;
        }
    }

    public static void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (mHelper != null) {
            // Pass on the activity result to the helper for handling
            if (!mHelper.handleActivityResult(requestCode, resultCode, data)) {
                // not handled, so handle it ourselves (here's where you'd
                // perform any handling of activity results not related to in-app
                // billing...
            } else {
                Log.d(TAG, "onActivityResult handled by IABUtil.");
            }
        }
    }

}
