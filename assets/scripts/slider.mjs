export function loadSliders() {
  document.querySelectorAll(`.slider`).forEach((slider) => {
    // there's probably a better way to do all this
    // also may need additional listeners for touch inputs

    const vertical = slider.classList.contains(`vertical`);
    const thumb = slider.querySelector(`div`);
    const sliderData = thumb.dataset;
    let active = false;

    // im going to fucking explode
    const updatePos = (x, y) => {
      const elemBox = slider.getBoundingClientRect();

      const thumbsize = (vertical) ? thumb.offsetHeight : thumb.offsetWidth;
      const slidersize = (vertical) ? slider.offsetHeight : slider.offsetWidth;
      const thumblimit = slidersize - thumbsize;

      // calculate base position of thumb
      let pos;
      if (vertical) {
        pos = Math.max(0, Math.min(slidersize, (y + (thumbsize / 2)) - elemBox.top) - thumbsize);
      } else {
        pos = Math.max(0, Math.min(slidersize, (x + (thumbsize / 2)) - elemBox.left) - thumbsize);
      }

      // get slider value from that position
      const rawValue = Math.round(sliderData.max * (pos / (thumblimit)));

      // snap thumb to nearest position based on max value of the input range
      const rounded = Math.max(0, Math.min(thumblimit, Math.round((thumblimit) * (rawValue / sliderData.max))));
      
      // done!
      if (vertical) {
        // "invert" value if it's a vertical slider
        // because otherwise setting the slider to the lowest position
        // would make it it's max value, which would be weird and counter-intuitive
        sliderData.value = Math.round((1 - (rawValue / sliderData.max)) * sliderData.max);
        thumb.style.top = rounded + `px`;
      } else {
        sliderData.value = Math.round(rawValue);
        thumb.style.left = rounded + `px`;
      }
    };

    // set initial thumb position
    const initBox = slider.getBoundingClientRect();

    if (vertical) {
      const val = initBox.top + ((slider.offsetHeight / sliderData.max) * sliderData.value);
      updatePos(0, val);
    } else {
      const val = initBox.left + ((slider.offsetWidth / sliderData.max) * sliderData.value);
      updatePos(val, 0);
    }

    slider.addEventListener(`mousedown`, (e) => {
      if (e.button !== 0) return;
      active = true;
      updatePos(e.clientX, e.clientY);
    });

    window.addEventListener(`mousemove`, (e) => {
      if (e.button !== 0 || !active) return;
      updatePos(e.clientX, e.clientY);
    });

    window.addEventListener(`mouseup`, (e) => {
      if (e.button !== 0 || !active) return;
      active = false;
    });
  });
}