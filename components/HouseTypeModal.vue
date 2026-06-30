<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useLightbox } from '~/composables/useLightbox';

const props = defineProps({
  type: { type: Object, default: null },
});
const emit = defineEmits(['close']);

const dialogRef = ref(null);
const { openLightbox } = useLightbox();

function onKeydown(e) {
  if (e.key === 'Escape') emit('close');
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));

watch(() => props.type, (t) => {
  if (t) dialogRef.value?.focus();
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
      v-if="type"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-charcoal/50 p-4 py-10"
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
          :aria-label="type.name"
          tabindex="-1"
          class="relative w-full max-w-3xl rounded-2xl bg-off-white p-6 shadow-[0_24px_60px_rgba(28,74,42,0.3)] focus:outline-none sm:p-9"
        >
          <button
            type="button"
            aria-label="Tutup"
            class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-cream-light bg-white text-xl text-forest-deep transition-colors hover:text-orange focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-forest-deep/10"
            @click="emit('close')"
          >
            ✕
          </button>

          <div class="flex flex-wrap items-start justify-between gap-3 pr-12">
            <div>
              <p class="font-jakarta text-xs font-bold uppercase tracking-wide text-orange">Detail Unit</p>
              <h3 class="mt-1 font-sora text-2xl font-extrabold text-forest-deep sm:text-3xl">{{ type.name }}</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <Badge :label="`LB ${type.lb} m²`" />
              <Badge :label="`LT ${type.lt} m²`" />
              <Badge :label="`${type.kt} KT`" />
              <Badge :label="`${type.km} KM`" />
            </div>
          </div>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <img :src="type.gallery[1]" :alt="`Fasad ${type.name}`" class="aspect-[4/3] w-full cursor-pointer rounded-xl object-cover"
              @click="openLightbox(type.gallery[1], `Fasad ${type.name}`)" />
            <img :src="type.gallery[0]" :alt="`Denah ${type.name}`" class="aspect-[4/3] w-full cursor-pointer rounded-xl object-cover"
              @click="openLightbox(type.gallery[0], `Denah ${type.name}`)" />
          </div>

          <div class="mt-6">
            <h4 class="font-sora text-base font-bold text-forest-deep">Spesifikasi Teknis</h4>
            <div class="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <div v-for="spec in type.specs" :key="spec.label" class="rounded-[10px] border border-cream-light bg-white px-3 py-[9px]">
                <p class="font-jakarta text-xs uppercase tracking-wide text-charcoal-gray">{{ spec.label }}</p>
                <p class="font-jakarta text-sm font-bold text-forest-deep">{{ spec.value }}</p>
              </div>
            </div>
          </div>

          <WhatsAppButton message-key="type" :vars="{ type: type.name }" variant="primary" class="mt-6 w-full sm:w-auto">
            Tanya Unit {{ type.name }} →
          </WhatsAppButton>
          <p class="mt-4 font-jakarta text-xs text-charcoal-gray">
            *Konsumen tidak dapat merubah/merenovasi bangunan sebelum proses serah terima unit.
          </p>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
