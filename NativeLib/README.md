#download android
để cài đặt download android
1. copy file **AndroidLib/BridgeAndroid.java** vào thư mục tương ứng với package **org.cocos2dx.javascript**

2. copy 2 file **DownloadCPlus.cpp** & **DownloadCPlus.hpp** và thư mục **build/jsb-binary/frameworks/runtime-src/Classes**

3. sửa file **build/jsb-binary/frameworks/runtime-src/proj.android-studio/app/jni/Android.mk**
add thêm dòng
```
../../../Classes/DownloadCPlus.cpp
```
VD:
```
LOCAL_SRC_FILES := \
../../../Classes/AppDelegate.cpp \
hellojavascript/main.cpp \
../../../Classes/SDKManager.cpp \
../../../Classes/jsb_anysdk_basic_conversions.cpp \
../../../Classes/manualanysdkbindings.cpp \
../../../Classes/jsb_anysdk_protocols_auto.cpp \
⇒ ../../../Classes/DownloadCPlus.cpp
```

4. copy file **cocos2d-x/Cocos2dxDownloader.java** vào thư mục core của cocos2d-x **cocos2d-x/cocos/platform/android/java/src/org/cocos2dx/lib/Cocos2dxDownloader.java**

*Lý do*: download https ở google firebase nó bị lỗi 
http://stackoverflow.com/questions/8839541/hostname-in-certificate-didnt-match
đã fix để download link firebase thành công

# download ios
cài đặt dễ hơn ông google, update document sau