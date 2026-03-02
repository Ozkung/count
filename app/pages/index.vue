<template>
  <div class="hero-container">
    <div class="animated-background"></div>
    <div class="content-wrapper">
      <div v-if="pending" class="loading-state">
        <div class="spinner"></div>
        <p>Loading the next big event...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>Oops! Unable to load events.</p>
      </div>

      <div v-else-if="targetEvent" class="event-showcase">
        <div class="event-header">
          <h1 class="event-title">
            {{ targetEvent.title || targetEvent.name || "Upcoming Event" }}
          </h1>
          <!-- Show the token query if available -->
          <div>
            <p class="event-subtitle" v-if="query?.token">
              Welcome back, token: {{ query.token }}
            </p>
          </div>
        </div>
        <div class="countdown-wrapper">
          <Countdown
            :date="moment(targetEvent.endDate).toDate()"
            v-slot="{ days, hours, minutes, seconds }"
          >
            <div class="countdown-grid">
              <div class="time-card">
                <div class="time-value">{{ formatTime(days) }}</div>
                <div class="time-label">Days</div>
              </div>

              <div class="time-card">
                <div class="time-value">{{ formatTime(hours) }}</div>
                <div class="time-label">Hours</div>
              </div>

              <div class="time-card">
                <div class="time-value">{{ formatTime(minutes) }}</div>
                <div class="time-label">Minutes</div>
              </div>

              <div class="time-card">
                <div class="time-value">{{ formatTime(seconds) }}</div>
                <div class="time-label">Seconds</div>
              </div>
            </div>
            <div
              v-if="moment(targetEvent.endDate).diff(moment()) > 0"
              class="mt-8 d-flex flex-column justify-center"
            >
              <v-text-field
                class="mx-auto"
                width="300"
                max-width="300"
                variant="solo"
                label="Username"
                v-model="username"
                density="compact"
              ></v-text-field>
              <v-text-field
                class="mx-auto"
                width="300"
                max-width="300"
                variant="solo"
                label="Token"
                v-model="token"
                density="compact"
              ></v-text-field>
              <v-btn
                width="300"
                class="mx-auto"
                color="#3F51B5"
                @click="onSubmit"
                :loading="isSubmitting"
                >Submit</v-btn
              >
            </div>
            <v-card max-width="300" class="mx-auto mt-4 text-center">
              <a v-if="link" :href="link" rel="noopener noreferrer"
                >Go to Event</a
              >
            </v-card>
          </Countdown>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>No upcoming events at this moment. Stay tuned!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { computed } from "vue";

const route = useRoute();
const query = route.query;

const { data, pending, error }: any = await useFetch("/api/event");
const token = ref("");
const username = ref("");
const isSubmitting = ref(false);
const link = ref("");

const onSubmit = async () => {
  if (!token.value) return;
  isSubmitting.value = true;
  try {
    const res: any = await $fetch("/api/trans");
    console.log(res);
    const events = res?.events || [];

    // Check if the username exists in the retrieved data and get its link
    const found = events.find(
      (e: any) => e.username === username.value && e.reffer === token.value,
    );
    if (found && found.link) {
      let url = found.link;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      link.value = url;
    } else {
      alert("Username not found or link is unavailable.");
    }
  } catch (err) {
    console.error("Failed to verify username", err);
    alert("An error occurred during verification.");
  } finally {
    isSubmitting.value = false;
  }
};

const targetEvent = computed(() => {
  const events: any = data.value?.events || [];
  if (events.length > 0) {
    const now = new Date();
    // Find future events
    const upcoming = events.filter(
      (e: any) => e.endDate && new Date(e.endDate) > now,
    );
    if (upcoming.length > 0) {
      upcoming.sort(
        (a: any, b: any) =>
          new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
      );
      return upcoming[0];
    }
    return events[0];
  }
  return null;
});

const time = computed(() => {
  if (targetEvent.value && targetEvent.value.startDate) {
    const eventDate = new Date(targetEvent.value.startDate);
    return Math.max(0, eventDate.getTime() - new Date().getTime());
  }
  return 0;
});

const formatTime = (value: number) => {
  return value < 10 ? `0${value}` : value.toString();
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap");

.hero-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Outfit", sans-serif;
  color: #ffffff;
  overflow: hidden;
  background-color: #050505;
}

.animated-background {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 50% 50%,
    #2a0845 0%,
    #6441a5 30%,
    #000000 70%
  );
  animation: rotateGradient 20s linear infinite;
  z-index: 0;
  opacity: 0.8;
  filter: blur(80px);
}

@keyframes rotateGradient {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.content-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1000px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #a770ef;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.event-showcase {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.event-header {
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeUp 1s ease-out forwards;
}

.event-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  margin: 0 0 1rem 0;
  line-height: 1.1;
  background: linear-gradient(to right, #f857a6, #ff5858);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0px 10px 20px rgba(248, 87, 166, 0.3));
  letter-spacing: -0.03em;
}

.event-subtitle {
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.countdown-wrapper {
  width: 100%;
  animation: fadeUp 1.2s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

.countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  width: 100%;
}

@media (max-width: 768px) {
  .countdown-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.time-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.4s ease,
    border-color 0.4s ease;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.time-card:hover {
  transform: translateY(-10px);
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(167, 112, 239, 0.2);
  border-color: rgba(167, 112, 239, 0.3);
}

.time-value {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
  background: linear-gradient(180deg, #ffffff 0%, #a770ef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 0.5rem;
  font-variant-numeric: tabular-nums;
}

.time-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
