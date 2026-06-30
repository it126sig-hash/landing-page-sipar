export function useLightbox() {
  const image = useState('lightbox-image', () => null); // { src, alt } | null

  function openLightbox(src, alt = '') {
    image.value = { src, alt };
  }
  function closeLightbox() {
    image.value = null;
  }

  return { image, openLightbox, closeLightbox };
}
