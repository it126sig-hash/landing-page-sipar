<script setup>
import { useContent } from '~/composables/useContent';

const { content } = useContent();
</script>

<template>
  <footer class="bg-[#143A20] px-4 py-10 text-off-white sm:px-10">
    <div class="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-8">
      <div class="min-w-[260px] flex-1">
        <div class="flex items-center gap-3">
          <img :src="content.meta.logo" :alt="`Logo ${content.meta.projectName}`" class="h-12 w-12 rounded-xl bg-white object-contain p-1" />
          <div>
            <h3 class="font-sora text-lg font-extrabold text-white">{{ content.meta.projectName }}</h3>
            <p class="font-jakarta text-xs tracking-wide text-orange-light">CLUSTER SUBSIDI · HUNIAN MODERN</p>
          </div>
        </div>
        <p class="mt-4 max-w-sm font-jakarta text-sm text-sage-mist">{{ content.meta.tagline }}</p>

        <nav class="mt-6 flex flex-wrap gap-4">
          <a
            v-for="item in content.meta.nav"
            :key="item.id"
            :href="`#${item.id}`"
            class="font-jakarta text-sm text-sage-mist transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/30"
          >
            {{ item.label }}
          </a>
        </nav>
      </div>

      <div class="min-w-[220px] flex-1">
        <div class="font-sora text-sm font-bold text-white">Showroom & Kontak</div>
        <div class="mt-3 font-jakarta text-sm leading-loose text-sage-mist">
          <p v-for="(line, i) in content.footer.address" :key="i">{{ line }}</p>
          <p class="mt-2">{{ content.footer.email }}</p>
          <p>{{ content.footer.instagram }}</p>
          <p class="font-bold text-white">{{ content.footer.phoneDisplay }}</p>
        </div>
      </div>
    </div>

    <p class="mx-auto mt-8 max-w-[1200px] border-t border-white/10 pt-5 font-jakarta text-xs text-sage-mist/70">
      © {{ new Date().getFullYear() }} {{ content.meta.projectName }}. Semua hak dilindungi.
    </p>
  </footer>
</template>
