// Helper to format phone number to 08xx-xxxx-xxxx
const formatPhoneNumber = (num) => {
  let str = num.toString();
  if (str.startsWith('62')) {
    str = '0' + str.slice(2);
  }
  const match = str.match(/^(\d{4})(\d{4})(\d{4,5})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return str;
};

const meta = {
  projectName: 'Sanggar Indah Parahyangan',
  developer: 'Sanggar Indah Group',
  logo: '/assets/images/logo.webp',
  tagline: 'Akses Mudah, Hidup Lebih Nyaman',
  priceFrom: 'Mulai 160 Juta-an',
  whatsapp: {
    number: '6282118992299',
    templates: {
      konsultasi: 'Halo, saya lihat informasi di website dan saya ingin konsultasi & survey lokasi {project}.',
      simulasi:   'Halo, saya lihat informasi di website dan saya mau tanya simulasi cicilan flat {project}.',
      survey:     'Halo, saya lihat informasi di website dan saya ingin booking survey lokasi {project}.',
      type:       'Halo, saya lihat informasi di website dan saya tertarik dengan {type} di {project}. Boleh info lengkap & harga?',
    },
  },
  nav: [
    { id: 'tentang', label: 'Tentang Kami' },
    { id: 'tipe', label: 'Tipe Rumah' },
    { id: 'lokasi', label: 'Lokasi' },
    { id: 'kontak', label: 'Kontak' },
  ],
};

const locations = [
  { id: 'ikea', time: '15', place: 'IKEA',                  sub: 'Pusat kawasan & bisnis Bandung Barat.' },
  { id: 'tol',  time: '20', place: 'Tol Padalarang',        sub: 'Akses cepat ke seluruh Bandung Raya.' },
  { id: 'kcic', time: '25', place: 'Stasiun KCIC Whoosh',   sub: 'Kereta cepat menuju Jakarta.' },
];

export default {
  meta,

  hero: {
    badge: 'Cluster Subsidi Pertama di Saguling',
    headlineLines: ['Hunian Modern'],
    tagline: meta.tagline,
    sub: 'Nikmati kenyamanan tinggal di hunian nyaman yang berada di lingkungan asri dan sejuk, dengan lokasi strategis di jantung pertumbuhan Bandung Barat',
    primaryTypeId: '22-60',
    primaryCta: 'Lihat Tipe Rumah',
    image: '/assets/images/hero.webp',
    imageMobile: '/assets/images/hero-mobile.webp',
    heroMobile: '/assets/images/hero-mobile.webp',
  },

  about: {
    title: 'Tentang Kami',
    description: 'Kami adalah bagian dari Sanggar Indah Group yang sudah dikenal sebagai developer terpercaya dengan pengalaman, kualitas, dan penghargaan yang dimiliki.',
    awards: [
      { id: 'award1', year: '2000', title: 'Pelopor KPR Untuk Masyarakat', image: '/assets/images/awards/Pelopor KPR Untuk Masyarakat.webp' },
      { id: 'award2', year: '2002', title: 'Pelopor Pembangunan Rumah Sederhana Sehat', image: '/assets/images/awards/Pelopor Pembangunan Rumah Sederhana Sehat.webp' },
      { id: 'award3', year: '2012', title: 'FIABCI Indonesia - BNI Prix D\'Excellence Award', image: '/assets/images/awards/FIABCI Indonesia - BNI.webp' },
      { id: 'award4', year: '2012', title: 'BTN Property Award', image: '/assets/images/awards/BTN PROPERTY AWARD.webp' },
      { id: 'award5', year: '2015', title: 'Indonesia My Home Awards', image: '/assets/images/awards/INDONESIA MY HOME AWARDS.webp' },
      { id: 'award6', year: '2020', title: 'Gold Winner FIABCI Affordable Housing Category', image: '/assets/images/awards/GOLD WINNER FIABCI.webp' },
      { id: 'award7', year: '2023', title: 'Peringkat 1 Realisasi KPR Subsidi Terbanyak', image: '/assets/images/awards/Peringkat 1 Realisasi KPR.webp' },
    ],
  },

  defaultSpecs: [
    { label: 'Pondasi',  value: 'Batu Kali' },
    { label: 'Struktur', value: 'Beton Bertulang' },
    { label: 'Dinding',  value: 'Bata Interlock' },
    { label: 'Lantai',   value: 'Keramik' },
    { label: 'Atap',     value: 'Genteng Beton' },
    { label: 'Kusen',    value: 'Aluminium' },
    { label: 'Pintu',    value: 'Pintu Baja' },
    { label: 'Listrik',  value: '900/1300 VA' },
    { label: 'Air',      value: 'PAM Desa / Sumur' },
  ],
  houseTypes: [
    { id: '22-60', name: 'Tipe 22/60', lb: '22', lt: '60', kt: '1', km: '1',
      tag: 'Subsidi', subtitle: 'Untuk pasutri baru', priceFrom: '160 Jt-an',
      thumbnail: '/assets/images/rumah/tipe 2260.webp',
      gallery: ['/assets/images/rumah/galeri/2260-denah.webp', '/assets/images/rumah/galeri/2260-3d-ilustrasi.webp'],
      specsOverride: [{ label: 'Listrik', value: '900 VA' }] },
    { id: '26-72', name: 'Tipe 26/72', lb: '26', lt: '72', kt: '2', km: '1',
      tag: 'Komersil', subtitle: 'Untuk keluarga kecil', priceFrom: '200 Jt-an',
      thumbnail: '/assets/images/rumah/tipe 2672.webp',
      gallery: ['/assets/images/rumah/galeri/2672-denah.webp', '/assets/images/rumah/galeri/2672-3d-ilustrasi.webp'],
      specsOverride: [{ label: 'Listrik', value: '1300 VA' }] },
    { id: '36-72', name: 'Tipe 36/72', lb: '36', lt: '72', kt: '2', km: '1',
      tag: 'Komersil', subtitle: 'Untuk keluarga yang sedang bertumbuh', priceFrom: '300 Jt-an',
      thumbnail: '/assets/images/rumah/tipe 3672.webp',
      gallery: ['/assets/images/rumah/galeri/3672-denah.webp', '/assets/images/rumah/galeri/3672-3d-ilustrasi.webp'],
      specsOverride: [{ label: 'Listrik', value: '1300 VA' }] },
  ],

  oneGate: [
    { id: 'akses',    title: 'Akses Masuk Terkontrol',   desc: 'Satu pintu gerbang untuk lingkungan yang lebih aman dan tertata.' },
    { id: 'aman',     title: 'Keamanan Setara Perumahan Komersial',      desc: 'Fasilitas one gate system dengan harga tetap terjangkau.' },
    { id: 'privasi',  title: 'Anak Lebih Leluasa Bermain di Luar', desc: 'Lingkungan eksklusif membuat keluarga lebih tenang dan nyaman.' },
    { id: 'keluarga', title: 'Nilai Investasi Lebih Terjaga',    desc: 'Cluster bergerbang lebih diminati, harga jual tetap kompetitif.' },
  ],

  installment: {
    headline: 'Rumah Impian Tidak Harus Menunggu',
    intro: 'Cicilan flat sepanjang tenor, proses mudah, ringan, terukur, cocok untuk keluarga muda.',
    stat: '1 Jutaan',
    statSuffix: '/bulan',
    points: ['Proses mudah', 'DP ringan', 'Cicilan flat sepanjang tenor', 'Cocok keluarga muda'],
    disclaimer: '*S&K berlaku',
  },

  // Merged advantages: Reasons + Location + Invest + Demand
  advantages: [
    { id: 'loc1', title: 'Dekat KBP', desc: '', image: '/assets/images/fasilitas/logo kbp.webp' },
    { id: 'loc2', title: 'Dekat Tol Padalarang', desc: '', image: '/assets/images/fasilitas/logo tol.webp' },
    { id: 'loc3', title: 'Dekat WOOSH', desc: '', image: '/assets/images/fasilitas/logo woosh.webp' },
    { id: 'loc4', title: '', desc: '', image: '/assets/images/fasilitas/logo fasilitas.webp' },
  ],

  // Merged stats: key numbers from Demand + Installment
  stats: [
    { id: 's1', stat: '15 mnt', title: 'Ke KBP & IKEA', desc: 'Berdampingan dengan kawasan hunian & bisnis yang terus tumbuh.' },
    { id: 's2', stat: '30 mnt', title: 'Ke Stasiun Whoosh', desc: 'Kehadiran KCIC mempercepat kenaikan nilai properti.' },
    { id: 's3', stat: '1 Jt-an', title: 'Cicilan Flat', desc: 'Rasa komersial, harga subsidi mulai 1 jutaan/bulan.' },
  ],

  banks: [
    { name: 'BCA', image: '/assets/images/bank/bca.webp' },
    { name: 'BTN', image: '/assets/images/bank/btn.webp' },
  ],

  locationSection: {
    title: 'Lokasi di Pusat Pertumbuhan',
    mapImage: '/assets/images/petalokasi.webp',
    mapUrl: 'https://maps.app.goo.gl/UQb822nm8bBxj81x9',
    facilities: [
      'IKEA',
      'STASIUN KCIC WHOOSH',
      'XXI CINEMA',
      'TOL PADALARANG',
      'PARAHYANGAN GOLF',
      'RUMAH SAKIT',
      'WAHOO WATER WORLD',
      'PASAR PARAHYANGAN'
    ],
  },

  faqs: [
    { id: 'f1',  question: 'Siapa pengembang Sanggar Indah Parahyangan?', answer: 'Dikembangkan oleh PT Sanggar Duta Parahyangan, bagian dari Sanggar Indah Group yang telah berpengalaman lebih dari 30 tahun di bidang properti, dan terdaftar sebagai anggota Real Estate Indonesia (REI).' },
    { id: 'f2',  question: 'Penghargaan apa saja yang pernah diraih pengembang?', answer: '[Isi jawaban di sini — tim SIPAR perlu melengkapi daftar penghargaan resmi, karena tidak ditemukan publikasinya secara online]' },
    { id: 'f3',  question: 'Proyek apa saja yang sudah dibangun oleh pengembang ini?', answer: '[Isi jawaban di sini — tim SIPAR perlu melengkapi daftar proyek sebelumnya, karena portofolio lengkap tidak ditemukan publikasinya secara online]' },
    { id: 'f6',  question: 'Bagaimana skema cicilannya?', answer: 'Cicilan flat sepanjang tenor tanpa naik-turun, sehingga lebih mudah direncanakan untuk keuangan keluarga.' },
    { id: 'f7',  question: 'Apakah bisa KPR meski belum punya slip gaji tetap?', answer: '[Isi jawaban di sini — perlu konfirmasi tim terkait jalur pengajuan untuk pekerja informal/wiraswasta]' },
    { id: 'f8',  question: 'Apakah ada show unit/rumah contoh yang bisa dikunjungi?', answer: 'Ada' },
  ],

  finalCta: {
    headline: 'Wujudkan Rumah Impian Anda Sekarang',
    chips: ['Cicilan Flat', 'One Gate System', 'Dekat KBP', 'Dekat KCIC'],
    phoneDisplay: 'WhatsApp Marketing · ' + formatPhoneNumber(meta.whatsapp.number),
  },

  footer: {
    mainAddress: {
      label: 'Kantor Pemasaran',
      lines: ['Jl. Banyakniaga Kaler No.27', 'Kota Baru Parahyangan, Jawa Barat']
    },
    secondAddress: {
      label: 'Kantor Pusat',
      lines: ['Jl. Sukahaji No.126 (Gedung GRHA Satria)', 'Kota Bandung, Jawa Barat']
    },
    quickLinks: [
      { id: 'tentang', label: 'Tentang Kami' },
      { id: 'keunggulan', label: 'Keunggulan' },
      { id: 'produk', label: 'Produk' },
      { id: 'faq', label: 'FAQ' }
    ],
    email: 'sanggarindahgroup@gmail.com',
    instagram: '@sanggar_indah_parahyangan',
    phoneDisplay: formatPhoneNumber(meta.whatsapp.number),
  },
};