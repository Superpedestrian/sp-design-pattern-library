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
        document.getElementById('account-caret').className = "glyphicon glyphicon-triangle-top";
      }
      else {
        performOnElement('arrow-menu', hideElement);
        document.getElementById('account-caret').className = "glyphicon glyphicon-triangle-bottom";
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


  var setCartCount = function(cookies) {
    var cartCount = 0;
    if(cookies.indexOf('item_count=') > -1){
      var splitCookies = cookies.split('; ');
      for(cookieIndex = 0; cookieIndex < splitCookies.length; cookieIndex++) {
        var key = splitCookies[cookieIndex].split('=')[0].trim();
        var value = splitCookies[cookieIndex].split('=')[1];
        if(key == 'item_count') {
          cartCount = value;
        }
      }

      document.getElementById('shop-badge').innerHTML= (cartCount > 9) ? '9+': cartCount;
      performOnElement('shop-badge', showElement);
    }
  }
  
  var setCountryIcon = function(cookies) {
    var countryCode = 'us';
    if(cookies.indexOf('locale=') > -1){
      var splitCookies = cookies.split(';');
      for(cookieIndex = 0; cookieIndex < splitCookies.length; cookieIndex++) {
        var key = splitCookies[cookieIndex].split('=')[0].trim();
        var value = splitCookies[cookieIndex].split('=')[1];
        if(key == 'locale') {
          countryCode = value.split('-')[1];
        }
      }

      document.getElementById('country-badge').className = "flag-icon flag-icon-squared flag-icon-" + countryCode;
    }
  }

  function init() {
    var cookies = document.cookie;
    performOnElement('arrow-menu', hideElement);
    // Allow dropdown area to be shown after we've hidden the submenu
    document.getElementById('dropdown-area').className = '';

    setLinks();
    setCartCount(cookies);
    setCountryIcon(cookies);

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