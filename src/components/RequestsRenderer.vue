<template>
  <!-- {{ requests }} -->
  <div style="max-height: 350px; overflow: auto">
    <table class="table table-striped table-sm">
      <thead class="table-dark">
        <tr>
          <th>more</th>
          <th>code</th>
          <th>method</th>
          <th>path</th>
          <th>ttfb</th>
          <th>time</th>
          <th>origin</th>
        </tr>
      </thead>
      <tbody
        class="table-group-divider"
        style="max-height: 500px; overflow-y: scroll"
      >
        <tr v-for="request in requests" :key="request.requestId">
          <td style="cursor: pointer" @click="openRequestModal(request)">
            more
          </td>
          <td :class="`text-${getColor(request.statusCode)}`">
            {{ request.statusCode ?? "..." }}
          </td>
          <td>
            {{ request.method }}
          </td>
          <td class="limited-width">
            <Popper :content="request.url">
              <b>{{ getPath(request.url) }}</b>
            </Popper>
          </td>
          <td>
            {{ request.ttfb ? request.ttfb.toFixed(2) + "ms" : "..." }}
          </td>
          <td>
            {{ request.took ? request.took.toFixed(2) + "ms" : "..." }}
          </td>

          <td>
            {{ getOrigin(request.url) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { copyTextToClipboard } from "@/helpers/clipboard-helper";
import { getStatusCodeColor } from "@/helpers/helpers";
import { openModal } from "jenesius-vue-modal";
import RequestInfoModalVue from "./RequestInfoModal.vue";
export default {
  data() {
    return {
      showModal: false,
      modalRequest: {},
      modalTitle: "Modal Title",
    };
  },
  props: {
    requests: Object,
  },
  methods: {
    copy(name, value) {
      copyTextToClipboard(`${name}: ${value}`);
    },
    getPath(urlString) {
      return new URL(urlString).pathname;
    },
    getOrigin(urlString) {
      return new URL(urlString).host;
    },
    getName(urlString) {
      return (new URL(urlString).pathname ?? "").split("/").pop();
    },
    getColor(status) {
      return getStatusCodeColor(status);
    },
    openRequestModal(request) {
      if (request.took) {
        openModal(RequestInfoModalVue, { request });
      }
    },
  },
};
</script>
