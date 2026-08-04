<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useContent } from '~/composables/useContent';

const props = defineProps({
  isOpen: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);

const { content, houseTypes } = useContent();

const dialogRef = ref(null);

const form = ref({
  name: '',
  phone: '',
  houseType: 'Belum tahu / masih survei',
  hasReferral: false,
  referralCode: ''
});

function onKeydown(e) {
  if (e.key === 'Escape') emit('close');
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));

function handleSubmit() {
  const project = content.meta.projectName;
  const number = content.meta.whatsapp.number;

  let msg = `Halo tim ${project}, saya ingin konsultasi.\n`;
  if (form.value.name) msg += `Nama: ${form.value.name}\n`;
  if (form.value.phone) msg += `No WA: ${form.value.phone}\n`;
  msg += `Tertarik Tipe: ${form.value.houseType}\n`;
  if (form.value.hasReferral && form.value.referralCode) {
    msg += `Kode Referral: ${form.value.referralCode}\n`;
  }

  const url = `https://wa.me/${number}?text=${encodeURIComponent(msg.trim())}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  emit('close');
}
</script>

<template>
  <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      @click.self="emit('close')">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="scale-95 opacity-0"
        enter-to-class="scale-100 opacity-100" leave-active-class="transition duration-150 ease-in"
        leave-from-class="scale-100 opacity-100" leave-to-class="scale-95 opacity-0">
        <div ref="dialogRef" role="dialog" aria-modal="true" tabindex="-1"
          class="relative w-full max-w-md rounded-3xl bg-white p-6 md:p-8 shadow-2xl focus:outline-none">
          <!-- Close Button -->
          <button type="button" aria-label="Tutup"
            class="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EBF2ED] text-emerald-900 transition-colors hover:bg-emerald-100"
            @click="emit('close')">
            <svg class="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="pr-8">
            <h3 class="font-display text-2xl font-bold text-[#142B20]">Form Member Get Member</h3>
            <p class="mt-2 text-sm text-gray-500 leading-relaxed">
              Isi data singkat, tim kami segera hubungi Anda via WhatsApp.
            </p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-1.5">Nama Lengkap</label>
              <input v-model="form.name" type="text" required placeholder="Nama Anda"
                class="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-1.5">Nomor WhatsApp</label>
              <input v-model="form.phone" type="tel" required placeholder="08xx xxxx xxxx"
                class="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-1.5">Tertarik Tipe Rumah</label>
              <div class="relative">
                <select v-model="form.houseType"
                  class="w-full appearance-none rounded-xl border border-gray-200 bg-[#FAF8F5] px-4 py-3 text-sm text-gray-800 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition pr-10">
                  <option value="Belum tahu / masih survei">Belum tahu / masih survei</option>
                  <option v-for="t in houseTypes" :key="t.id" :value="t.name">
                    {{ t.name }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Referral Checkbox -->
            <div class="pt-1">
              <label class="inline-flex items-center gap-2.5 cursor-pointer">
                <input v-model="form.hasReferral" type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-[#EE8322] focus:ring-orange accent-[#EE8322]" />
                <span class="text-sm font-medium text-gray-800">Saya punya kode referral</span>
              </label>
            </div>

            <!-- Referral Code Input (Conditional) -->
            <Transition enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1">
              <div v-if="form.hasReferral">
                <label class="block text-sm font-semibold text-gray-800 mb-1.5">Kode Referral</label>
                <input v-model="form.referralCode" type="text" placeholder="Masukkan kode referral"
                  class="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition" />
              </div>
            </Transition>

            <!-- Submit Button -->
            <button type="submit"
              class="w-full rounded-full bg-[#EE8322] px-6 py-3.5 text-base font-bold text-white shadow-md hover:bg-[#d9741a] transition-colors focus:outline-none focus:ring-2 focus:ring-orange/50 mt-4">
              Kirim & Lanjut ke WhatsApp
            </button>

            <!-- Disclaimer Footer -->
            <p class="text-center text-xs text-gray-400 pt-1">
              Data Anda hanya digunakan tim SIPAR untuk menghubungi kembali.
            </p>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
