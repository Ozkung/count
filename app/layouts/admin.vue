<template>
  <client-only>
    <v-app id="inspire" theme="light">
      <v-layout>
        <v-navigation-drawer v-model="drawer">
          <v-list density="compact" nav>
            <v-list-item v-for="(item, index) in menuDefault" color="#3F51B5" :key="index" :prepend-icon="item.icon"
              :title="item.title" :value="item.value" :to="item.to" exact
              @click="selectedItem = item.title"></v-list-item>
          </v-list>

          <template v-slot:append>
            <div class="pa-2">
              <v-btn color="#B71C1C" block @click="signOut">
                <div class="text-white">Logout</div>
              </v-btn>
            </div>
          </template>
        </v-navigation-drawer>

        <v-app-bar>
          <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

          <v-app-bar-title>{{ selectedItem }}</v-app-bar-title>
        </v-app-bar>

        <v-main>
          <div class="pa-2">

            <slot />
          </div>
        </v-main>
      </v-layout>
    </v-app>
  </client-only>
</template>

<script>
export default {
  setup() {
    const route = useRoute();
    const selectedItem = ref("Events");
    const { signOut, status } = useAuth();
    const drawer = ref(null);
    const menuDefault = [
      {
        title: "Events",
        icon: "mdi-view-dashboard",
        value: "Events",
        to: "/admin/events"
      },
      {
        title: "Contact List",
        icon: "mdi-forum",
        value: "Contact List",
        to: "/admin/contact-list"
      },
    ];
    onMounted(() => {
      selectedItem.value = menuDefault.find((item) => item.to === route.path).value
    });
    return { drawer, menuDefault, signOut, selectedItem };
  },
};
</script>
