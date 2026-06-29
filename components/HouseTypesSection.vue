<script setup>
import { computed, ref } from 'vue';
import { useContent } from '~/composables/useContent';

const { houseTypes } = useContent();

const selectedTypeId = ref(null);
const modalOpen = ref(false);

const selectedType = computed(() => houseTypes.find(t => t.id === selectedTypeId.value) || null);

function openType(id) {
  selectedTypeId.value = id;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
}
</script>

<template>
  <SectionShell id="tipe">
    <SectionHeading class="mx-auto text-center" eyebrow="Pilihan Tipe"
      title="Tipe Rumah <br />Sanggar Indah Parahyangan" />
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <HouseTypeCard v-for="t in houseTypes" :key="t.id" :type="t" @select="openType" />
    </div>

    <HouseTypeModal :type="modalOpen ? selectedType : null" @close="closeModal" />
  </SectionShell>
</template>
