<template>
  <div>
    <v-btn color="#3F51B5" size="small" @click="dialog = true">
      <div class="text-white"> + Add Event</div>
    </v-btn>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>Add Event</v-card-title>
        <v-card-text>
          <v-date-input :min="minDate" density="compact" :hide-actions="false" ok-text="OK" variant="outlined"
            multiple="range" label="Date input" v-model="eventDate" />
          <v-text-field density="compact" variant="outlined" label="Event Name" v-model="eventName"></v-text-field>
          <v-text-field density="compact" variant="outlined" label="Phone" v-model="eventContact"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn density="compact" color="#3F51B5" @click="addEvent">Add Event</v-btn>
          <v-btn density="compact" color="#3F51B5" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="mt-2">

      <v-data-table hide-default-footer density="compact" :headers="headers" :items="events" item-value="name"
        class="elevation-1"></v-data-table>
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
    const eventName = ref("");
    const eventDate = shallowRef(null)
    const eventContact = ref("");
    const headers = [
      { title: "Event Name", key: "name" },
      { title: "Phone", key: "phone" },
      { title: "Start Date", key: "startDate" },
      { title: "End Date", key: "endDate" },
      { title: "Create Date", key: "createAt" },
    ];
    const events = ref([]);

    const getEvents = async () => {
      try {
        const res = await $fetch("/api/event");
        events.value = res.events;
      } catch (error) {
        console.error("Error Case", error);
      }
    };

    const addEvent = async () => {
      try {
        const res = await $fetch("/api/event", {
          method: "POST",
          body: {
            name: eventName.value,
            email: session.value.user.email,
            phone: eventContact.value,
            startDate: moment(eventDate.value[0]).format("YYYY-MM-DD 00:00:00"),
            endDate: moment(eventDate.value[eventDate.value.length - 1]).format("YYYY-MM-DD 23:59:59"),
            createAt: new Date(),
          },
        });
        dialog.value = false
        getEvents();
      } catch (error) {
        console.error("Error Case", error);
      }
    };
    const closeDialog = () => {
      dialog.value = false;
    };

    onMounted(() => {
      getEvents();
    });
    return { minDate, addEvent, dialog, eventName, eventDate, eventContact, closeDialog, getEvents, events, headers };
  },
};
</script>

<style></style>
