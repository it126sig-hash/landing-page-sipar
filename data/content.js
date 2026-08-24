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
      simulasi: 'Halo, saya lihat informasi di website dan saya mau tanya simulasi cicilan flat {project}.',
      survey: 'Halo, saya lihat informasi di website dan saya ingin booking survey lokasi {project}.',
      type: 'Halo, saya lihat informasi di website dan saya tertarik dengan {type} di {project}. Boleh info lengkap & harga?',
      konsultasiForm: 'Halo, saya sudah mengisi form konsultasi di website {project} namun sistem sedang tidak tersedia. Saya ingin melanjutkan konsultasi via WhatsApp.',
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
  { id: 'ikea', time: '15', place: 'IKEA', sub: 'Pusat kawasan & bisnis Bandung Barat.' },
  { id: 'tol', time: '20', place: 'Tol Padalarang', sub: 'Akses cepat ke seluruh Bandung Raya.' },
  { id: 'kcic', time: '25', place: 'Stasiun KCIC Whoosh', sub: 'Kereta cepat menuju Jakarta.' },
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
    // Updated: now used by AboutSection.vue as single source of truth
    description: 'Kami adalah bagian dari Sanggar Indah Group yang telah berpengalaman di bidang properti sejak 1993. Dengan rekam jejak lebih dari tiga dekade dan berbagai penghargaan dari lembaga terkemuka, kami berkomitmen membantu keluarga Indonesia menemukan hunian yang layak dan terjangkau.',
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
    { label: 'Pondasi', value: 'Batu Kali' },
    { label: 'Struktur', value: 'Beton Bertulang' },
    { label: 'Dinding', value: 'Hebel' },
    { label: 'Lantai', value: 'Keramik' },
    { label: 'Atap', value: 'Genteng Beton' },
    { label: 'Kusen', value: 'Aluminium' },
    { label: 'Pintu', value: 'Pintu Baja' },
    { label: 'Listrik', value: '900/1300 VA' },
    { label: 'Air', value: 'PAM Desa / Sumur' },
  ],

  // Slot gallery[1] = foto fasad/tampak depan (dipakai modal "Lebih Detail" + lightbox).
  // Diganti 24 Agu 2026 dari render isometrik lama ('/assets/images/rumah/<TIPE>.webp')
  // ke foto fasad deretan rumah kiriman klien. File isometrik lama masih dipakai sebagai
  // thumbnail kartu di ProductsSection, jadi sengaja tidak dihapus.
  houseTypes: [
    {
      id: '22-60', name: 'Tipe 22/60', lb: '22', lt: '60', kt: '1', km: '1',
      tag: 'Subsidi', subtitle: 'Untuk pasutri baru', priceFrom: '160 Jt-an',
      thumbnail: '/assets/images/rumah/22 DAN 60.webp',
      gallery: ['/assets/images/rumah/galeri/2260-denah.webp', '/assets/images/rumah/galeri/2260-fasad.webp'],
      specsOverride: [{ label: 'Listrik', value: '900 VA' }]
    },
    {
      id: '26-72', name: 'Tipe 26/72', lb: '26', lt: '72', kt: '2', km: '1',
      tag: 'Komersil', subtitle: 'Untuk keluarga kecil', priceFrom: '200 Jt-an',
      thumbnail: '/assets/images/rumah/26 DAN 72.webp',
      gallery: ['/assets/images/rumah/galeri/2672-denah.webp', '/assets/images/rumah/galeri/2672-fasad.webp'],
      specsOverride: [{ label: 'Listrik', value: '1300 VA' }]
    },
    {
      id: '36-72', name: 'Tipe 36/72', lb: '36', lt: '72', kt: '2', km: '1',
      tag: 'Komersil', subtitle: 'Untuk keluarga yang sedang bertumbuh', priceFrom: '300 Jt-an',
      thumbnail: '/assets/images/rumah/36 DAN 72.webp',
      gallery: ['/assets/images/rumah/galeri/3672-denah.webp', '/assets/images/rumah/galeri/3672-fasad.webp'],
      specsOverride: [{ label: 'Listrik', value: '1300 VA' }]
    },
  ],

  oneGate: [
    { id: 'akses', title: 'Akses Masuk Terkontrol', desc: 'Satu pintu gerbang untuk lingkungan yang lebih aman dan tertata.' },
    { id: 'aman', title: 'Keamanan Setara Perumahan Komersial', desc: 'Fasilitas one gate system dengan harga tetap terjangkau.' },
    { id: 'privasi', title: 'Anak Lebih Leluasa Bermain di Luar', desc: 'Lingkungan eksklusif membuat keluarga lebih tenang dan nyaman.' },
    { id: 'keluarga', title: 'Nilai Investasi Lebih Terjaga', desc: 'Cluster bergerbang lebih diminati, harga jual tetap kompetitif.' },
  ],

  installment: {
    headline: 'Rumah Impian Tidak Harus Menunggu',
    intro: 'Cicilan flat sepanjang tenor, proses mudah, ringan, terukur, cocok untuk keluarga muda.',
    stat: '1 Jutaan',
    statSuffix: '/bulan',
    points: ['Proses mudah', 'DP ringan', 'Cicilan flat sepanjang tenor', 'Cocok keluarga muda'],
    disclaimer: '*S&K berlaku',
  },

  // Section aktif "Kenapa SIPAR": ReasonsCardsSection.vue menggunakan key ini.
  // Updated: tambah desc + microcopy untuk copy yang lebih humanis & persuasif.
  advantages: [
    {
      id: 'loc1',
      title: 'Dekat KBP',
      microcopy: 'Kawasan bisnis & hunian yang terus berkembang',
      desc: 'Berdampingan dengan kawasan Kota Baru Parahyangan — pusat gaya hidup, kuliner, dan properti yang terus tumbuh.',
      // ASSET KBP — gambar gerbang Kota Baru Parahyangan (kiriman klien 21 Agu 2026,
      // versi sudah remove-background / transparan).
      // Margin transparan dipangkas ke bounding box lingkaran lalu di-render ulang
      // jadi 512x512 webp beralpha (±55KB) supaya pas di slot gambar kartu yang kecil.
      // Nama file diberi sufiks -v2 supaya browser TIDAK memakai versi lama yang masih
      // ter-cache (versi pertama backgroundnya belum transparan sehingga tampak kotak abu-abu).
      // File lama '/assets/images/fasilitas/logo kbp.webp' sengaja tidak dihapus.
      // Untuk mengganti lagi: taruh file baru di public/assets/images/fasilitas/, ubah `image`
      // di bawah, dan set imageFit 'cover' (foto lanskap) atau 'contain' (logo/gambar persegi).
      image: '/assets/images/fasilitas/kbp-gerbang-v2.webp',
      imageFit: 'contain'
    },
    {
      id: 'loc2',
      title: 'Dekat Tol Padalarang',
      microcopy: 'Akses cepat ke seluruh Bandung Raya',
      desc: 'Mobilitas lebih mudah ke pusat kota dan berbagai daerah di sekitar Bandung Raya.',
      image: '/assets/images/fasilitas/logo tol.webp'
    },
    {
      id: 'loc3',
      title: 'Dekat WOOSH',
      microcopy: 'Stasiun KCIC, kereta cepat menuju Jakarta',
      desc: 'Kehadiran Stasiun KCIC Whoosh memberikan pilihan transportasi modern dan mendorong nilai properti kawasan.',
      image: '/assets/images/fasilitas/logo woosh.webp'
    },
    {
      id: 'loc4',
      title: '',
      microcopy: '',
      desc: '',
      image: '/assets/images/fasilitas/logo fasilitas.webp'
    },
  ],

  // Maskot "Kualitas Terjamin".
  // Copy pendukung sengaja emosional (mengajak melihat langsung), BUKAN klaim teknis
  // soal mutu bangunan — supaya label "Kualitas Terjamin" pada ilustrasi tetap
  // didukung tanpa menambah janji yang tidak ada datanya.
  // Ditampilkan mendampingi maskot di mobile; di desktop maskot tetap berdiri
  // sendiri di samping grid seperti sebelumnya.
  mascot: {
    image: '/assets/images/mascot.webp',
    alt: 'Maskot Sanggar Indah Parahyangan',
    title: 'Yakin dulu, baru pilih',
    text: 'Datang dan lihat langsung lokasinya. Tim kami siap menemani.',
  },

  // Copy section "Kenapa SIPAR" + peta (sebelumnya hardcoded di ReasonsCardsSection.vue)
  reasons: {
    headingImage: '/assets/images/kenapa.webp',
    headingAlt: 'Kenapa Sanggar Indah Parahyangan?',
    subheading: 'Yang dicari bukan sekadar rumah — melainkan tempat untuk memulai cerita bersama keluarga.',
    mapZoomHint: 'Klik untuk memperbesar',
    mapCtaLabel: 'Lihat Google Maps',
    mapAlt: 'Peta Lokasi Sanggar Indah Parahyangan',
    mapCloseLabel: 'Tutup peta',
  },

  // Copy section tipe rumah (sebelumnya hardcoded di ProductsSection.vue)
  products: {
    title: 'Pilih Rumah Impianmu',
    priceHeadline: 'Harga mulai dari 160jt-an s/d 300jt-an',
    detailCtaLabel: 'Lihat Detail',
  },

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

  // All 6 FAQ answers — humanis, no overclaim, based on product knowledge.
  // Answers use \n\n for paragraph breaks and \n for line breaks within a section.
  // Bullet items start with "• ".
  faqs: [
    {
      id: 'f1',
      question: 'Siapa pengembang Sanggar Indah Parahyangan?',
      answer: 'Sanggar Indah Parahyangan dikembangkan oleh Sanggar Indah Group dengan dedikasi selama lebih dari 30 tahun dalam menghadirkan hunian yang layak dan terjangkau.',
    },
    {
      id: 'f2',
      question: 'Penghargaan apa saja yang pernah diraih pengembang?',
      answer: 'Sanggar Indah Group telah meraih sejumlah penghargaan di bidang properti.', media: 'awards',
    },
    {
      id: 'f3',
      question: 'Proyek apa saja yang sudah dibangun oleh pengembang ini?',
      answer: 'Selama lebih dari 30 tahun, Sanggar Indah Group telah mendedikasikan pengalaman dan komitmennya dalam mengembangkan hunian bagi masyarakat. Berikut daftar proyek yang sudah dikembangkan:', media: 'projects',
    },
    {
      id: 'f6',
      question: 'Bagaimana skema cicilannya?',
      answer: 'Cicilan flat sepanjang tenor — nominalnya tidak berubah sampai lunas. Mulai 1 jutaan per bulan dengan DP ringan.\n\nSimulasi persisnya menyesuaikan tipe, tenor, dan bank. Tim kami bisa bantu hitungkan.',
    },
    {
      id: 'f7',
      question: 'Apakah bisa KPR meski belum punya slip gaji tetap?',
      answer: 'Bisa. Pekerja non-fixed income tetap dapat mengajukan KPR, dengan dokumen pendukung penghasilan sebagai pengganti slip gaji.\n\nSyarat lengkapnya ada di menu Syarat KPR BCA / BTN pada tombol WhatsApp mengambang.',
    },
    {
      id: 'f8',
      question: 'Apakah ada show unit/rumah contoh yang bisa dikunjungi?',
      answer: 'Ada. Anda bisa melihat langsung lokasi dan unit contoh di lapangan.\n\nHubungi tim kami lewat WhatsApp untuk mengatur jadwal kunjungan.',
    },
  ],

  // Copy section FAQ (sebelumnya hardcoded di FaqSection.vue)

  // Daftar proyek Sanggar Indah Group.
  // Sumber: jawaban FAQ f3 versi lama (lokasi & tipe) + timeline resmi kiriman klien
  // (public/assets/images/proyek-timeline.webp) untuk tahunnya.
  // TIDAK ada data karangan: proyek yang hanya ada di timeline tanpa detail lokasi/tipe
  // sengaja menampilkan nama + tahun saja.
  projects: {
    timelineImage: '/assets/images/proyek-timeline.webp',
    timelineAlt: 'Timeline proyek Sanggar Indah Group 1996-2025',
    timelineCaption: 'Perjalanan proyek Sanggar Indah Group sejak 1996 — ketuk untuk memperbesar',
    items: [
      { id: 'p2025b', year: '2025', name: 'Grand Lituhayu' },
      { id: 'p2025a', year: '2025', name: 'Sanggar Indah Parahyangan', location: 'Kota Baru Parahyangan', types: 'Tipe 22/60 (Subsidi), 26/72 & 36/72 (Non Subsidi)', current: true },
      { id: 'p2020', year: '2020', name: 'Alam Sanggar Indah Extension', location: 'Citapen, Cihampelas, Kab. Bandung Barat', types: 'Tipe 22/72 (Subsidi), 31/72 & 36/72 (Non Subsidi)' },
      { id: 'p2019', year: '2019', name: 'Sanggar Indah Palastri', location: 'Arjasari, Kab. Bandung', types: 'Tipe 22/60, 22/72 (Subsidi), 31/72 (Non Subsidi)' },
      { id: 'p2018', year: '2018', name: 'Bumi Karya Indah Extension', location: 'Cimalaka, Sumedang' },
      { id: 'p2014', year: '2014', name: 'Platinum Residence' },
      { id: 'p2013', year: '2013', name: 'Alam Sanggar Indah', location: 'Citapen, Cihampelas, Kab. Bandung Barat', types: 'Tipe 31/75 (Non Subsidi)' },
      { id: 'p2010', year: '2010', name: 'Sanggar Indah Lestari' },
      { id: 'p2009', year: '2009', name: "D'Lapan Residence" },
      { id: 'p2006', year: '2006', name: 'Sanggar Mas Lestari' },
      { id: 'p2003', year: '2003', name: 'Damar Mas Regency' },
      { id: 'p2000', year: '2000', name: 'Bumi Karya Indah', location: 'Cimalaka, Sumedang', types: 'Tipe 25/72 (Subsidi), 31/72 (Non Subsidi)' },
      { id: 'p1996', year: '1996', name: 'Sanggar Indah Banjaran' },
    ],
    note: 'Ketersediaan unit terkini bisa ditanyakan langsung ke tim kami.',
  },

  // Label UI carousel di dalam FAQ
  carousel: {
    prev: 'Sebelumnya',
    next: 'Berikutnya',
    awardsLabel: 'Penghargaan Sanggar Indah Group',
    projectsLabel: 'Proyek Sanggar Indah Group',
  },

  faqSection: {
    title: 'FAQ',
    subtitle: 'Pertanyaan yang Sering Ditanyakan',
    ctaIntro: 'Belum menemukan jawaban yang Anda cari? Tidak apa-apa — kami siap membantu.',
    ctaLabel: 'Tanya Tim Kami',
  },

  finalCta: {
    headline: 'Wujudkan Rumah Impian Anda Sekarang',
    ctaLabel: 'Konsultasi & Survey Lokasi Sekarang →',
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
      { id: 'tipe', label: 'Tipe Rumah' },
      { id: 'lokasi', label: 'Lokasi' },
    ],
    email: 'sanggarindahgroup@gmail.com',
    instagram: '@sanggar_indah_parahyangan',
    phoneDisplay: formatPhoneNumber(meta.whatsapp.number),
  },

  // ============================================================
  // NEW: Persyaratan KPR
  // Satu dataset digunakan untuk MODAL KPR BTN maupun BCA.
  // Persyaratan berdasarkan product knowledge — tidak dikarang.
  // ============================================================
  kprRequirements: {
    disclaimer: 'Persyaratan yang ditampilkan merupakan dokumen umum KPR yang perlu disiapkan. Persyaratan akhir mengikuti kebijakan dan hasil analisa bank terkait.',
    consultationCta: 'Masih ragu apakah Anda memenuhi syarat?',
    consultationCtaLabel: 'Diskusikan Kondisi Anda',
    karyawan: {
      title: 'Karyawan',
      docs: [
        'Hasil SLIK OJK (suami dan istri)',
        'Foto 3×4 (suami dan istri)',
        'KTP suami dan istri',
        'Kartu Keluarga',
        'NPWP',
        'Buku Nikah',
        'Slip Gaji 3 bulan terakhir',
        'Rekening Koran Payroll 3 bulan terakhir',
        'Surat Keterangan Aktif Bekerja terbaru',
        'Surat Pengangkatan Pegawai Tetap',
        'SPT Tahunan',
        'Peta lokasi tempat bekerja (digambar, bukan foto Google Maps)',
        'Foto tempat bekerja dan aktivitas tempat bekerja',
      ],
      notes: [
        'Pegawai tetap: minimal masa kerja 1 tahun',
        'Pegawai kontrak: minimal masa kerja 2 tahun',
      ],
    },
    jointIncome: {
      title: 'Joint Income',
      intro: 'Dokumen tambahan yang diperlukan jika penghasilan dihitung bersama pasangan:',
      docs: [
        'Slip Gaji pasangan 3 bulan terakhir',
        'Rekening Koran Payroll pasangan 3 bulan terakhir',
        'Surat Keterangan Aktif Bekerja terbaru',
        'Surat Pengangkatan Pegawai Tetap',
      ],
      notes: [
        'Pegawai tetap: minimal masa kerja 1 tahun',
        'Pegawai kontrak: minimal masa kerja 2 tahun',
      ],
    },
    subsidi: {
      title: 'Unit Subsidi',
      intro: 'Batas penghasilan untuk pengajuan KPR unit subsidi:',
      limits: [
        { label: 'Single income / belum menikah', max: 'Maks. Rp8.500.000/bulan' },
        { label: 'Joint income (sudah menikah)', max: 'Maks. Rp10.000.000/bulan' },
      ],
      note: 'Batas penghasilan berlaku untuk pengajuan KPR unit subsidi. Untuk unit non-subsidi, silakan konsultasikan langsung.',
    },
  },

  // ============================================================
  // NEW: Consultation Form
  // Labels, microcopy, categories, validation messages.
  // Digunakan oleh ConsultationModal.vue.
  // ============================================================
  consultationForm: {
    title: 'Konsultasi dengan Tim Kami',
    microcopy: 'Silakan isi data singkat di bawah ini. Tim kami akan membantu memberikan informasi yang sesuai kebutuhan Anda.',
    categories: [
      'Ingin tahu harga & cicilan',
      'Ingin tahu pilihan tipe rumah',
      'Ingin cek syarat KPR',
      'Ingin survey lokasi',
      'Konsultasi rumah subsidi',
      'Konsultasi rumah non subsidi',
      'Lainnya',
    ],
    labels: {
      name: 'Nama Lengkap',
      phone: 'Nomor WhatsApp',
      need: 'Kebutuhan saya saat ini',
      message: 'Pesan tambahan (opsional)',
    },
    placeholders: {
      name: 'Contoh: Budi Santoso',
      phone: 'Contoh: 0812xxxxxxxx',
      need: 'Pilih kebutuhan Anda',
      message: 'Ceritakan kondisi atau pertanyaan Anda...',
    },
    validation: {
      nameRequired: 'Nama wajib diisi.',
      nameMin: 'Nama terlalu singkat. Mohon masukkan nama lengkap Anda.',
      phoneRequired: 'Nomor WhatsApp wajib diisi.',
      phoneInvalid: 'Nomor WhatsApp belum sesuai. Coba masukkan nomor aktif, misalnya 0812xxxxxxxx.',
      needRequired: 'Silakan pilih kebutuhan Anda terlebih dahulu.',
    },
    messages: {
      submitting: 'Sedang mengirim...',
      success: 'Terima kasih! Data Anda sudah kami terima. Tim kami akan segera menghubungi Anda.',
      error: 'Data belum berhasil dikirim. Silakan coba lagi atau hubungi kami langsung melalui WhatsApp.',
      // Shown when NUXT_PUBLIC_SHEET_ENDPOINT belum dikonfigurasi
      notConfigured: 'Form konsultasi belum dapat mengirim data secara online. Silakan hubungi kami melalui WhatsApp.',
      captchaRequired: 'Mohon selesaikan verifikasi keamanan terlebih dahulu.',
      // Shown when NUXT_PUBLIC_CAPTCHA_SITE_KEY belum dikonfigurasi
      captchaNotConfigured: 'Sistem verifikasi keamanan belum tersedia. Silakan hubungi kami melalui WhatsApp.',
      // Ditampilkan kalau widget reCAPTCHA tampil tapi tidak bisa diklik/diselesaikan.
      // Penyebab paling umum: domain yang sedang dibuka belum didaftarkan di
      // Google reCAPTCHA Admin Console, atau script Google diblokir ad-blocker.
      captchaStuck: 'Verifikasi tidak merespons. Ini biasanya terjadi bila domain belum didaftarkan di Google reCAPTCHA atau script Google diblokir. Anda tetap bisa mengirim pesan lewat WhatsApp.',
      // Dipakai composable saat reCAPTCHA melapor error / kadaluarsa / gagal render.
      captchaFailed: 'Verifikasi keamanan tidak dapat dijalankan di halaman ini. Coba muat ulang verifikasi, atau kirim pesan Anda lewat WhatsApp.',
      captchaExpired: 'Waktu verifikasi habis. Silakan centang ulang kotak verifikasi.',
      captchaRenderFailed: 'Verifikasi keamanan gagal ditampilkan. Coba muat ulang verifikasi, atau kirim pesan Anda lewat WhatsApp.',
    },
    captcha: {
      fallbackIntro: 'Verifikasi bermasalah?',
      fallbackCta: 'Kirim lewat WhatsApp',
      retry: 'Muat Ulang Verifikasi',
    },
    notConfiguredTitle: 'Belum Bisa Kirim Online',
    successCtaWa: 'Chat WhatsApp',
    successCtaClose: 'Tutup',
    errorCtaRetry: 'Coba Lagi',
    errorCtaWa: 'Hubungi via WhatsApp',
    submitLabel: 'Kirim Pesan',
    disclaimer: 'Data Anda hanya digunakan tim kami untuk keperluan konsultasi.',
  },

  // ============================================================
  // Member Get Member
  // ============================================================
  memberGetMember: {
    title: 'Form Member Get Member',
    subtitle: 'Isi data singkat, tim kami segera hubungi Anda via WhatsApp.',
    labels: {
      name: 'Nama Lengkap',
      phone: 'Nomor WhatsApp',
      houseType: 'Tertarik Tipe Rumah',
    },
    placeholders: {
      name: 'Nama Anda',
      phone: '08xx xxxx xxxx',
    },
    houseTypeDefault: 'Belum tahu / masih survei',
    referral: {
      checkboxLabel: 'Saya punya kode referral',
      label: 'Kode Referral',
      placeholder: 'Masukkan kode referral',
      requiredMessage: 'Silakan masukkan kode referral Anda.',
    },
    validation: {
      nameRequired: 'Silakan masukkan nama Anda.',
      nameMin: 'Nama minimal 2 huruf.',
      phoneRequired: 'Silakan masukkan nomor WhatsApp.',
      phoneInvalid: 'Format nomor WhatsApp tidak valid. Gunakan format 08xx atau 628xx.',
    },
    submitLabel: 'Kirim Sekarang',
    disclaimer: 'Data Anda hanya digunakan tim SIPAR untuk menghubungi kembali.',
    waTemplate: 'Halo tim {project}, saya tertarik program Member Get Member.',
  },
};