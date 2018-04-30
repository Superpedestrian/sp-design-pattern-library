function cookiesAccepted() {
  var banner = document.getElementById("cookie-banner");
  banner.style.display = "none";
  document.cookie = "cookies-accepted=yes;path=/"
  location.reload(true);
}

function cookiesDeclined() {
  var banner = document.getElementById("cookie-banner");
  banner.style.display = "none";
}
