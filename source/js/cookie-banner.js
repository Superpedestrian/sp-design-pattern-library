function cookiesAccepted() {
  var banner = document.getElementById("cookie-banner");
  banner.style.display = "none";
  document.cookie = "cookies-accepted=yes;path=/;domain=.superpedestrian.com";
  document.cookie = "cookies-send-accepted=yes;path=/;domain=.superpedestrian.com";
  location.reload(true);
}

function cookiesDeclined() {
  var banner = document.getElementById("cookie-banner");
  banner.style.display = "none";
}
