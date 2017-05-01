#import "SmIAB.h"
#include "ScriptingCore.h"
#include "js_module_register.h"

@implementation SmIAB
static SKProduct *_product = nil;
static bool clickBuyBtn = NO;

+(void)IABInit {
    if(![IAPShare sharedHelper].iap) {
        NSArray *inapps = [NSArray arrayWithObjects:@"com.vkids.123numbers.fullcontent", @"com.vkids.123numbers.fullcontent_original", nil];
        NSSet* dataSet = [[NSSet alloc] initWithArray:inapps];
        [IAPShare sharedHelper].iap = [[IAPHelper alloc] initWithProductIdentifiers:dataSet];
    }
    
    NSLog(@"bat dau load cac goi mua ban");
    
    [[IAPShare sharedHelper].iap requestProductsWithCompletion:^(SKProductsRequest* request,SKProductsResponse* response){
         if(response > 0 ) {
             for (SKProduct *p in [IAPShare sharedHelper].iap.products) {
                 NSLog(@"Price: %@",[[IAPShare sharedHelper].iap getLocalePrice:p]);
                 NSLog(@"Title: %@",p.localizedTitle);
                 if([p.productIdentifier isEqualToString:@"com.vkids.123numbers.fullcontent"]) {
                     _product = p;
                     [SmIAB setPrice:[[IAPShare sharedHelper].iap getLocalePrice:p] andType:1];
                 } else {
                     [SmIAB setPrice:[[IAPShare sharedHelper].iap getLocalePrice:p] andType:2];
                 }
             }
             //neu click vao nut mua khi chua co mang, sau do bat mang len va load duoc thong tin mua ban se tu mua luon
             if(clickBuyBtn) {
                 [SmIAB unlockContent];
             }
         } else {
             NSLog(@"Khong lay duoc thong tin mua ban tu Apple. vui long kiem tra lai");
         }
     }];
}


+(void)restoreContent {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setBool:YES forKey:@"click_restore"];
    [[IAPShare sharedHelper].iap restoreProductsWithCompletion:^(SKPaymentQueue *payment, NSError *error) {
        if(error != nil) {
            NSLog(@"Error: %@", error);
        }
    }];
}

+(void)unlockContent {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults removeObjectForKey:@"click_restore"];
    clickBuyBtn = YES;
    if(_product == nil) {
        NSLog(@"chua load duoc cac goi mua ve");
        [SmIAB IABInit];
        return;
    }
    [[IAPShare sharedHelper].iap buyProduct:_product onCompletion:^(SKPaymentTransaction* trans){
        if(trans.error)
        {
            NSLog(@"Fail %@",[trans.error localizedDescription]);
            [SmIAB unlockDataError];
        }
        else if(trans.transactionState == SKPaymentTransactionStatePurchased) {
            
            [[IAPShare sharedHelper].iap checkReceipt:[NSData dataWithContentsOfURL:[[NSBundle mainBundle] appStoreReceiptURL]] AndSharedSecret:nil onCompletion:^(NSString *response, NSError *error) {
                
                //Convert JSON String to NSDictionary
                NSDictionary* rec = [IAPShare toJSON:response];
                NSLog(@"rec: %@", rec);
                
                if([rec[@"status"] integerValue] == 1)
                {
                    
                    [[IAPShare sharedHelper].iap provideContentWithTransaction:trans];
                    NSLog(@"SUCCESS %@",response);
                    NSLog(@"Pruchases %@",[IAPShare sharedHelper].iap.purchasedProducts);
                    [SmIAB unlockDataSuccess];
                }
                else {
                    NSLog(@"Fail");
                    [SmIAB unlockDataError];
                }
            }];
        }
        else if(trans.transactionState == SKPaymentTransactionStateFailed) {
            NSLog(@"Fail");
            [SmIAB unlockDataError];
        }
    }];//end of buy product    
}

+(void)setPrice:(NSString*)price andType:(int)type{
    
    ScriptingCore * scriptingCore = ScriptingCore::getInstance();
    
    JSContext * context = scriptingCore->getGlobalContext();
    JS::RootedObject object(context, scriptingCore->getGlobalObject());
    JS::RootedValue owner(context);
    
    jsval * argumentsVector = new jsval[2];
    argumentsVector[0] = std_string_to_jsval(context, [price UTF8String]);
    argumentsVector[1] = INT_TO_JSVAL(type);
    
    JS_GetProperty(context, object, "NativeMobile", &owner);
    scriptingCore->executeFunctionWithOwner(owner, "setPrice", 2, argumentsVector);
    
    delete [] argumentsVector;
}

+(void)unlockDataSuccess {
    ScriptingCore::getInstance()->runScript("inapp_success.js");
}
+(void)unlockDataError {
    ScriptingCore::getInstance()->runScript("inapp_fail.js");
}

@end
