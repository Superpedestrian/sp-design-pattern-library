!function(){

  // State Variables
  var trayOpen = false;
  var spConfig = window.superpedestrianConfig || {};

  /*
    function performOnElement
  */
  function performOnElement(name, func) {
    var item = document.getElementById(name);
    func(item);
  }

  var hideElement = function(element) {
    element.style.visibility = "hidden";
    element.style.display = "none";
  }

  var showElement = function(element) {
    element.style.visibility = "";
    element.style.display = "block";
  }

  var clickTray = function(button) {
    button.onclick = function() {
      trayOpen = !trayOpen;
      if(trayOpen){
        performOnElement('arrow-menu', showElement);  
        document.getElementById('account-caret').className = "fa fa-caret-up";
      }
      else {
        performOnElement('arrow-menu', hideElement);
        document.getElementById('account-caret').className = "fa fa-caret-down";
      }
    }
  }

  var setLinks = function () {
    var loginURL = spConfig.loginURL || 'https://account.superpedestrian.com/login?redirect=https://superpedestrian.com';
    var profileURL = spConfig.profileURL || 'https://account.superpedestrian.com/profile';
    var ordersURL = spConfig.ordersURL || 'https://shop.superpedestrian.com/account';
    var logoutURL = spConfig.logoutURL || 'https://account.superpedestrian.com/logout';
    var logoutNext = spConfig.logoutNext || 'https://superpedestrian.com';

    document.getElementById('sp-login-url').href = loginURL;
    document.getElementById('sp-profile-url').href = profileURL;
    document.getElementById('sp-orders-url').href = ordersURL;
    document.getElementById('sp-logout-url').href = logoutURL + '?next=' + logoutNext;
  }

  function init() {
    var cookies = document.cookie;
    performOnElement('arrow-menu', hideElement);
    setLinks();

    if((cookies.indexOf('_sp_sso=') > -1) && (cookies.indexOf('_sp_user=') > -1)){
      // Cookies found display My Account
      performOnElement('login-button', hideElement);
      performOnElement('account-button', clickTray);
    }
    else {
      // Show login button
      performOnElement('account-button', hideElement);
    }
  }

  init();
}();