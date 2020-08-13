/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 */

// https://qiita.com/yohachi/items/4d83da043a55649ab7e7

var userController = {
  data: {
    auth0Lock: null,
    config: null
  },
  uiElements: {
    loginButton: null,
    logoutButton: null,
    profileButton: null,
    profileNameLabel: null,
    profileImage: null
  },
  init: function(config) {
    var that = this;

    this.uiElements.loginButton = $('#auth0-login');
    this.uiElements.logoutButton = $('#auth0-logout');
    this.uiElements.profileButton = $('#user-profile');
    this.uiElements.profileNameLabel = $('#profilename');
    this.uiElements.profileImage = $('#profilepicture');

    this.data.config = config;
    // this.data.auth0Lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain);//for ver 9
    this.data.auth0Lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain,{//for ver 11
      popup:true,
      auth: {
        params:{
          scope: 'openid email user_metadata picture'
        }
      }      
    });
    //コールバック関数はauth0Lock.onで登録
    this.data.auth0Lock.on('authenticated',function(authResult){
      console.log("debug");

      localStorage.setItem('userToken', authResult.accessToken);
      that.configureAuthenticatedRequests();

      that.data.auth0Lock.getUserInfo(authResult.accessToken,function(err,userInfo) {            
                  if(!err){
                    console.log("can get user info");
                    console.log(userInfo)
                    that.showUserAuthenticationDetails(userInfo);
                  }else{
                    console.log("cannot get user info");
                  }
                });
    });  

    var idToken = localStorage.getItem('userToken');

    if (idToken) {
      console.log("idToken")
      console.log(idToken)
      this.configureAuthenticatedRequests();
      this.data.auth0Lock.getProfile(idToken, function(err, profile) {
        if (err) {
          return alert('There was an error getting the profile: ' + err.message);
        }
        that.showUserAuthenticationDetails(profile);
      });
    }

    this.wireEvents();
  },
  configureAuthenticatedRequests: function() {
    $.ajaxSetup({
      'beforeSend': function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
      }
    });
  },
  showUserAuthenticationDetails: function(profile) {
    var showAuthenticationElements = !!profile;

    if (showAuthenticationElements) {
      this.uiElements.profileNameLabel.text(profile.nickname);
      this.uiElements.profileImage.attr('src', profile.picture);
    }

    this.uiElements.loginButton.toggle(!showAuthenticationElements);
    this.uiElements.logoutButton.toggle(showAuthenticationElements);
    this.uiElements.profileButton.toggle(showAuthenticationElements);
  },
  wireEvents: function() {
    var that = this;

    this.uiElements.loginButton.click(function(e) {
      that.data.auth0Lock.show()
    });

    this.uiElements.logoutButton.click(function(e) {
      localStorage.removeItem('userToken');

      that.uiElements.logoutButton.hide();
      that.uiElements.profileButton.hide();
      that.uiElements.loginButton.show();
    });

    this.uiElements.profileButton.click(function(e) {//APIGateWay追加後にこのコードを追加　P145
      var url = that.data.config.apiBaseUrl + '/user-profile';
      
      $.get(url, function(data, status) {
        console.log("user-profile")
        console.log(url)
        console.log(data)
        // $('#user-profile-raw-json').text(JSON.stringify(data, null, 2));
        // $('#user-profile-modal').modal();
        $.get(url,function(data,status){
          alert(JSON.stringify(data));
        })
      })
    });
  }
}
