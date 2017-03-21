/**
 * https://developers.google.com/api-client-library/javascript/features/authentication
 * Authentication using the Google APIs Client Library for JavaScript
 *
 */

/* globals gapi */

const m = require('mithril');

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
const CLIENT_ID = '<your client id>';
const API_KEY = '<your api key>';

/**
 * Google Auth2 APIのロード
 * APIキーのセット
 * Auth2 APIの初期化(CLIENT ID, scopeのセット)
 * サインイン
 * カレンダーAPIのロード
 * カレンダーAPIの実行
 */

/**
 * Google Auth APIを利用するための初期化処理
 * params
 *   onUpdateSigninStatus: ユーザのGoogleアカウントのサインイン状態が変わったら呼ばれる関数
 *   callback: 関数
 *   scopes: スコープのリスト(必須)
 */
function initAuth(params) {
  return gapi.load('client:auth2', () => {
    gapi.client.setApiKey(API_KEY);
    return gapi.auth2.init({
      client_id: CLIENT_ID,
      scope: params.scopes.join(' '),
    }).then(() => {
      if (params.onUpdateSigninStatus) {
        gapi.auth2.getAuthInstance().isSignedIn.listen(params.onUpdateSigninStatus);
        params.onUpdateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      }
      if (params.callback) {
        params.callback();
      }
    });
  });
}

function signIn() {
  const deferred = m.deferred();
  const google_auth = gapi.auth2.getAuthInstance();
  if (google_auth.isSignedIn.get()) {
    deferred.resolve();
    return deferred.promise;
  } else {
    return google_auth.signIn();
  }
}

function signOut() {
  return gapi.auth2.getAuthInstance().signOut();
}

module.exports = {initAuth, signIn, signOut};
