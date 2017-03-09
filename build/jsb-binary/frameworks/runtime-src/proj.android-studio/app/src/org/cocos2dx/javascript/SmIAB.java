package org.cocos2dx.javascript;

import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.sonman.inapp.IabHelper;
import com.sonman.inapp.IabResult;
import com.sonman.inapp.Inventory;
import com.sonman.inapp.Purchase;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

/**
 * Created by anhmantk on 3/7/17.
 */

public class SmIAB {

    // Debug tag, for logging
    static final String TAG = "SmIAB";

    static final String SKU_REMOVE_ADS = "com.sonman.demoinapp.unlockdata";

    // (arbitrary) request code for the purchase flow
    static final int RC_REQUEST = 10111;

    // The helper object
    private static IabHelper mHelper;

    private static String base64EncodedPublicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxU450o0ihw+qxqWrMxWghIaBfCxGJXijkasUFaqmlj7K7VxlrN4zXOHClg4E6ejnMXF5UDOO6Ew3CJGGk3ae8AGx8Zh1TVHoIgD3h/obWbqKSi80ztoj4k9Dn5XKsBRlBDRS82lzGLZIRKm04sStgr03/ER2Tr+vRsM6Ki28nQ2ScPEOYFaSvt5NOumQA5Um/OA46GC2kVuoyFJNbSj/U2wT03B+M446QebiegIN4LKJf+JAEdfWC97okDHeUsmcjE0rmnPlp9gM/ZeEufT1uSzaG6TfW8HckWae8lc0yBQkFZsGrHSfCBPV/uMM8I77iLTjx9ZFPxumnxquoGwzZwIDAQAB";

    private static Boolean isAdsDisabled = false;
    private static String payload = "bat_cu_noi_dung_gi_cung_duoc";
    private static Cocos2dxActivity activity;

    public static void initIABHelper() {
        activity = (Cocos2dxActivity)Cocos2dxActivity.getContext();
        mHelper = new IabHelper(activity, base64EncodedPublicKey);

        mHelper.enableDebugLogging(true);

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
                    mHelper.queryInventoryAsync(mGotInventoryListener);
                } catch (IabHelper.IabAsyncInProgressException ex) {
                    Log.d(TAG, ex.getMessage());
                }
            }
        });
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

            Log.d(TAG, "Query inventory was successful.");

            /*
             * Check for items we own. Notice that for each purchase, we check
             * the developer payload to see if it's correct! See
             * verifyDeveloperPayload().
             */

            // Do we have the premium upgrade?
            Purchase removeAdsPurchase = inventory.getPurchase(SKU_REMOVE_ADS);
//            Log.w(TAG, removeAdsPurchase.getToken());
//            Log.w(TAG, removeAdsPurchase.getDeveloperPayload());
//            Log.w(TAG, removeAdsPurchase.getPackageName());
//            Log.w(TAG, removeAdsPurchase.getSku());
//            Constants.isAdsDisabled = (removeAdsPurchase != null && verifyDeveloperPayload(removeAdsPurchase));
//            removeAds();
//
//            Log.d(TAG, "User has "
//                    + (Constants.isAdsDisabled ? "REMOVED ADS"
//                    : "NOT REMOVED ADS"));

            // setWaitScreen(false);
            Log.d(TAG, "Initial inventory query finished; enabling main UI.");
        }
    };

    // User clicked the "Remove Ads" button.
    public static void purchaseRemoveAds() {

        Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "================ nguoi dung chon unlock data ================");

                try {
                    mHelper.launchPurchaseFlow(activity, SKU_REMOVE_ADS,
                            RC_REQUEST, mPurchaseFinishedListener, payload);
                } catch (Exception ex) {
                    Log.d(TAG, ex.getMessage());
                }
            }
        });
    }

    /** Verifies the developer payload of a purchase. */
    private static boolean verifyDeveloperPayload(Purchase p) {
        String payload = p.getDeveloperPayload();

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
        return true;
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
                complain("Error purchasing: " + result);
                return;
            }
            if (!verifyDeveloperPayload(purchase)) {
                complain("Error purchasing. Authenticity verification failed.");
                return;
            }

            Log.d(TAG, "Purchase successful.");

            if (purchase.getSku().equals(SKU_REMOVE_ADS)) {
                // bought the premium upgrade!
                removeAds();

            }
        }
    };

    private static void removeAds() {
        isAdsDisabled = true;
    }


    private static void complain(String message) {
        Log.e(TAG, "**** TrivialDrive Error: " + message);
        alert("Error: " + message);
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
