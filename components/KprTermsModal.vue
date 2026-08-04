<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: '' }
});

const emit = defineEmits(['close']);

const dialogRef = ref(null);

function onKeydown(e) {
  if (e.key === 'Escape') emit('close');
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));

watch(() => props.isOpen, (open) => {
  if (open) {
    dialogRef.value?.focus();
  }
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      @click.self="emit('close')"
    >
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="scale-95 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-95 opacity-0"
      >
        <div
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
          class="relative w-full max-w-4xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl focus:outline-none min-h-[300px]"
        >
          <!-- Close Button -->
          <button
            type="button"
            aria-label="Tutup"
            class="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EBF2ED] text-emerald-900 transition-colors hover:bg-emerald-100"
            @click="emit('close')"
          >
            <svg class="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="pr-10 border-b border-gray-100 pb-4">
            <h3 class="font-display text-2xl md:text-3xl font-bold text-[#142B20]">
              {{ title }}
            </h3>
          </div>

          <!-- Body Content (Empty for now) -->
          <div class="mt-6">
            <!-- Konten syarat KPR biarkan kosong -->
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
