var Utils = {

    playVideoForCard: function (cardname) {
        cc.log("lkahdsahdhkashdjashdjsahjkd: " + cardname);
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("BridgeIOS", "playVideoName:", cardname);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/BridgeAndroid", "playVideoName", "(Ljava/lang/String;)V", cardname);
        }
    },

    //phan nay danh cho viec lay link download
    //neu co them server thi chi can cho vao day la xong
    getServer: function () {
        var server = [
            "https://vkidsdata.firebaseapp.com",
            // "https://vkidsdata2.firebaseapp.com",
            // "https://vkidsdata3.firebaseapp.com",
            // "https://vkidsdata4.firebaseapp.com"
        ];
        return server[Math.floor(Math.random() * server.length)] + "/media";
    },

    getUrlDownload: function (letter) {
        var listFile = {
            "a": "5ba9b58b4ffd825a51fa04dc60bf426696bc67400b872c8d06d8df6be390c4eb",
            "b": "452a19e1ec60737b4b31f0eb2e3e08e71942ad90338f82bdfb909730dd9d83a6",
            "c": "eebbe0e54a6ab4696d9b7debb88c4cbf74d9a499cef23455a934c40401695c7b",
            "d": "0eab3358a2ea4c332327220741336579609882a9fb716a0449e40e68dd802d0b",
            "e": "1c16bb376f4719ef5e6602c9c31e96219d2134dedd45e5e7d8f89e642590f568",
            "f": "f2103ea8f46429b8291a5d31bcee2b7e55d3687514836bd94d50a0ad05a3df8e",
            "g": "21c99dfd946fbcc48d54b3fd37e16adf3da273962ffbe0d8fc2947e95290f3e3",
            "h": "3d71c324db7971777f177f71e541c4d1fcccd536f62c66f1e065414349e5d034",
            "i": "7669578f8759eb96d8ca699ee84be6193bed911a1bdf0f444df036e4b69d8dd7",
            "j": "e7ba5ff83a85e414ece584b0cce3319fd05708d9c9f6612abeb229a37603c02e",
            "k": "7a94f6ebf9b5006744df09aa6923d14a7e3b14999bbeae30320c37ed6200bc24",
            "l": "2b68737f1c978f095a5ea36b192377b9881e8f594ca7e1ba7343d9d5ecf32f3e",
            "m": "e7489ae87ea3325f5120cd8d868942712f3a1a621d6c50d7170270830e743f58",
            "n": "e1fe9530ff78711ac8f9e99a1d1f5389b493983720c19ac4e0c01d71c7d2da75",
            "o": "43ac9556ce9afec24cc394002662d6de312d1f5faa1376cea2c4dd9fea1ed773",
            "p": "fcda535fd13753c1c01ffa696178c2babe0ca1f42844674e8d7ea8fd3c2e8df8",
            "q": "d271b609b26eb1d86636b3434805a4dc58b8f416c9f4fecfe34de7930922b027",
            "r": "5dfd6e3b6c2fd0b9973b9b562551a6cc5b5bbd1a4fb4564aa9b88ff387b034b4",
            "s": "c90662fa516ec71634dc65409e6c5da244eae826ec2d90230dafd53726f8933e",
            "t": "7df3f65d65a9705fbf67ecfd8709e6e187817710c80037f2cc88be96057a1f0d",
            "u": "2bce9cbb5964cd823670de607c8dc58cf825697d8fe37648c04a43c5e8332aff",
            "v": "9f6d25a880196f7025630e690328692ec54ceb101ca2cbfc0f8aebe0f37de90d",
            "w": "9da6407bf2487a9b95e9ad68f2724774251c1b78002f47695aaf2efed583f429",
            "x": "4f175dab4915cdf2750a8cd2782c81239bdc84d219603e249a3250f73bddd3ba",
            "y": "a95430b60ba655ab74c213afe69efc5008cff51aaaffc691731f63e73f02f658",
            "z": "4ab8e4383c6576a4412ac393571cba8c1601f2a5504610f61f71638c8f3e2ab3"
        };
        return getServer() + "/" + listFile[letter] + ".zip";
    }

    beginDownloadFile:function(strfileDownload){
        if(cc.sys.os==cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod("BridgeJS2IOS", "beginDownloadData:",strfileDownload);
        }else if(cc.sys.os==cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/BridgeAndroid", "beginDownloadFile", "(Ljava/lang/String;)V",strfileDownload);
        }
    }





}
module.exports = Utils;

















