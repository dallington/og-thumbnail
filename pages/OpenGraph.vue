<template>
  <client-only>
    <div
      class="border-[50px] h-full w-full p-12 font-body flex flex-col justify-center "
      :style="{ borderColor: getBorderColor }"
    >
      <div>
        <div class="flex items-center">
          <div
            class="flex items-center justify-center w-24 h-24 mr-4 rounded-full"
            :style="{ background: getBorderColor }"
          >
            <Logo class="w-20 text-center" />
          </div>

          <h1 class="text-[40px] font-extrabold text-gray-800">
            Dallington.dev
          </h1>
        </div>
      </div>

      <div class="flex items-center flex-grow w-2/3 py-12">
        <div>
          <h2 class="font-extrabold text-gray-900 text-[90px] leading-none">
            {{ $route.query.title }}
          </h2>

          <p class=" text-gray-700 text-[24px] leading-none mt-5">
            {{ $route.query.description }}
          </p>

          <div class="flex items-center mt-8">
            <div
              v-if="$route.query.authorImage"
              class="w-20 h-20 mr-6 overflow-hidden rounded-full"
            >
              <img
                class="object-cover w-full h-full"
                :src="$route.query.authorImage"
                alt="Avatar"
              />
            </div>

            <div>
              <p
                v-if="$route.query.authorName"
                class="text-4xl font-medium text-gray-700"
              >
                {{ $route.query.authorName }}
              </p>
              <p v-if="$route.query.date" class="text-3xl text-gray-500">
                {{ $route.query.date }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex text-gray-500">
        <p class="mr-12 text-4xl">
          dallington.dev
        </p>
        <p class="text-4xl">
          @dallington
        </p>
      </div>
    </div>
  </client-only>
</template>

<script lang="ts">
import Vue from "vue";
import Logo from "~/components/Logo.vue";
export default Vue.extend({
  components: {
    Logo
  },

  data() {
    const message: string = "This is a message";
    return {
      message
    };
  },
  computed: {
    // Precisa de anotação por causa do `this` no retorno
    getBorderColor(): string {
      console.log(this.$route.query);
      return this.$route.query.color
        ? `#${this.$route.query.color}`
        : "#000000";
    }
  }
});
</script>
