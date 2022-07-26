<template>
  <div>
    <ModalTemplate v-model="show" @confirm="confirm" @cancel="cancel">
      <template v-slot:title>Hello, vue-final-modal</template>
      {{ Request }}
    </ModalTemplate>
  </div>
</template>
<script>
import ModalTemplate from "./ModalTemplate.vue";

export default {
  components: { ModalTemplate },
  props: {
    showModal: Boolean,
    Request: Object,
  },
  data: () => ({
    show: false,
  }),
  methods: {
    confirm() {
      // some code...
      this.show = false;
    },
    cancel(close) {
      // some code...
      close();
    },
  },
};
</script>
