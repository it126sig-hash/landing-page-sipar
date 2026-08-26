export function useLightbox() {
  // Galeri: { items: [{src, alt}], index }  | null
  const gallery = useState('lightbox-gallery', () => null);

  /** Buka galeri berisi banyak gambar, mulai dari index tertentu. */
  function openGallery(items, index = 0) {
    if (!items || !items.length) return;
    gallery.value = { items, index: Math.max(0, Math.min(index, items.length - 1)) };
  }

  /** Kompatibilitas: buka satu gambar lewat URL langsung. */
  function openLightbox(src, alt = '') {
    openGallery([{ src, alt }], 0);
  }

  function closeLightbox() {
    gallery.value = null;
  }

  function go(delta) {
    const g = gallery.value;
    if (!g || g.items.length < 2) return;
    const n = g.items.length;
    gallery.value = { items: g.items, index: (g.index + delta + n) % n };
  }
  const next = () => go(1);
  const prev = () => go(-1);

  return { gallery, openGallery, openLightbox, closeLightbox, next, prev };
}
