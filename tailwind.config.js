/** @type {import('tailwindcss').Config} */
export default {
  safelist: ['scroll-smooth'],
  theme: {
    extend: {
      colors: {
        'forest-deep': '#1C4A2A',
        'forest-medium': '#2E5A36',
        'forest-light': '#6FB544',
        charcoal: '#23271F',
        'charcoal-gray': '#6E7268',
        orange: '#EE8322',
        'orange-light': '#F6A24A',
        'off-white': '#FBFAF6',
        'cream-light': '#ECEAE1',
        'stone-gray': '#8A8F84',
        'sage-pale': '#E4EFDD',
        'mint-pale': '#EDF4E7',
        'sage-mist': '#BFD8B6',
        'sage-medium': '#CFE6C8',
        'sage-olive': '#5C7A52',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Be Vietnam Pro', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'size-1': ['4.125rem',   { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '800' }],
        'size-2': ['2.5625rem',  { lineHeight: '1.1',  letterSpacing: '-0.01em', fontWeight: '800' }],
        'size-3': ['1.5625rem',  { lineHeight: '1.2',  letterSpacing: '-0.005em', fontWeight: '700' }],
        'size-4': ['1rem',       { lineHeight: '1.3',  letterSpacing: '0',        fontWeight: '700' }],
        'size-5': ['0.6125rem',  { lineHeight: '1.4',  letterSpacing: '0.01em',  fontWeight: '600' }],
        'size-6': ['0.3813rem',  { lineHeight: '1.5',  letterSpacing: '0.02em',  fontWeight: '400' }],
        'size-7': ['0.2361rem',  { lineHeight: '1.5',  letterSpacing: '0.02em',  fontWeight: '400' }],
        'size-8': ['0.1459rem',  { lineHeight: '1.4',  letterSpacing: '0.04em',  fontWeight: '400' }],
      },
      borderRadius: {
        btn: '11px',
      },
      // ── Resep tombol premium ──────────────────────────────────────────────
      // Ditaruh terpusat di sini, bukan ditulis ulang sebagai string panjang di
      // tiap komponen, supaya satu kali ubah berlaku untuk seluruh landing page.
      //
      // Aturan warnanya: kedua ujung gradasi diambil dari HUE YANG SAMA dengan
      // beda lightness tipis. Dua warna berbeda akan terlihat norak, bukan mewah.
      // Varian -hover sengaja lebih terang, bukan lebih gelap, supaya tombol
      // terasa "menyala" saat disentuh.
      // Setiap gradasi DIPUSATKAN pada warna asli tombolnya: ujung gelap dan
      // ujung terang berjarak sama dari warna itu, sehingga rata-ratanya kembali
      // ke warna semula. Jadi identitas warnanya tidak bergeser sedikit pun —
      // yang bertambah hanya dimensinya.
      //   emas   #c9a84c -> #b8974a .. #dab962
      //   hijau  #142b20 -> #0a1610 .. #1e4030
      //   oranye #EE8322 -> #d66f1a .. #ff972a
      //   wa     #25D366 -> #1cba5a .. #2eec72
      backgroundImage: {
        'grad-gold': 'linear-gradient(135deg,#b8974a 0%,#dab962 100%)',
        'grad-gold-hover': 'linear-gradient(135deg,#c9a84c 0%,#e6cd7a 100%)',
        'grad-forest': 'linear-gradient(135deg,#0a1610 0%,#1e4030 100%)',
        'grad-forest-hover': 'linear-gradient(135deg,#142b20 0%,#2a5540 100%)',
        'grad-orange': 'linear-gradient(135deg,#d66f1a 0%,#ff972a 100%)',
        'grad-orange-hover': 'linear-gradient(135deg,#e6801f 0%,#ffa445 100%)',
        'grad-wa': 'linear-gradient(135deg,#1cba5a 0%,#2eec72 100%)',
        'grad-wa-hover': 'linear-gradient(135deg,#26cc63 0%,#45f085 100%)',
      },
      // Dua lapis yang membuat tombol terasa timbul:
      // 1. inset highlight 1px di sisi atas — seolah kena cahaya dari atas
      // 2. drop shadow berwarna senada yang digelapkan, BUKAN hitam. Shadow
      //    hitam membuat warna emas dan oranye terlihat kotor.
      boxShadow: {
        'btn-gold': 'inset 0 1px 0 rgba(255,255,255,0.45), 0 4px 12px -4px rgba(150,120,40,0.55)',
        'btn-gold-lg': 'inset 0 1px 0 rgba(255,255,255,0.55), 0 10px 22px -8px rgba(150,120,40,0.65)',
        'btn-forest': 'inset 0 1px 0 rgba(255,255,255,0.16), 0 4px 12px -4px rgba(10,32,20,0.55)',
        'btn-forest-lg': 'inset 0 1px 0 rgba(255,255,255,0.22), 0 10px 22px -8px rgba(10,32,20,0.7)',
        'btn-orange': 'inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 12px -4px rgba(180,90,15,0.55)',
        'btn-orange-lg': 'inset 0 1px 0 rgba(255,255,255,0.45), 0 10px 22px -8px rgba(180,90,15,0.65)',
        'btn-wa': 'inset 0 1px 0 rgba(255,255,255,0.30), 0 4px 12px -4px rgba(18,140,70,0.55)',
        'btn-wa-lg': 'inset 0 1px 0 rgba(255,255,255,0.40), 0 10px 22px -8px rgba(18,140,70,0.65)',
      },
      keyframes: {
        floatPulse: {
          '0%, 100%': { boxShadow: '0 12px 28px -8px rgba(238,131,34,.55)' },
          '50%': { boxShadow: '0 12px 34px -6px rgba(238,131,34,.85)' },
        },
      },
      animation: {
        floatPulse: 'floatPulse 2.4s ease-in-out infinite',
      },
    },
  },
}
