<script setup lang="ts">
import HomeContent from '@vuepress/theme-default/components/HomeContent.vue'
import HomeFooter from '@vuepress/theme-default/components/HomeFooter.vue'
import HomeHero from '@vuepress/theme-default/components/HomeHero.vue'
import HomeFeatures from './HomeFeatures.vue'
</script>

<template>
  <main class="home">
    <HomeHero />
    <HomeFeatures />
    <HomeContent />
    <HomeFooter />
  </main>
</template>
