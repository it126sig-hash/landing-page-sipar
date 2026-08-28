<script setup>
import { computed } from 'vue';
import { useContent } from '~/composables/useContent';
import { useLightbox } from '~/composables/useLightbox';

const props = defineProps({
  faq: { type: Object, required: true },
  open: { type: Boolean, default: false },
});
const emit = defineEmits(['toggle']);

const { content, withBase } = useContent();
const { openLightbox, openGallery } = useLightbox();

// Media FAQ diambil dari data yang SUDAH ADA di content.js — tidak ada asset baru.
const awardItems = computed(() => content.about.awards.map(a => ({
  key: a.id, image: a.image, meta: a.year, title: a.title,
})));

/**
 * Buka viewer penghargaan pada kartu yang diklik.
 *
 * Memakai openGallery (bukan openLightbox satu gambar) supaya ketujuh
 * penghargaan bisa digeser bolak-balik dari dalam viewer — pola yang sama
 * dengan galeri tipe rumah. Judulnya diberi tahun di depan agar keterangan
 * di viewer tetap menjelaskan penghargaan apa yang sedang dilihat.
 */
function openAt(item) {
  const items = awardItems.value.map(a => ({ src: a.image, alt: `${a.meta} — ${a.title}` }));
  openGallery(items, awardItems.value.findIndex(a => a.key === item.key));
}
const projectItems = computed(() => content.projects.items.map(p => ({
  key: p.id, meta: p.year, title: p.name, sub: p.location, types: p.types, current: p.current,
})));

/**
 * Parse answer string menjadi array paragraf.
 * - Split pada \n\n → paragraf
 * - Baris yang dimulai dengan "• " → list item
 * - \n di dalam paragraf → <br>
 */
const parsedParagraphs = computed(() => {
  if (!props.faq.answer) return [];
  return props.faq.answer
    .split('\n\n')
    .filter(p => p.trim())
    .map(para => {
      const lines = para.split('\n');
      const isList = lines.some(l => l.startsWith('• '));
      if (isList) {
        return { type: 'list', items: lines.filter(l => l.trim()).map(l => l.replace(/^• /, '')) };
      }
      return { type: 'text', html: para.replace(/\n/g, '<br>') };
    });
});
</script>

<template>
  <div class="overflow-hidden rounded-[14px] border border-cream-light bg-white">
    <button
      type="button"
      :id="`faq-btn-${faq.id}`"
      :aria-expanded="open"
      :aria-controls="`faq-answer-${faq.id}`"
      class="flex w-full items-center justify-between px-5 py-[18px] text-left font-body text-sm leading-snug font-semibold text-forest-deep transition-colors hover:text-orange focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-forest-deep/10"
      @click="emit('toggle', faq.id)"
    >
      <span>{{ faq.question }}</span>
      <span
        class="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mint-pale text-lg font-bold text-forest-deep transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        aria-hidden="true"
      >
        {{ open ? '−' : '+' }}
      </span>
    </button>

    <div
      v-if="open"
      :id="`faq-answer-${faq.id}`"
      role="region"
      :aria-labelledby="`faq-btn-${faq.id}`"
      class="px-5 pb-5 space-y-3"
    >
      <template v-for="(para, idx) in parsedParagraphs" :key="idx">
        <!-- List paragraph -->
        <ul v-if="para.type === 'list'" class="space-y-1.5">
          <li
            v-for="(item, li) in para.items"
            :key="li"
            class="flex items-start gap-2 font-body text-sm leading-relaxed text-charcoal-gray"
          >
            <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a84c]"></span>
            <span>{{ item }}</span>
          </li>
        </ul>
        <!-- Text paragraph.
             Rata kanan-kiri sesuai permintaan. Kolom jawaban di HP cuma ±301px
             (±32 karakter), jauh di bawah ±60 karakter yang ideal untuk justify,
             jadi ada baris yang harus meregang sampai ±25%. text-pretty +
             hyphens-auto menahan efek itu: penyeimbang baris membagi teks lebih
             rata sehingga tidak ada satu baris yang terlalu kosong. -->
        <p
          v-else
          class="font-body text-sm leading-relaxed text-charcoal-gray text-justify text-pretty hyphens-auto"
          v-html="para.html"
        />
      </template>

      <!-- ── Media FAQ: GRID penghargaan (no carousel) ── -->
      <template v-if="faq.media === 'awards'">
        <div class="mt-3 grid grid-cols-2 min-[375px]:grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3" role="group" :aria-label="content.carousel.awardsLabel">
          <button
            v-for="item in awardItems"
            :key="item.key"
            type="button"
            class="rounded-[14px] border border-cream-light bg-white p-3 text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep/30"
            :aria-label="`Perbesar penghargaan ${item.title}`"
            @click="openAt(item)"
          >
            <span class="block h-[92px] sm:h-[110px] w-full overflow-hidden rounded-lg bg-gray-50">
              <img :src="item.image" :alt="item.title" loading="lazy"
                class="h-full w-full object-contain p-1" />
            </span>
            <span class="mt-2 block font-body text-xs font-bold text-[#c9a84c]">{{ item.meta }}</span>
            <span class="mt-0.5 block font-body text-[11px] leading-snug text-charcoal-gray">{{ item.title }}</span>
          </button>
        </div>
      </template>

      <!-- ── Media FAQ: foto timeline proyek (tanpa kartu grid) ── -->
      <template v-if="faq.media === 'projects'">
        <button
          type="button"
          class="mt-3 block w-full overflow-hidden rounded-[14px] border border-cream-light bg-white p-2 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep/30"
          :aria-label="content.projects.timelineCaption"
          @click="openLightbox(withBase(content.projects.timelineImage), content.projects.timelineAlt)"
        >
          <img :src="withBase(content.projects.timelineImage)" :alt="content.projects.timelineAlt"
            loading="lazy" class="w-full rounded-lg object-contain" />
          <span class="mt-1.5 block text-center font-body text-[11px] text-stone-gray">
            {{ content.projects.timelineCaption }}
          </span>
        </button>
        <p class="font-body text-xs italic leading-relaxed text-stone-gray text-justify text-pretty hyphens-auto">{{ content.projects.note }}</p>
      </template>
    </div>
  </div>
</template>
