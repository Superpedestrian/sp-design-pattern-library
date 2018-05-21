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
  };

  var showElement = function(element) {
    element.style.visibility = "";
    element.style.display = "block";
  };

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
  };

  // function for auto-accepting cookies when we're in the US
  var cookiesAccepted = function(locale) {
    var cookies = document.cookie;
    document.cookie = "cookies-accepted=yes;path=/;domain=.superpedestrian.com";
    if(!(cookies.indexOf('locale=') > -1)) {
      document.cookie = "locale=" + locale + ";path=/;domain=.superpedestrian.com";
    }
  };

  var setLinks = function () {
    var loginURL = spConfig.loginURL || 'https://account.superpedestrian.com/login?redirect=https://www.superpedestrian.com';
    var profileURL = spConfig.profileURL || 'https://account.superpedestrian.com/profile';
    var ordersURL = spConfig.ordersURL || 'https://shop.superpedestrian.com/account';
    var logoutURL = spConfig.logoutURL || 'https://account.superpedestrian.com/logout';
    var logoutNext = spConfig.logoutNext || 'https://www.superpedestrian.com';

    document.getElementById('sp-login-url').href = loginURL;
    document.getElementById('sp-profile-url').href = profileURL;
    document.getElementById('sp-orders-url').href = ordersURL;
    document.getElementById('sp-logout-url').href = logoutURL + '?next=' + logoutNext;
  };


  var setCartCount = function(cookies) {
    var cartCount = 0;
    if(cookies.indexOf('item_count=') > -1){
      var splitCookies = cookies.split('; ');
      for(cookieIndex = 0; cookieIndex < splitCookies.length; cookieIndex++) {
        var key = splitCookies[cookieIndex].split('=')[0].trim();
        var value = splitCookies[cookieIndex].split('=')[1];
        if(key === 'item_count') {
          cartCount = value;
        }
      }

      document.getElementById('shop-badge').innerHTML= (cartCount > 9) ? '9+': cartCount;
      performOnElement('shop-badge', showElement);
    }
  };

  var setCountryIcon = function(cookies) {
    var countryCode = 'us';
    var localeParam = getQueryVariable("locale");

    if(localeParam) {
      var splitLocale = localeParam.split('-');
      if( splitLocale[1] ) {
        countryCode = splitLocale[1];
      }
    } else if(cookies.indexOf('locale=') > -1) {
      var splitCookies = cookies.split(';');
      for(cookieIndex = 0; cookieIndex < splitCookies.length; cookieIndex++) {
        var key = splitCookies[cookieIndex].split('=')[0].trim();
        var value = splitCookies[cookieIndex].split('=')[1];
        if(key === 'locale') {
          countryCode = value.split('-')[1];
        }
      }
    }

    document.getElementById('country-badge').className = "flag-icon flag-icon-squared flag-icon-" + countryCode;
  };

  function getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) === variable) {
              return decodeURIComponent(pair[1]);
          }
      }
      console.log('Query variable %s not found', variable);
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

    // Show cookie banner if cookie isn't set and the locale is not en-US
    var localeParam = getQueryVariable("locale");
    if(!(cookies.indexOf('cookies-accepted=') > -1)) {
      var banner = document.getElementById("cookie-banner");

      if(localeParam) {
        var splitLocale = localeParam.split('-');
        if( splitLocale[1] !== 'us') {
          banner.style.display = "block";
        }
        else {
          cookiesAccepted(localeParam);
        }
      }
      // Check for locale cookie and show banner for non-US locale
      else if(cookies.indexOf('locale=') > -1) {
        var splitCookies = cookies.split(';');
        for(cookieIndex = 0; cookieIndex < splitCookies.length; cookieIndex++) {
          var key = splitCookies[cookieIndex].split('=')[0].trim();
          var value = splitCookies[cookieIndex].split('=')[1];
          if(key === 'locale') {
            if(value.split('-')[1] !== 'us') {
              banner.style.display = "block";
            }
            else {
              cookiesAccepted(value);
            }
          }
        }
      }
      // Check for browser locale
      else if(navigator.language.split('-')[1] === 'US' || navigator.userLanguage.split('-')[1] === 'US'){
        banner.style.display = "none";
        if(navigator.language){
          cookiesAccepted(navigator.language);
        }
        else {
          cookiesAccepted(navigator.userLanguage)
        }
      }
      // Display banner if none of those exist and we don't know anything about their locale
      else {
        banner.style.display = "block";
      }
    }
  }

  init();
}();
