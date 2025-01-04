const refreshAnimation = (id) => {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = null;
}

export default refreshAnimation;
