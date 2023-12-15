export const hideElement = (el: HTMLElement) => {
  el.style.opacity = "0";
  el.style.visibility = "hidden";
};

export const showElemenet = (el: HTMLElement) => {
  el.style.opacity = "1";
  el.style.visibility = "visible";
};

export const displayNone = (el: HTMLElement) => {
  el.style.display = "none";
};

export const displayBlock = (el: HTMLElement, display: string = "block") => {
  el.style.display = display;
};

export function fadeIn(element: HTMLDivElement, display: string = "block") {
  let op = 0.1; // initial opacity
  element.style.opacity = "0";
  element.style.display = display;
  const timer = setInterval(function () {
    if (op >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = `${op}`;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op += op * 0.3;
  }, 1);
}
export function fadeOut(element: HTMLDivElement) {
  let op = 1; // initial opacity
  const timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      element.style.display = "none";
    }
    element.style.opacity = `${op}`;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op -= op * 0.3;
  }, 1);
}
