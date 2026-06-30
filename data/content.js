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
  logo: '/assets/images/logo.png',
  tagline: 'Hunian nyaman dekat Kota Baru Parahyangan',
  priceFrom: 'Mulai 160 Juta-an',
  whatsapp: {
    number: '6282118992299',
    templates: {
      konsultasi: 'Halo, saya ingin konsultasi & survey lokasi {project}.',
      simulasi:   'Halo, saya mau tanya simulasi cicilan flat {project}.',
      survey:     'Halo, saya ingin booking survey lokasi {project}.',
      type:       'Halo, saya tertarik dengan {type} di {project}. Boleh info lengkap & harga?',
    },
  },
  nav: [
    { id: 'alasan', label: 'Alasan' },
    { id: 'cicilan', label: 'Cicilan' },
    { id: 'tipe', label: 'Tipe Rumah' },
    { id: 'lokasi', label: 'Lokasi' },
    { id: 'faq', label: 'FAQ' },
  ],
};

export default {
  meta,

  // ponytail: lokasi & alasan punya angka/tempat berbeda secara sengaja
  // (lihat docs design) — jangan disatukan jadi satu sumber turunan lagi.
  reasons: [
    { id: 'kbp',     num: '1', title: 'Dekat Kota Baru Parahyangan',  desc: 'Hanya 15 menit dari pusat kawasan & bisnis Bandung Barat.' },
    { id: 'tol',     num: '2', title: 'Dekat Tol Padalarang',         desc: 'Akses cepat 20 menit ke seluruh Bandung Raya.' },
    { id: 'kcic',    num: '3', title: 'Dekat Stasiun KCIC Whoosh',    desc: 'Kereta cepat ke Jakarta, hanya 30 menit dari rumah.' },
    { id: 'publik',  num: '4', title: 'Dekat Fasilitas Publik',       desc: 'Sekolah, rumah sakit, pasar, dan minimarket dalam jangkauan.' },
    { id: 'invest',  num: '5', title: 'Potensi Nilai Bertumbuh',      desc: 'Berada di kawasan berkembang dengan prospek kenaikan nilai.' },
  ],

  locations: [
    { id: 'ikea', time: '15', place: 'IKEA',                  sub: 'Pusat kawasan & bisnis Bandung Barat.' },
    { id: 'tol',  time: '20', place: 'Tol Padalarang',        sub: 'Akses cepat ke seluruh Bandung Raya.' },
    { id: 'kcic', time: '25', place: 'Stasiun KCIC Whoosh',   sub: 'Kereta cepat menuju Jakarta.' },
  ],

  hero: {
    badge: 'Cluster Subsidi Pertama di Saguling',
    headlineLines: ['Hunian Modern,', 'Subsidi Harganya,', 'Komersil Rasanya'],
    sub: 'Nikmati kenyamanan tinggal di lingkungan sejuk dan asri, hunian nyaman dan lokasi strategis di jantung pertumbuhan Bandung Barat.',
    primaryTypeId: '22-60',
    chips: [
      { id: 'gate', label: 'One Gate System' },
      { id: 'kbp', label: '15 mnt ke KBP' },
      { id: 'tol', label: '20 mnt ke Tol' },
      { id: 'kcic', label: '30 mnt ke KCIC' },
    ],
  },

  defaultSpecs: [
    { label: 'Pondasi',  value: 'Batu Kali' },
    { label: 'Struktur', value: 'Beton Bertulang' },
    { label: 'Dinding',  value: 'Bata Interlock' },
    { label: 'Lantai',   value: 'Keramik' },
    { label: 'Atap',     value: 'Genteng Beton' },
    { label: 'Kusen',    value: 'Aluminium' },
    { label: 'Pintu',    value: 'Kayu Panel' },
    { label: 'Listrik',  value: '900 VA' },
    { label: 'Air',      value: 'PAM Desa / Sumur' },
  ],
  houseTypes: [
    { id: '22-60', name: 'Tipe 22/60', lb: '22', lt: '60', kt: '1', km: '1',
      tag: 'Paling Terjangkau', priceFrom: '160 Jt-an',
      gallery: ['/assets/images/2260-denah.png', '/assets/images/2260-3d-ilustrasi.jpg'],
      specsOverride: [] },
    { id: '26-72', name: 'Tipe 26/72', lb: '26', lt: '72', kt: '2', km: '1',
      tag: 'Favorit Keluarga', priceFrom: '—',
      gallery: ['/assets/images/2672-denah.jpeg', '/assets/images/2672-3d-ilustrasi.png'],
      specsOverride: [{ label: 'Listrik', value: '1300 VA' }] },
    { id: '31-72', name: 'Tipe 31/72', lb: '31', lt: '72', kt: '2', km: '1',
      tag: 'Paling Lega', priceFrom: '—',
      gallery: ['/assets/images/3672-denah.png', '/assets/images/3672-3d-ilustrasi.png'],
      specsOverride: [] },
  ],

  oneGate: [
    { id: 'akses',    title: 'Akses Masuk Terkontrol',   desc: 'Satu pintu gerbang dengan pengawasan terpusat.' },
    { id: 'aman',     title: 'Keamanan Lebih Baik',      desc: 'Lingkungan terjaga 24 jam, lebih tenang.' },
    { id: 'privasi',  title: 'Privasi Penghuni Terjaga', desc: 'Hanya warga & tamu terdaftar yang masuk.' },
    { id: 'keluarga', title: 'Nyaman untuk Keluarga',    desc: 'Lingkungan eksklusif, aman untuk anak.' },
  ],

  installment: {
    headline: 'Rumah Impian Tidak Harus Menunggu',
    intro: 'Cicilan flat sepanjang tenor, proses mudah, ringan, terukur, cocok untuk keluarga muda.',
    stat: '1 Jutaan',
    statSuffix: '/bulan',
    points: ['Proses mudah', 'DP ringan', 'Cicilan flat sepanjang tenor', 'Cocok keluarga muda'],
    disclaimer: '*S&K berlaku',
  },

  facilities: ['IKEA', 'XXI Cinema', 'Rumah Sakit', 'Parahyangan Golf', 'Destinasi Wisata'],

  invest: [
    { id: 'i1', title: 'Kawasan yang terus berkembang',     desc: 'Dekat pusat pertumbuhan ekonomi baru.' },
    { id: 'i2', title: 'Didukung infrastruktur berkembang', desc: 'Meningkatkan kenyamanan & nilai investasi.' },
    { id: 'i3', title: 'Terhubung akses utama',             desc: 'Mobilitas mudah ke berbagai pusat aktivitas.' },
    { id: 'i4', title: 'Potensi nilai properti meningkat',  desc: 'Nilai aset berpotensi terus naik.' },
  ],

  demand: [
    { id: 'd1', stat: '15 mnt', title: 'Magnet Kota Baru Parahyangan', desc: 'Pertumbuhan hunian & bisnis di KBP menaikkan minat kawasan.' },
    { id: 'd2', stat: 'Whoosh', title: 'Efek Kereta Cepat',            desc: 'Kehadiran KCIC mempercepat pertumbuhan nilai properti.' },
    { id: 'd3', stat: '1 Jt-an',title: 'Subsidi Rasa Komersil',        desc: 'Harga subsidi dengan kualitas komersil, incaran keluarga muda.' },
  ],

  faqs: [
    { id: 'f1', question: 'Siapa pengembangnya?',         answer: 'Sanggar Indah Group.' },
    { id: 'f2', question: 'Berapa harganya?',             answer: 'Mulai 160 Juta-an. Hubungi sales untuk jadwal survey & show unit.' },
    { id: 'f3', question: 'Bagaimana cara pembeliannya?', answer: 'Bisa KPR maupun cash keras.' },
    { id: 'f4', question: 'Jenis sertifikatnya apa?',     answer: 'SHGB, bisa ditingkatkan ke SHM.' },
    { id: 'f5', question: 'Bank apa yang bekerja sama?',  answer: 'BTN dan BCA.' },
    { id: 'f6', question: 'Kapan serah terima unit?',     answer: 'Setelah pembangunan selesai dan akad kredit.' },
  ],

  finalCta: {
    headline: 'Wujudkan Rumah Impian Anda Sekarang',
    chips: ['Cicilan Flat', 'One Gate System', 'Dekat KBP', 'Dekat KCIC'],
    phoneDisplay: 'WhatsApp Marketing · ' + formatPhoneNumber(meta.whatsapp.number),
  },

  footer: {
    address: ['Jl. Banyakniaga Kaler No. 27', 'Kota Baru Parahyangan'],
    email: 'sanggarindahgroup@gmail.com',
    instagram: '@sanggar_indah_parahyangan',
    phoneDisplay: 'WA: ' + formatPhoneNumber(meta.whatsapp.number),
  },
};
