import { ref, computed } from 'vue';
import { useReferralCheck } from '~/composables/useReferralCheck';

/**
 * Menangkap kode referral dari query URL, mis.
 *   https://sanggarindahparahyangan.com?kode=VR0418
 * lalu memverifikasinya sekali ke SIG App supaya form Member Get Member bisa
 * langsung terisi tanpa user menekan "Cek".
 *
 * State-nya sengaja di level MODUL, bukan di dalam fungsi composable: hasil
 * tangkapan harus bertahan selama satu kunjungan penuh. Modal MGM memanggil
 * resetForm() setiap kali dibuka, jadi kalau state ini ikut hidup-mati bersama
 * modal, kode dari URL akan hilang begitu modal ditutup lalu dibuka lagi.
 *
 * Situs ini di-generate statis (GitHub Pages), jadi query string TIDAK pernah
 * terlihat saat prerender — penangkapannya wajib di sisi klien.
 */
const urlCode = ref('');
const urlData = ref(null);
const urlStatus = ref('idle'); // idle | checking | valid | invalid | error

// Penjaga agar verifikasi hanya jalan sekali per kunjungan, berapa kali pun
// composable ini dipanggil komponen yang berbeda.
let capturePromise = null;

/** Nama query yang diterima. Yang resmi `kode`; `ref` disediakan sebagai alias
 *  karena link referral sering ditulis begitu di luar sana. */
const QUERY_KEYS = ['kode', 'ref'];

export function useReferralFromUrl() {
  const isUrlReferralValid = computed(() => urlStatus.value === 'valid' && !!urlData.value);

  function readCodeFromUrl() {
    if (typeof window === 'undefined') return '';
    let params;
    try {
      params = new URL(window.location.href).searchParams;
    } catch {
      return '';
    }
    for (const key of QUERY_KEYS) {
      const val = (params.get(key) || '').trim();
      if (val) return val;
    }
    return '';
  }

  /**
   * Baca + verifikasi kode dari URL. Aman dipanggil berkali-kali; panggilan
   * kedua dan seterusnya mengembalikan promise yang sama.
   */
  function capture() {
    if (capturePromise) return capturePromise;

    const code = readCodeFromUrl();
    if (!code) {
      urlStatus.value = 'idle';
      capturePromise = Promise.resolve(false);
      return capturePromise;
    }

    urlCode.value = code;
    urlStatus.value = 'checking';

    const checker = useReferralCheck();
    capturePromise = checker
      .check(code)
      .then((ok) => {
        // Hanya kode yang benar-benar dikonfirmasi server yang boleh mengisi
        // form. Kode ngawur di URL diperlakukan seperti tidak ada sama sekali —
        // user tetap melihat form kosong yang normal, bukan kolom merah yang
        // membingungkan padahal bukan dia yang mengetiknya.
        if (ok) {
          urlData.value = checker.data.value;
          urlStatus.value = 'valid';
          return true;
        }
        urlData.value = null;
        urlStatus.value = checker.status.value === 'invalid' ? 'invalid' : 'error';
        return false;
      })
      .catch(() => {
        urlData.value = null;
        urlStatus.value = 'error';
        return false;
      });

    return capturePromise;
  }

  return {
    urlCode,
    urlData,
    urlStatus,
    isUrlReferralValid,
    capture,
  };
}
