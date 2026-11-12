<script setup>
import { computed, ref } from 'vue';
import { useContent } from '~/composables/useContent';

const { content, wa } = useContent();
const calcData = computed(() => content.calculator || {});

// State Reaktif
const price = ref(calcData.value.defaultPrice || 166000000);
const dpPercent = ref(calcData.value.defaultDpPercent || 5);
const dpNominal = ref(Math.round(price.value * (dpPercent.value / 100)));
const tenorYears = ref(calcData.value.defaultTenor || 20);
const interestRate = ref(calcData.value.defaultInterestRatePercent || 5);

// Format Rupiah
function formatCurrency(val) {
  if (val === null || val === undefined || isNaN(val)) return 'Rp 0';
  return 'Rp ' + Math.round(val).toLocaleString('id-ID');
}

const formattedPrice = computed(() => {
  return price.value > 0 ? price.value.toLocaleString('id-ID') : '';
});

const formattedDpNominal = computed(() => {
  return dpNominal.value > 0 ? dpNominal.value.toLocaleString('id-ID') : '';
});

// Event Handlers
function onPriceInput(e) {
  const digits = e.target.value.replace(/\D/g, '');
  const num = digits ? parseInt(digits, 10) : 0;
  price.value = num;
  dpNominal.value = Math.round(num * (dpPercent.value / 100));
}

function clearPrice() {
  price.value = 0;
  dpNominal.value = 0;
  dpPercent.value = 0;
}

function onDpNominalInput(e) {
  const digits = e.target.value.replace(/\D/g, '');
  const num = digits ? parseInt(digits, 10) : 0;
  dpNominal.value = num;
  if (price.value > 0) {
    const pct = (num / price.value) * 100;
    dpPercent.value = Math.min(100, Math.max(0, Number(pct.toFixed(1))));
  } else {
    dpPercent.value = 0;
  }
}

function onDpPercentInput(e) {
  let pct = parseFloat(e.target.value);
  if (isNaN(pct)) pct = 0;
  if (pct > 95) pct = 95;
  if (pct < 0) pct = 0;
  dpPercent.value = pct;
  dpNominal.value = Math.round(price.value * (pct / 100));
}

function onSliderInput(e) {
  const pct = Number(e.target.value);
  dpPercent.value = pct;
  dpNominal.value = Math.round(price.value * (pct / 100));
}

// Computations
const plafon = computed(() => Math.max(0, price.value - dpNominal.value));

const monthlyInstallment = computed(() => {
  const P = plafon.value;
  if (P <= 0) return 0;
  const rateVal = Number(interestRate.value);
  const annualRate = (isNaN(rateVal) ? 0 : rateVal) / 100;
  const years = tenorYears.value || 20;
  const n = years * 12;
  if (annualRate <= 0) return Math.round(P / n);

  const r = annualRate / 12;
  const factor = Math.pow(1 + r, n);
  const emi = P * (r * factor) / (factor - 1);
  return Math.round(emi);
});

// Dynamic WhatsApp link
const whatsappUrl = computed(() => {
  return wa('simulasiKpr', {
    price: formatCurrency(price.value),
    dp: formatCurrency(dpNominal.value),
    dpPercent: dpPercent.value,
    plafon: formatCurrency(plafon.value),
    tenor: tenorYears.value,
    installment: formatCurrency(monthlyInstallment.value),
  });
});

