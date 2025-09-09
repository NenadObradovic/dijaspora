export const isWebView = () => {
  const ua = navigator.userAgent || navigator?.vendor || window.opera
  return /Telegram|FB_IAB|FBAN|FBAV|Instagram/i.test(ua)
}

export const latinToCyrillic = (text) => {
  const letters = {
    nj: 'њ',
    dž: 'џ',
    lj: 'љ',
    NJ: 'Њ',
    DŽ: 'Џ',
    LJ: 'Љ',
    Nj: 'Њ',
    Dž: 'Џ',
    Lj: 'Љ',

    a: 'а',
    b: 'б',
    c: 'ц',
    č: 'ч',
    ć: 'ћ',
    d: 'д',
    đ: 'ђ',
    e: 'е',
    f: 'ф',
    g: 'г',
    h: 'х',
    i: 'и',
    j: 'ј',
    k: 'к',
    l: 'л',
    m: 'м',
    n: 'н',
    o: 'о',
    p: 'п',
    r: 'р',
    s: 'с',
    š: 'ш',
    t: 'т',
    u: 'у',
    v: 'в',
    z: 'з',
    ž: 'ж',

    A: 'А',
    B: 'Б',
    C: 'Ц',
    Č: 'Ч',
    Ć: 'Ћ',
    D: 'Д',
    Đ: 'Ђ',
    E: 'Е',
    F: 'Ф',
    G: 'Г',
    H: 'Х',
    I: 'И',
    J: 'Ј',
    K: 'К',
    L: 'Л',
    M: 'М',
    N: 'Н',
    O: 'О',
    P: 'П',
    R: 'Р',
    S: 'С',
    Š: 'Ш',
    T: 'Т',
    U: 'У',
    V: 'В',
    Z: 'З',
    Ž: 'Ж',
  }

  let converted = text.replace(
    /nj|dž|lj|NJ|DŽ|LJ|Nj|Dž|Lj/g,
    (match) => letters[match],
  )

  converted = converted
    .split('')
    .map((char) => letters[char] || char)
    .join('')

  return converted
}
