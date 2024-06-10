<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <Menu />
    <v-main class="bg-grey-lighten-2">

      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

  </v-app>
</template>
<script>
import Menu from './components/Menu.vue';

export default {
  components: {
    Menu
  },
};
</script>
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


