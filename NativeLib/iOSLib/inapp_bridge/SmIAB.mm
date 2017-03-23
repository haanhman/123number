#import "SmIAB.h"
#include "ScriptingCore.h"
#include "js_module_register.h"

@implementation SmIAB
static SKProduct *_product = nil;
static bool clickBuyBtn = NO;

+(void)IABInit {
    if(![IAPShare sharedHelper].iap) {
        NSSet* dataSet = [[NSSet alloc] initWithObjects:@"com.vkids.abcsong.fullcontent", nil];
        [IAPShare sharedHelper].iap = [[IAPHelper alloc] initWithProductIdentifiers:dataSet];
    }
    [IAPShare sharedHelper].iap.production = NO;
    NSLog(@"bat dau load cac goi mua ban");
    
    [[IAPShare sharedHelper].iap requestProductsWithCompletion:^(SKProductsRequest* request,SKProductsResponse* response){
         if(response > 0 ) {
             _product = [[IAPShare sharedHelper].iap.products objectAtIndex:0];
             NSLog(@"Price: %@",[[IAPShare sharedHelper].iap getLocalePrice:_product]);
             NSLog(@"Title: %@",_product.localizedTitle);
             //neu click vao nut mua khi chua co mang, sau do bat mang len va load duoc thong tin mua ban se tu mua luon
             if(clickBuyBtn) {
                 [SmIAB unlockContent];
             }
         } else {
             NSLog(@"Khong lay duoc thong tin mua ban tu Apple. vui long kiem tra lai");
         }
     }];
}


+(void)unlockContent {
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
            
            [[IAPShare sharedHelper].iap checkReceipt:[NSData dataWithContentsOfURL:[[NSBundle mainBundle] appStoreReceiptURL]] AndSharedSecret:@"your sharesecret" onCompletion:^(NSString *response, NSError *error) {
                
                //Convert JSON String to NSDictionary
                NSDictionary* rec = [IAPShare toJSON:response];
                
                if([rec[@"status"] integerValue]==0)
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

+(void)unlockDataSuccess {
    ScriptingCore::getInstance()->runScript("inapp_success.js");
}
+(void)unlockDataError {
    ScriptingCore::getInstance()->runScript("inapp_fail.js");
}

@end
