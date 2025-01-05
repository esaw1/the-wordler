export const refreshAnimation = (id) => {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = null;
}

export const flashTile = (id, startColor = '#6366f1', endColor = '#2d2d2d') => {
  const tile = document.getElementById(id);
  if (tile) {
    tile.style.setProperty('--flash-start', startColor);
    tile.style.setProperty('--flash-end', endColor);
    refreshAnimation(id);
  }
}