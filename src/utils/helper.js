export const isWebView = () => {
  const ua = navigator.userAgent || navigator?.vendor || window.opera
  return /Telegram|FB_IAB|FBAN|FBAV|Instagram/i.test(ua)
}
