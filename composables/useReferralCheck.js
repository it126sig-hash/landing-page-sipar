import { ref, computed } from 'vue';
import { useContent } from '~/composables/useContent';

/**
 * Verifikator kode referral Member Get Member.
 *
 * Alurnya sengaja dibuat "wajib klik Cek": kode yang sekadar diketik TIDAK
 * pernah dianggap sah. Status hanya menjadi 'valid' setelah SIG App
 * mengonfirmasi, dan langsung jatuh lagi ke 'idle' begitu isian kolomnya
 * berubah (lihat markAsStale) — sehingga kode yang benar tapi belum dicek pun
 * tetap ditahan di tombol Kirim.
 *
 * Kontrak endpoint (POST, form-encoded, parameter `kode`):
 *   valid   → { success: true, data: { kode_referal, nama_konsumen,
 *                                      nama_proyek, kavling_dimiliki } }
 *   invalid → { success: false, message: '...' }   (HTTP 404)
 */
export function useReferralCheck() {
  const { content } = useContent();
  const config = useRuntimeConfig();
  const copy = content.memberGetMember.referral;

  // idle | checking | valid | invalid | error
  const status = ref('idle');
  const data = ref(null);
  const message = ref('');

  // Kode (ternormalisasi) yang benar-benar sudah lolos verifikasi. Dipakai
  // sebagai pembanding supaya status 'valid' tidak ikut terbawa ke kode lain.
  const verifiedCode = ref('');

  // Nomor urut request. Naik setiap kali kita menembak server ATAU membatalkan
  // hasil yang sudah tidak relevan; respons yang nomornya bukan yang terakhir
  // dibuang begitu saja.
  //
  // Tanpa ini ada lubang nyata: user menekan "Cek", lalu masih sempat mengetik
  // sebelum jawabannya datang. Jawaban untuk kode LAMA kemudian mendarat dan
  // menempelkan status "valid" pada kode BARU yang belum pernah diperiksa —
  // kolom menampilkan satu kode, centang hijaunya milik kode yang lain.
  let requestSeq = 0;

  const endpoint = computed(() => config.public.referralCheckEndpoint || '');

  const isChecking = computed(() => status.value === 'checking');
  const isValid = computed(() => status.value === 'valid');

  /** Server memperlakukan kode case-insensitive, jadi perbandingan lokal ikut. */
  function normalizeCode(code) {
    return (code || '').trim().toUpperCase();
  }

  /**
   * Dipanggil setiap kali isi kolom berubah. Selama kodenya masih sama persis
   * dengan yang sudah terverifikasi, status 'valid' dipertahankan supaya user
   * tidak dipaksa mengecek ulang hanya karena menghapus lalu mengetik lagi
   * karakter yang sama.
   */
  function markAsStale(currentCode) {
    if (status.value === 'valid' && normalizeCode(currentCode) === verifiedCode.value) return;
    if (status.value === 'idle' && !message.value) return;
    // Kolomnya sudah berubah: apa pun yang masih terbang tidak lagi relevan.
    requestSeq++;
    status.value = 'idle';
    data.value = null;
    message.value = '';
  }

  async function check(rawCode) {
    const kode = normalizeCode(rawCode);

    if (!kode) {
      status.value = 'invalid';
      data.value = null;
      message.value = copy.requiredMessage;
      return false;
    }

    // Sudah pernah lolos untuk kode yang sama — tidak perlu menembak server lagi.
    if (status.value === 'valid' && kode === verifiedCode.value) return true;

    if (!endpoint.value) {
      status.value = 'error';
      message.value = copy.networkErrorMessage;
      return false;
    }

    status.value = 'checking';
    message.value = '';
    data.value = null;

    const seq = ++requestSeq;

    try {
      // Sengaja form-encoded, bukan JSON: 'application/x-www-form-urlencoded'
      // termasuk simple request sehingga browser tidak perlu preflight OPTIONS
      // lebih dulu — satu round-trip lebih cepat di jaringan seluler.
      const res = await fetch(endpoint.value, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ kode }).toString(),
      });

      // Kode tidak terdaftar dibalas HTTP 404 dengan body JSON, jadi res.ok
      // TIDAK bisa dipakai sebagai penentu; yang dibaca adalah field `success`.
      const result = await res.json().catch(() => null);

      // Kolom sudah berubah (atau ada Cek yang lebih baru) selagi request ini
      // terbang — hasilnya dibuang supaya tidak menimpa keadaan sekarang.
      if (seq !== requestSeq) return false;

      if (result && result.success && result.data) {
        status.value = 'valid';
        data.value = result.data;
        verifiedCode.value = normalizeCode(result.data.kode_referal) || kode;
        message.value = '';
        return true;
      }

      if (result && result.success === false) {
        status.value = 'invalid';
        data.value = null;
        message.value = copy.invalidMessage;
        return false;
      }

      // Bentuk respons di luar dugaan (mis. halaman error HTML dari proxy).
      status.value = 'error';
      message.value = copy.networkErrorMessage;
      return false;
    } catch (err) {
      if (seq !== requestSeq) return false;
      console.error('[useReferralCheck] check error:', err);
      status.value = 'error';
      data.value = null;
      message.value = copy.networkErrorMessage;
      return false;
    }
  }

  /**
   * Menandai satu kode sebagai SUDAH terverifikasi tanpa menembak server lagi.
   * Dipakai prefill dari URL (?kode=...): pengecekannya sudah dilakukan sekali
   * saat halaman dibuka, jadi user tidak perlu menekan "Cek" untuk kode yang
   * sama. Hanya menerima payload utuh dari server — bukan kode mentah — supaya
   * status 'valid' mustahil dibuat dari tebakan sisi klien.
   */
  function seedVerified(payload) {
    if (!payload || !payload.kode_referal) return;
    status.value = 'valid';
    data.value = payload;
    verifiedCode.value = normalizeCode(payload.kode_referal);
    message.value = '';
  }

  function reset() {
    requestSeq++;
    status.value = 'idle';
    data.value = null;
    message.value = '';
    verifiedCode.value = '';
  }

  return {
    status,
    data,
    message,
    verifiedCode,
    isChecking,
    isValid,
    endpoint,
    normalizeCode,
    markAsStale,
    check,
    seedVerified,
    reset,
  };
}