// Slider background track gradient
const sliderBackgroundStyle = computed(() => {
  const min = calcData.value.minDpPercent || 5;
  const max = calcData.value.maxDpPercent || 90;
  const val = Math.min(Math.max(dpPercent.value, min), max);
  const percentage = ((val - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, #1C4A2A 0%, #1C4A2A ${percentage}%, #ECEAE1 ${percentage}%, #ECEAE1 100%)`,
  };
});

// Dynamic 3 metrics
const metrics = computed(() => [
  {
    label: calcData.value.metrics?.[0]?.label || 'Bunga KPR',
    value: `${interestRate.value ?? 0}% p.a.`,
  },
  {
    label: calcData.value.metrics?.[1]?.label || 'Uang Muka',
    value: `${dpPercent.value}%`,
  },
  {
    label: calcData.value.metrics?.[2]?.label || 'Tenor KPR',
    value: `${tenorYears.value} Thn`,
  },
]);
</script>

<template>
  <section :id="calcData.id || 'kalkulator'"
    class="relative pt-6 pb-16 lg:pt-8 lg:pb-20 scroll-mt-20 overflow-hidden bg-off-white">
    <!-- Background Image with Fade Effect -->
    <div v-if="calcData.image" class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <img :src="calcData.image" :alt="calcData.imageAlt || ''" aria-hidden="true"
        class="h-full w-full object-cover object-center opacity-10 lg:opacity-15" />
      <div class="absolute inset-0 bg-gradient-to-b from-off-white via-transparent to-off-white"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
      <!-- Section Heading -->
      <div class="text-center mx-auto max-w-2xl mb-8 lg:mb-10">
        <h2
          class="text-3xl sm:text-4xl lg:text-[42px] font-display font-semibold leading-tight text-charcoal mb-3 text-center">
          {{ calcData.titleLines?.[0] }}<br>
          <em class="italic">{{ calcData.titleLines?.[1] }}</em>
        </h2>
        <p class="text-xs sm:text-sm text-charcoal-gray leading-relaxed">
          {{ calcData.subtitle }}
        </p>
      </div>

      <!-- SATU Card Landscape 2 Kolom -->
      <div
        class="bg-white border border-cream-light rounded-[26px] p-6 sm:p-8 lg:p-10 shadow-[0_4px_30px_rgba(20,43,32,0.06)]">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <!-- Kolom 1 (Kiri): Input Data (6 Col) -->
          <div class="lg:col-span-6 space-y-6">
            <!-- 1. Input Harga Rumah -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="calc-price-input" class="text-xs sm:text-[13px] font-bold text-charcoal tracking-tight">
                  {{ calcData.labels?.housePrice }}
                </label>
                <span v-if="price > 0" class="text-[11px] font-semibold text-forest-deep">
                  {{ formatCurrency(price) }}
                </span>
              </div>

              <div class="relative flex items-center">
                <div
                  class="absolute left-4 pointer-events-none text-xs sm:text-sm font-bold text-charcoal-gray select-none">
                  Rp
                </div>
                <input id="calc-price-input" type="text" inputmode="numeric" :value="formattedPrice"
                  @input="onPriceInput" placeholder="0"
                  class="w-full pl-11 pr-10 py-3.5 bg-off-white/80 border border-cream-light rounded-xl text-sm sm:text-base font-bold text-charcoal placeholder-charcoal-gray/50 focus:bg-white focus:border-forest-deep focus:ring-2 focus:ring-forest-deep/20 outline-none transition-all"
                  :aria-label="calcData.labels?.housePrice" />
                <button v-if="price > 0" type="button" @click="clearPrice"
                  class="absolute right-3.5 w-6 h-6 flex items-center justify-center rounded-full bg-cream-light hover:bg-stone-gray hover:text-white text-charcoal text-xs transition-colors cursor-pointer"
                  :aria-label="calcData.labels?.clearLabel">
                  ✕
                </button>
              </div>
            </div>

            <!-- 2. Uang Muka (DP) Sinkronisasi Dua Arah -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="calc-dp-nominal" class="text-xs sm:text-[13px] font-bold text-charcoal tracking-tight">
                  {{ calcData.labels?.downPayment }}
                </label>
                <span class="text-[11px] font-semibold text-forest-deep">
                  {{ dpPercent }}% ({{ formatCurrency(dpNominal) }})
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <!-- Input Nominal DP -->
                <div class="sm:col-span-8 relative flex items-center">
                  <div
                    class="absolute left-4 pointer-events-none text-xs sm:text-sm font-bold text-charcoal-gray select-none">
                    Rp
                  </div>
                  <input id="calc-dp-nominal" type="text" inputmode="numeric" :value="formattedDpNominal"
                    @input="onDpNominalInput" placeholder="0"
                    class="w-full pl-11 pr-4 py-3.5 bg-off-white/80 border border-cream-light rounded-xl text-sm sm:text-base font-bold text-charcoal placeholder-charcoal-gray/50 focus:bg-white focus:border-forest-deep focus:ring-2 focus:ring-forest-deep/20 outline-none transition-all"
                    :aria-label="calcData.labels?.downPaymentNominal || calcData.labels?.downPayment" />
                </div>

                <!-- Input Persentase DP -->
                <div class="sm:col-span-4 relative flex items-center">
                  <input id="calc-dp-percent" type="number" min="0" max="95" step="0.5" :value="dpPercent"
                    @input="onDpPercentInput" placeholder="0"
                    class="w-full pl-4 pr-8 py-3.5 bg-off-white/80 border border-cream-light rounded-xl text-sm sm:text-base font-bold text-charcoal placeholder-charcoal-gray/50 focus:bg-white focus:border-forest-deep focus:ring-2 focus:ring-forest-deep/20 outline-none transition-all text-right sm:text-center"
                    :aria-label="calcData.labels?.downPaymentPercent || 'Persentase DP'" />
                  <div
                    class="absolute right-4 pointer-events-none text-xs sm:text-sm font-bold text-charcoal-gray select-none">
                    %
                  </div>
                </div>
              </div>

              <!-- Slider Range (5% - 90%) -->
              <div class="mt-3.5 px-1">
                <input type="range" :min="calcData.minDpPercent || 5" :max="calcData.maxDpPercent || 90" step="1"
                  :value="dpPercent" @input="onSliderInput" :style="sliderBackgroundStyle"
                  class="w-full h-2 rounded-lg appearance-none cursor-pointer accent-forest-deep"
                  aria-label="Slider Persentase Uang Muka" />
                <div class="flex justify-between text-[10px] sm:text-[11px] font-semibold text-charcoal-gray mt-1.5">
                  <span>{{ calcData.labels?.minDp }}</span>
                  <span>{{ calcData.labels?.midDp || '50%' }}</span>
                  <span>{{ calcData.labels?.maxDp }}</span>
                </div>
              </div>
            </div>

            <!-- 3 & 4. Grid 2 Kolom: Suku Bunga & Tenor Pinjaman -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Suku Bunga Manual (% per tahun) -->
              <div>
                <div class="flex items-center justify-between mb-2 gap-2">
                  <label for="calc-interest-rate"
                    class="text-xs sm:text-[13px] font-bold text-charcoal tracking-tight truncate">
                    {{ calcData.labels?.interestRate || 'Suku Bunga (% per tahun)' }}
                  </label>
                  <span class="text-[11px] font-semibold text-forest-deep shrink-0 whitespace-nowrap">
                    {{ interestRate || 0 }}% p.a.
                  </span>
                </div>
                <div class="relative flex items-center">
                  <input id="calc-interest-rate" type="number" min="0" max="30" step="0.1" v-model.number="interestRate"
                    placeholder="5"
                    class="w-full pl-4 pr-10 py-3.5 bg-off-white/80 border border-cream-light rounded-xl text-sm sm:text-base font-bold text-charcoal placeholder-charcoal-gray/50 focus:bg-white focus:border-forest-deep focus:ring-2 focus:ring-forest-deep/20 outline-none transition-all"
                    :aria-label="calcData.labels?.interestRate || 'Suku Bunga (% per tahun)'" />
                  <div
                    class="absolute right-4 pointer-events-none text-xs sm:text-sm font-bold text-charcoal-gray select-none">
                    %
                  </div>
                </div>
              </div>

              <!-- Tenor Pinjaman -->
              <div>
                <div class="flex items-center justify-between mb-2 gap-2">
                  <label for="calc-tenor-select"
                    class="text-xs sm:text-[13px] font-bold text-charcoal tracking-tight truncate">
                    {{ calcData.labels?.tenor }}
                  </label>
                  <span class="text-[11px] font-semibold text-forest-deep shrink-0 whitespace-nowrap">
                    {{ tenorYears }} Thn
                  </span>
                </div>

                <div class="relative">
                  <select id="calc-tenor-select" v-model.number="tenorYears"
                    class="w-full appearance-none px-4 py-3.5 bg-off-white/80 border border-cream-light rounded-xl text-sm sm:text-base font-bold text-charcoal focus:bg-white focus:border-forest-deep focus:ring-2 focus:ring-forest-deep/20 outline-none cursor-pointer transition-all pr-10"
                    :aria-label="calcData.labels?.tenor">
                    <option v-for="t in calcData.tenors" :key="t.value" :value="t.value">
                      {{ t.label }}
                    </option>
                  </select>
                  <div
                    class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-forest-deep text-xs font-bold">
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Kolom 2 (Kanan): Plafon, Box Cicilan, Metrics, WhatsApp CTA (6 Col) -->
          <div class="lg:col-span-6 space-y-5 lg:border-l lg:border-cream-light lg:pl-10">
            <!-- Plafon Pinjaman -->
            <div class="flex items-center justify-between pb-3 border-b border-cream-light text-xs sm:text-sm">
              <span class="text-charcoal-gray font-medium">{{ calcData.labels?.plafonTitle }}</span>
              <span class="text-charcoal font-bold text-sm sm:text-base">{{ formatCurrency(plafon) }}</span>
            </div>

            <!-- Box Estimasi Cicilan -->
            <div class="p-5 sm:p-6 rounded-2xl bg-mint-pale border border-sage-mist/60 text-center">
              <span class="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-forest-deep">
                {{ calcData.labels?.installmentTitle }}
              </span>
              <div class="flex items-baseline justify-center gap-1.5 mt-1">
                <span class="font-display text-3xl sm:text-4xl text-forest-deep font-bold tracking-tight">
                  {{ formatCurrency(monthlyInstallment) }}
                </span>
                <span class="text-xs sm:text-sm font-semibold text-charcoal-gray">
                  {{ calcData.labels?.perMonth }}
                </span>
              </div>
            </div>

            <!-- 3 Metrics Grid -->
            <div
              class="p-4 rounded-xl bg-off-white border border-cream-light grid grid-cols-3 gap-2 text-center divide-x divide-cream-light">
              <div v-for="metric in metrics" :key="metric.label" class="first:pl-0 px-2 last:pr-0">
                <span class="block text-[10px] uppercase font-bold tracking-wider text-charcoal-gray">{{ metric.label
                }}</span>
                <strong class="block text-xs sm:text-sm font-bold text-forest-deep mt-0.5">{{ metric.value }}</strong>
              </div>
            </div>

            <!-- WhatsApp CTA Button -->
            <div class="pt-2">
              <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer"
                class="w-full py-4 px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 rounded-full bg-forest-deep hover:bg-forest-medium text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                <span>{{ calcData.ctaLabel }}</span>
                <span class="text-base leading-none" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Pill Disclaimer di Luar Card -->
      <div v-if="calcData.footnote" class="mt-8 flex justify-center">
        <div
          class="inline-flex items-center px-5 py-2.5 rounded-2xl sm:rounded-full bg-white/80 backdrop-blur-sm border border-cream-light shadow-sm max-w-[100%] text-center">
          <p class="text-[11px] sm:text-xs leading-relaxed text-charcoal-gray">
            {{ calcData.footnote }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #1C4A2A;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #1C4A2A;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.15);
}
</style>
