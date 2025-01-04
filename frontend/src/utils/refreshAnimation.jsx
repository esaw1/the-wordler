function refreshAnimation(id) {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = null;
}

export default refreshAnimation;
