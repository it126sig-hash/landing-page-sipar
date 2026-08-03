<template>
  <section id="lokasi" class="bg-white py-16 md:py-24">
    <div class="container mx-auto px-4 md:px-20">
      <!-- Heading -->
      <h2 class="font-semibold text-3xl md:text-4xl leading-tight text-black mb-12">
        Lokasi di Pusat Pertumbuhan
      </h2>

      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left: Image -->
        <div class="w-full h-[400px] md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
          <!-- Placeholder for location map image -->
        </div>

        <!-- Right: Facilities List -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <span class="font-normal text-lg md:text-xl text-black">IKEA KBP</span>
          </div>

          <div class="flex items-center justify-between border-t pt-4">
            <span class="font-bold text-lg md:text-xl text-black">15 mnt</span>
            <span class="font-normal text-lg md:text-xl text-black">RUMAH SAKIT</span>
          </div>

          <div class="flex items-center justify-between border-t pt-4">
            <span class="font-normal text-lg md:text-xl text-black">XXI CINEMA</span>
          </div>

          <div class="flex items-center justify-between border-t pt-4">
            <span class="font-normal text-lg md:text-xl text-black">PARAHYANGAN GOLF</span>
          </div>

          <div class="flex items-center justify-between border-t pt-4">
            <span class="font-bold text-lg md:text-xl text-black">20 mnt</span>
            <span class="font-normal text-lg md:text-xl text-black">TOL PADALARANG</span>
          </div>

          <div class="flex items-center justify-between border-t pt-4 pb-4">
            <span class="font-bold text-lg md:text-xl text-black">25mnt</span>
            <span class="font-normal text-lg md:text-xl text-black">STASIUN KCIC WHOOSH</span>
          </div>

          <!-- CTA Button -->
          <div class="pt-6">
            <a 
              href="https://maps.google.com" 
              target="_blank"
              class="inline-flex items-center px-6 py-3 bg-[#C2B52C] text-black font-medium text-lg rounded-lg hover:bg-[#B0A428] transition-colors"
            >
              Lihat Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { content } = useContent();
</script>
