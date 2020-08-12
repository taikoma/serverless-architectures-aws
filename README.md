# serverless-architectures-aws


[AWSによるサーバーレスアーキテクチャ](https://www.shoeisha.co.jp/book/detail/9784798155166)のサンプルコードを改変

サンプルコードが古くて動かないものがあるので、改変したコードをアップロード

## Listing 9.4 - Updated Transcode Function
24-Hour VideoへのFirebaseの追加

Firebaseのセットアップ
サービスアカウントを作成し秘密鍵となるjsonファイルをzip化してLambda関数にアップロード
Lambda関数(transcode-video)の環境変数にjsonファイル名、サービスアカウント名などを設定

サンプルコードindex.jsのままだとpermission deniedエラー

index.js
```js 
-var firebase = require("firebase")
+var firebase = require("firebase-admin");
```

```js
+var serviceAccount = require(process.env.SERVICE_ACCOUNT);

firebase.initializeApp({
-   serviceAccount: process.env.SERVICE_ACCOUNT,
+   credential: firebase.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});
```
firebase 8.7.0  

`$npm install firebase-admin --save`



```js
var database = firebase.database().ref();
```
でエラー発生  
instance.INTERNAL.registerComponent is not a function  

`$npm install @firebase/app -save`
で解決

参考
[instance.INTERNAL.registerComponent is not a function](https://stackoverflow.com/questions/59275670/cloud-function-deployment-typeerror-instance-internal-registercomponent-is-no)







