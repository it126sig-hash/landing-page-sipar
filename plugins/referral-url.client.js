import { useReferralFromUrl } from '~/composables/useReferralFromUrl';

/**
 * Menembak verifikasi kode referral dari URL sedini mungkin (?kode=VR0418),
 * jadi saat user membuka form Member Get Member hasilnya sudah siap dan
 * kolomnya langsung terisi.
 *
 * Client-only: situs ini statis, query string baru ada setelah hidrasi.
 */
export default defineNuxtPlugin(() => {
  useReferralFromUrl().capture();
});
