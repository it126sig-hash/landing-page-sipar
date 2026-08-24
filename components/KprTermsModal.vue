<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useContent } from '~/composables/useContent';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: '' },
});

const emit = defineEmits(['close']);

const { content, wa } = useContent();
const kpr = content.kprRequirements;

const dialogRef = ref(null);
const activeTab = ref('karyawan'); // 'karyawan' | 'jointIncome' | 'subsidi'

const tabs = [
  { key: 'karyawan', label: 'Karyawan' },
  { key: 'jointIncome', label: 'Joint Income' },
  { key: 'subsidi', label: 'Unit Subsidi' },
];

function onKeydown(e) {
  if (e.key === 'Escape') emit('close');
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));

watch(() => props.isOpen, (open) => {
  if (open) {
    activeTab.value = 'karyawan';
    document.body.style.overflow = 'hidden';
    setTimeout(() => dialogRef.value?.focus(), 50);
  } else {
    document.body.style.overflow = '';
  }
});

const consultasiLink = wa('konsultasi');
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
      class="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
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
          class="relative w-full max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl focus:outline-none my-4 max-h-[90vh] overflow-y-auto"
        >
          <!-- Close Button -->
          <button
            type="button"
            aria-label="Tutup"
            class="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EBF2ED] text-emerald-900 transition-colors hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#142B20]"
            @click="emit('close')"
          >
            <svg class="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="pr-10 border-b border-gray-100 pb-4 mb-5">
            <h2 class="font-display text-2xl md:text-3xl font-bold text-[#142B20]">
              {{ title }}
            </h2>
            <p class="mt-1 text-sm text-gray-500">Persyaratan KPR yang perlu disiapkan</p>
          </div>

          <!-- Tab Navigation -->
          <div class="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1" role="tablist" :aria-label="title">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              role="tab"
              :aria-selected="activeTab === tab.key"
              :aria-controls="`kpr-panel-${tab.key}`"
              :id="`kpr-tab-${tab.key}`"
              class="flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#142B20]"
              :class="activeTab === tab.key
                ? 'bg-white text-[#142B20] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab Panels -->
          <div class="min-h-[240px]">

            <!-- Panel: Karyawan -->
            <div
              v-show="activeTab === 'karyawan'"
              :id="`kpr-panel-karyawan`"
              role="tabpanel"
              aria-labelledby="kpr-tab-karyawan"
            >
              <ul class="space-y-2 mb-4">
                <li
                  v-for="(doc, i) in kpr.karyawan.docs"
                  :key="i"
                  class="flex items-start gap-3 text-sm text-gray-700"
                >
                  <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span class="leading-snug">{{ doc }}</span>
                </li>
              </ul>
              <!-- Notes -->
              <div class="rounded-xl bg-[#EBF2ED] p-3.5 space-y-1">
                <p class="text-xs font-semibold text-[#142B20] mb-1">Ketentuan Masa Kerja:</p>
                <p v-for="(note, i) in kpr.karyawan.notes" :key="i" class="text-xs text-[#142B20]/80 flex items-start gap-2">
                  <span>•</span><span>{{ note }}</span>
                </p>
              </div>
            </div>

            <!-- Panel: Joint Income -->
            <div
              v-show="activeTab === 'jointIncome'"
              :id="`kpr-panel-jointIncome`"
              role="tabpanel"
              aria-labelledby="kpr-tab-jointIncome"
            >
              <p class="text-sm text-gray-600 mb-3 leading-relaxed">{{ kpr.jointIncome.intro }}</p>
              <ul class="space-y-2 mb-4">
                <li
                  v-for="(doc, i) in kpr.jointIncome.docs"
                  :key="i"
                  class="flex items-start gap-3 text-sm text-gray-700"
                >
                  <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span class="leading-snug">{{ doc }}</span>
                </li>
              </ul>
              <!-- Notes -->
              <div class="rounded-xl bg-[#EBF2ED] p-3.5 space-y-1">
                <p class="text-xs font-semibold text-[#142B20] mb-1">Ketentuan Masa Kerja:</p>
                <p v-for="(note, i) in kpr.jointIncome.notes" :key="i" class="text-xs text-[#142B20]/80 flex items-start gap-2">
                  <span>•</span><span>{{ note }}</span>
                </p>
              </div>
            </div>

            <!-- Panel: Unit Subsidi -->
            <div
              v-show="activeTab === 'subsidi'"
              :id="`kpr-panel-subsidi`"
              role="tabpanel"
              aria-labelledby="kpr-tab-subsidi"
            >
              <p class="text-sm text-gray-600 mb-4 leading-relaxed">{{ kpr.subsidi.intro }}</p>
              <div class="space-y-3 mb-4">
                <div
                  v-for="limit in kpr.subsidi.limits"
                  :key="limit.label"
                  class="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-[#FAF8F5] px-4 py-3"
                >
                  <span class="text-sm text-gray-700 font-medium">{{ limit.label }}</span>
                  <span class="text-sm font-bold text-[#142B20] whitespace-nowrap">{{ limit.max }}</span>
                </div>
              </div>
              <div class="rounded-xl bg-[#EBF2ED] p-3.5">
                <p class="text-xs text-[#142B20]/80 leading-relaxed">{{ kpr.subsidi.note }}</p>
              </div>
            </div>

          </div>

          <!-- Disclaimer -->
          <div class="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <p class="text-xs text-amber-800 leading-relaxed">
              <strong>Catatan:</strong> {{ kpr.disclaimer }}
            </p>
          </div>

          <!-- CTA Konsultasi -->
          <div class="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <p class="text-sm text-gray-600">{{ kpr.consultationCta }}</p>
            <a
              :href="consultasiLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-full bg-[#142B20] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0f1f17] transition-colors whitespace-nowrap"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              {{ kpr.consultationCtaLabel }}
            </a>
          </div>

        </div>
      </Transition>
    </div>
  </Transition>
</template>
