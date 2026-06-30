<script setup>
import { useLightbox } from '~/composables/useLightbox';

defineProps({
  type: { type: Object, required: true },
});
const emit = defineEmits(['select']);
const { openLightbox } = useLightbox();
</script>

<template>
  <div class="overflow-hidden rounded-[20px] border-2 border-cream-light bg-white shadow-[0_12px_30px_-24px_rgba(28,74,42,0.5)] transition-transform duration-200 hover:-translate-y-1">
    <div class="group relative overflow-hidden">
      <img :src="type.gallery[1]" :alt="type.name" class="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
        @click="openLightbox(type.gallery[1], type.name)" />
      <span class="absolute left-3 top-3 rounded-lg bg-orange px-[11px] py-[5px] font-jakarta text-xs font-bold text-white">
        {{ type.tag }}
      </span>
    </div>
    <div class="p-5">
      <h3 class="font-sora text-lg font-bold text-forest-deep">{{ type.name }}</h3>

      <div class="mt-3 grid grid-cols-2 gap-[10px]">
        <div class="rounded-[10px] border border-cream-light bg-off-white px-3 py-[9px]">
          <p class="font-jakarta text-xs text-charcoal-gray">Luas Bangunan</p>
          <p class="font-jakarta text-sm font-bold text-forest-deep">{{ type.lb }} m²</p>
        </div>
        <div class="rounded-[10px] border border-cream-light bg-off-white px-3 py-[9px]">
          <p class="font-jakarta text-xs text-charcoal-gray">Luas Tanah</p>
          <p class="font-jakarta text-sm font-bold text-forest-deep">{{ type.lt }} m²</p>
        </div>
        <div class="rounded-[10px] border border-cream-light bg-off-white px-3 py-[9px]">
          <p class="font-jakarta text-xs text-charcoal-gray">Kamar Tidur</p>
          <p class="font-jakarta text-sm font-bold text-forest-deep">{{ type.kt }} KT</p>
        </div>
        <div class="rounded-[10px] border border-cream-light bg-off-white px-3 py-[9px]">
          <p class="font-jakarta text-xs text-charcoal-gray">Kamar Mandi</p>
          <p class="font-jakarta text-sm font-bold text-forest-deep">{{ type.km }} KM</p>
        </div>
      </div>

      <p class="mt-3 font-sora text-xl font-extrabold text-orange">{{ type.priceFrom }}</p>
      <button
        type="button"
        class="mt-4 w-full rounded-btn bg-orange py-[13px] font-jakarta text-sm font-bold text-white transition-colors hover:bg-[#D66F1A] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-forest-deep/10"
        @click="emit('select', type.id)"
      >
        Lihat Detail
      </button>
    </div>
  </div>
</template>
