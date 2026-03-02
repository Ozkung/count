<template>
  <client-only>
    <v-app theme="light">
      <v-main>
        <slot />
      </v-main>
    </v-app>
  </client-only>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
