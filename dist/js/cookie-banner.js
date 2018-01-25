function cookiesAccepted() {
  var banner = document.getElementById("cookie-banner");
  banner.style.display = "none";
  document.cookie = "cookies-accepted=yes;path=/"
}
