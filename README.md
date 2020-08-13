# serverless-architectures-aws


[AWSによるサーバーレスアーキテクチャ](https://www.shoeisha.co.jp/book/detail/9784798155166)のサンプルコードを改変

サンプルコードが古くて動かないものがあるので、改変したコードをアップロード

## Installation
`$ git clone git@github.com:taikoma/serverless-architectures-aws.git`

## Usage
### Webサイトをローカルで起動
Listing5.1-5.6-Websiteをカレントディレクトリにして  
`$ npm start`  
でローカル起動

http://192.168.10.11:8100/
ブラウザでアクセス


## 修正など

### Listing 5.1 - 5.6 - Website
- ウェブサイト構築  
- 認証機能(Auth0)の追加

検索結果
ウェブ検索結果

Google Developer Consoleで認証情報を設定が必要  


#### 修正1
config.jsはauth0のドメイン、クライアントID、URLを書き換える
```Js
var configConstants={
    auth0:{
        domain: process.env.DOMAIN,
        clientId: process.env.CLIENTID
    },
    apiBaseUrl: process.env.APIBASEURL

}
```

#### 修正2
本に記載のAuth Lock バージョン9は古くてエラー発生  
バージョン11で書き換える

参考1 [Migrating from Lock v9 to v11](https://auth0.com/docs/libraries/lock/v11/migration-v9-v11#using-lock-in-spas-with-redirect-mode)  
参考2 [AWSによるサーバーレスアーキテクチャ」のAuth0 Lockについて](https://qiita.com/yohachi/items/4d83da043a55649ab7e7)

```html
  <!-- <script src="https://cdn.auth0.com/js/lock-9.min.js"></script> -->
  <script src="https://cdn.auth0.com/js/lock/11.3.0/lock.min.js"></script>
```

```js
-this.data.auth0Lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain);//for ver 9
+this.data.auth0Lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain,{//for ver 11
      popup:true,
      auth: {
        params:{
          scope: 'openid email user_metadata picture'
        }
      }      
    });
``

### Listing 9.4 - Updated Transcode Function
24-Hour VideoへのFirebaseの追加

動画をS3にアップロードしたらtranscode-video(Lambda関数)でFirebaseのデータベース情報を更新する

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

`npm rebuild grpc --target=12.16.3 --target_arch=x64 --target_platform=linux --target_libc=glibc`

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








