# serverless-architectures-aws


[AWSによるサーバーレスアーキテクチャ](https://www.shoeisha.co.jp/book/detail/9784798155166)のサンプルコードを改変

サンプルコードが古くて動かないものがあるので、改変したコードをアップロード

### Listing 9.4 - Updated Transcode Function
24-Hour VideoへのFirebaseの追加

- Firebaseのセットアップ
- サービスアカウントを作成し秘密鍵となるjsonファイルをzip化してLambda関数にアップロード
- Lambda関数(transcode-video)の環境変数にjsonファイル名、サービスアカウント名などを設定

#### Permission deniede error
サンプルコードindex.jsのままだとpermission deniedエラー
下記コードに改変

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

firebase-adminをnpm installする
`$npm install firebase-admin --save`

#### Runtime.ImportModuleErrorエラー
Failed to load gRPC binary module because it was not installed for the current system\nExpected directory: node-v72-linux-x64-glibc\nFound

npmのバージョンに合わせてRebuildする
`node --version
v12.16.3`

`m rebuild grpc --target=12.16.3 --target_arch=x64 --target_platform=linux --target_libc=glibc`

#### TypeErrorエラー
```js
var database = firebase.database().ref();
```
でエラー発生  
instance.INTERNAL.registerComponent is not a function  

`$npm install @firebase/app -save`
で解決

参考
[instance.INTERNAL.registerComponent is not a function](https://stackoverflow.com/questions/59275670/cloud-function-deployment-typeerror-instance-internal-registercomponent-is-no)








