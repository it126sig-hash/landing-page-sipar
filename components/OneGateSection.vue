<script setup>
import { useContent } from '~/composables/useContent';

const { content, withBase } = useContent();
</script>

<template>
  <SectionShell bg="bg-off-white">
    <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div class="order-2 lg:order-1">
        <SectionHeading eyebrow="One Gate System Cluster" title="Lingkungan Cluster yang Lebih Aman & Nyaman" />
        <div class="flex flex-col gap-3.5">
          <div v-for="g in content.oneGate" :key="g.id" class="flex items-start gap-3">
            <span
              class="mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg bg-mint-pale text-xs font-extrabold text-forest-deep">✓</span>
            <div>
              <div class="font-jakarta text-base font-bold text-forest-deep">{{ g.title }}</div>
              <div class="font-jakarta text-sm text-charcoal-gray">{{ g.desc }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="order-1 lg:order-2">
        <img :src="withBase('/assets/images/signgate.webp')" alt="One Gate System Cluster"
          class="aspect-[5/4] w-full rounded-2xl object-cover" />
      </div>
    </div>
  </SectionShell>
</template>
