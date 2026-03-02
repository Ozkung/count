<template>
  <div class="dialog-log">
    <v-card
      class="mx-auto glass-hop"
      elevation="3"
      min-width="448"
      rounded="lg"
    >
      <div class="text-display-small text-center pt-12">Admin panel</div>
      <div class="pa-12 pb-8">
        <div class="text-body-large text-medium-emphasis">Account</div>

        <v-text-field
          density="compact"
          v-model="username"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
        ></v-text-field>

        <div
          class="text-body-large text-medium-emphasis d-flex align-center justify-space-between"
        >
          Password
        </div>

        <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-btn color="#3F51B5" size="large" block @click="login">
          <div class="text-white">Log In</div>
        </v-btn>
      </div>
    </v-card>
  </div>
</template>
<script setup>
const { signIn, status } = useAuth();
const username = ref('');
const password = ref('');
const visible = ref(false);

const login = async () => {
  try {
    const res = await signIn('credentials', {
      username: username.value,
      password: password.value,
      redirect: true,
      callbackUrl: '/admin/events',
    });
  } catch (error) {
    console.error("Login failed", error);
  }
};
</script>

<style scoped>
.dialog-log {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  /* background-image: url("/dance_bg.jpg"); */
  /* background-size: cover; */
  /* background-position: center; */
  background-color: rgb(154, 208, 255);
}

.glass-hop {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(16.8px);
  -webkit-backdrop-filter: blur(16.8px);
}
</style>
