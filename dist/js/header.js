!(function () {

  // State Variables
  var trayOpen = false;
  var spConfig = window.superpedestrianConfig || {};

  /*
    function performOnElement
  */
  function performOnElement(name, func) {
    var item = document.getElementById(name);
    if (item) {
      func(item);
    }
  }

  function performOnClass(name, func) {
    var items = document.getElementsByClassName(name);
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      func(item);
    }
  }

  var hideElement = function (element) {
    element.style.visibility = "hidden";
    element.style.display = "none";
  };

  var showElement = function (element) {
    element.style.visibility = "";
    var previousDisplay = element.getAttribute('data-display');
    if (previousDisplay) {
      element.style.display = previousDisplay;
    } else {
      element.style.display = "block";
    }
  };

  var toggleElement = function (element) {
    if (element.style.display && element.style.display === 'none') {
      showElement(element);
    } else {
      hideElement(element);
    }
  }

  var clickTray = function (button) {
    button.onclick = function () {
      trayOpen = !trayOpen;
      if (trayOpen) {
        performOnElement('arrow-menu', showElement);
        document.getElementById('user_dropdown').className = "open";
      }
      else {
        performOnElement('arrow-menu', hideElement);
        document.getElementById('user_dropdown').className = "";
      }
    }
  };

  var menuToggle = document.querySelector('#menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', classToggle);
  }

  var toggleNestedBtn = document.querySelector('#toggle_nested');
  if (toggleNestedBtn) {
    toggleNestedBtn.addEventListener('click', toggleNested);
  }

  function classToggle() {
    document.querySelector('#hamburger').classList.toggle('open');
  }

  var rotatedCaret = false;

  function rotateCaret() {
    var accordionBtn = document.getElementById('accordion_btn');
    var deg = rotatedCaret ? 0 : 180;
    accordionBtn.style.webkitTransform = 'rotate(' + deg + 'deg)';
    accordionBtn.style.mozTransform = 'rotate(' + deg + 'deg)';
    accordionBtn.style.msTransform = 'rotate(' + deg + 'deg)';
    accordionBtn.style.oTransform = 'rotate(' + deg + 'deg)';
    accordionBtn.style.transform = 'rotate(' + deg + 'deg)';

    rotatedCaret = !rotatedCaret;
  }

  performOnClass('nested-nav', function (element) {
    element.setAttribute('data-display', "flex");
  });

  function toggleNested() {
    performOnClass('nested-nav', toggleElement)
    rotateCaret();
  }

  function classToggle() {
    document.querySelector('#hamburger').classList.toggle('open');
  }

  // function for auto-accepting cookies when we're in the US
  var cookiesAccepted = function (locale) {
    var cookies = document.cookie;
    document.cookie = "cookies-accepted=yes;path=/;domain=.superpedestrian.com";
    if (!(cookies.indexOf('locale=') > -1)) {
      document.cookie = "locale=" + locale + ";path=/;domain=.superpedestrian.com";
    }
  };

  var setLinks = function () {
    var loginURL = spConfig.loginURL || 'https://account.superpedestrian.com/login?redirect=https://www.superpedestrian.com';
    var profileURL = spConfig.profileURL || 'https://account.superpedestrian.com/profile';
    var ordersURL = spConfig.ordersURL || 'https://shop.superpedestrian.com/account';
    var logoutURL = spConfig.logoutURL || 'https://account.superpedestrian.com/logout';
    var logoutNext = spConfig.logoutNext || 'https://www.superpedestrian.com';

    performOnClass('sp-login-url', function (element) {
      element.href = loginURL;
    });

    performOnClass('sp-profile-url', function (element) {
      element.href = profileURL;
    });

    performOnClass('sp-orders-url', function (element) {
      element.href = ordersURL;
    });

    performOnClass('sp-logout-url', function (element) {
      element.href = logoutURL;
    });
  };

  var setCartCount = function (cookies) {
    var cartCount = 0;
    if (cookies.indexOf('item_count=') > -1) {
      var splitCookies = cookies.split('; ');
      for (cookieIndex = 0; cookieIndex < splitCookies.length; cookieIndex++) {
        var key = splitCookies[cookieIndex].split('=')[0].trim();
        var value = splitCookies[cookieIndex].split('=')[1];
        if (key === 'item_count') {
          cartCount = value;
        }
      }

      var shopBadge = document.getElementById('shop-badge');
      if (shopBadge) {
        shopBadge.innerHTML = (cartCount > 9) ? '9+' : cartCount;
      }

      performOnElement('shop-badge', showElement);
    }
  };

  var setCountryIcon = function (cookies) {
    var countryCode = 'us';
    var localeParam = getQueryVariable("locale");

    if (localeParam) {
      var splitLocale = localeParam.split('-');
      if (splitLocale[1]) {
        countryCode = splitLocale[1];
      }
    } else if (cookies.indexOf('locale=') > -1) {
      var splitCookies = cookies.split(';');
      for (cookieIndex = 0; cookieIndex < splitCookies.length; cookieIndex++) {
        var key = splitCookies[cookieIndex].split('=')[0].trim();
        var value = splitCookies[cookieIndex].split('=')[1];
        if (key === 'locale') {
          countryCode = value.split('-')[1];
        }
      }
    }

    var countryBadge = document.getElementById('country-badge');
    if (countryBadge) {
      countryBadge.className = "flag-icon flag-icon-squared flag-icon-" + countryCode.toLowerCase();
    }
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
    var dropdownArea = document.getElementById('dropdown-area');
    if (dropdownArea) {
      dropdownArea.className = '';
    }

    setLinks();
    setCartCount(cookies);
    setCountryIcon(cookies);

    if ((cookies.indexOf('_sp_sso=') > -1) && (cookies.indexOf('_sp_user=') > -1)) {
      // Cookies found display My Account
      performOnElement('login-button', hideElement);
      performOnElement('account-button', clickTray);
      performOnClass('hidden-logged-in', function (element) {
        element.parentNode.removeChild(element);
      });
      performOnClass('visible-logged-in', showElement);
    }
    else {
      // Show login button
      performOnElement('account-button', hideElement);
      performOnClass('hidden-logged-in', showElement);
      performOnClass('visible-logged-in', hideElement);
    }

    performOnClass('nested-nav', function (element) {
      hideElement(element);
    });

    // Show cookie banner if cookie isn't set and the locale is not en-US
    var localeParam = getQueryVariable("locale");
    if (!(cookies.indexOf('cookies-accepted=') > -1)) {
      var banner = document.getElementById("cookie-banner");
      if (banner) {
        if (localeParam && localeParam.split('-').length > 1) {
          var splitLocale = localeParam.split('-');
          if (splitLocale[1] !== 'us') {
            banner.style.display = "block";
          }
          else {
            cookiesAccepted(localeParam);
          }
        }
        // Check for locale cookie and show banner for non-US locale
        else if (cookies.indexOf('locale=') > -1) {
          var splitCookies = cookies.split(';');
          for (cookieIndex = 0; cookieIndex < splitCookies.length; cookieIndex++) {
            var key = splitCookies[cookieIndex].split('=')[0].trim();
            var value = splitCookies[cookieIndex].split('=')[1];
            if (key === 'locale') {
              if (value.split('-')[1] !== 'us') {
                banner.style.display = "block";
              }
              else {
                cookiesAccepted(value);
              }
            }
          }
        }
        // Check for browser locale
        else if (navigator.language && navigator.language.split('-').length > 1 && navigator.language.split('-')[1] === 'US') {
          banner.style.display = "none";
          cookiesAccepted(navigator.language);
        }
        else if (navigator.userLanguage && navigator.userLanguage.split('-').length > 1 && navigator.userLanguage.split('-')[1] === 'US') {
          banner.style.display = "none";
          cookiesAccepted(navigator.userLanguage);
        }
        // Display banner if none of those exist and we don't know anything about their locale
        else {
          banner.style.display = "block";
        }
      }
    }
  }

  init();
})();
