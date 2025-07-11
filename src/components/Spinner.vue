<template>
  <div class="spinner" :class="{ 'spinner-small': small }">
    <div class="spinner-ring"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  small?: boolean
}

defineProps<Props>()
</script>

<style scoped>
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  position: relative;
}

.spinner-small {
  width: 16px;
  height: 16px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small .spinner-ring {
  border-width: 1.5px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>