<template>
  <div>
    <v-btn color="#3F51B5" size="small" @click="dialog = true">
      <div class="text-white"> + Add Member</div>
    </v-btn>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>Add Member</v-card-title>
        <v-card-text>
          <v-text-field density="compact" variant="outlined" label="Username" v-model="name"></v-text-field>
          <v-text-field density="compact" variant="outlined" label="Password" v-model="password"></v-text-field>

          <v-text-field density="compact" variant="outlined" label="Phone" v-model="phone"></v-text-field>
          <v-text-field density="compact" variant="outlined" label="Email" v-model="email"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn density="compact" color="#3F51B5" @click="addMember">Add Member</v-btn>
          <v-btn density="compact" color="#3F51B5" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="mt-2">

      <v-data-table hide-default-footer density="compact" :headers="headers"
        :items="members.filter((item) => item.role !== 'admin')" item-value="name" class="elevation-1"></v-data-table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  setup() {
    definePageMeta({
      layout: "admin",
    });
    const minDate = moment().toDate();
    const { data: session } = useAuth();
    const dialog = ref(false);
    const name = ref("");
    const phone = ref("");
    const password = ref("");
    const email = ref("");
    const headers = [
      { title: "Username", key: "username" },
      { title: "Phone", key: "phone" },
      { title: "Email", key: "email" },
      { title: "Create Date", key: "createAt" },
    ];
    const members = ref([]);

    const getMember = async () => {
      try {
        const res = await $fetch("/api/member");
        members.value = res.events;
      } catch (error) {
        console.error("Error Case", error);
      }
    };

    const addMember = async () => {
      try {
        const res = await $fetch("/api/member", {
          method: "POST",
          body: {
            username: name.value,
            password: password.value,
            email: email.value,
            phone: phone.value,
            role: 'staff',
            createAt: new Date(),
            parent: session.value.user.email,
          },
        });
        dialog.value = false
        getMember();
      } catch (error) {
        console.error("Error Case", error);
      }
    };
    const closeDialog = () => {
      dialog.value = false;
    };

    onMounted(() => {
      getMember();
    });
    return { minDate, addMember, dialog, name, phone, email, password, closeDialog, getMember, members, headers };
  },
};
</script>

<style></style>
