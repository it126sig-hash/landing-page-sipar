<script setup>
import { useContent } from '~/composables/useContent';

const props = defineProps({
  messageKey: { type: String, required: true }, // konsultasi | simulasi | survey | type
  vars: { type: Object, default: () => ({}) },
  variant: { type: String, default: 'primary' },
});

const { wa } = useContent();
const href = wa(props.messageKey, props.vars);
</script>

<template>
  <BaseButton :href="href" :variant="variant" target="_blank" rel="noopener">
    <slot />
  </BaseButton>
</template>
