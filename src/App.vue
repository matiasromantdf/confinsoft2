<script setup>
  import Menu from './components/Menu.vue'
  import { useUserStore } from './stores/user'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const usuario = useUserStore()
  const route = useRoute()
  const diasDeSuscripcion = computed(() => usuario.diasDeSuscripcion)
  const routeComponentKey = computed(() => {
    const comercioId = usuario.comercio?.id ?? usuario.comercio?.nombre ?? 'sin-comercio'
    return `${route.fullPath}-${comercioId}`
  })
</script>

<template>
  <v-app>
    <Menu v-if="diasDeSuscripcion > 0" />
    <v-main class="bg-grey-lighten-2">

      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="routeComponentKey" />
        </transition>
      </router-view>
    </v-main>

  </v-app>
</template>

<style>

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
