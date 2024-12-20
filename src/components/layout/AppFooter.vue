<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <div class="text-gray-400 text-sm">
          © {{ currentYear }} CodeVerse. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<script lang="ts">
export default {
  name: 'AppFooter'
}
</script> 