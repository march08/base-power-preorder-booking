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

export const displayBlock = (el: HTMLElement) => {
  el.style.display = "block";
};
