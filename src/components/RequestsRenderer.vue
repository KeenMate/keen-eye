<template>
  <!-- {{ requests }} -->
  <div style="max-height: 350px; overflow-y: scroll">
    <table class="table table-striped table-sm">
      <thead class="table-dark">
        <tr>
          <th>code</th>
          <th>method</th>
          <th>origin</th>
          <th>time</th>
        </tr>
      </thead>
      <tbody
        class="table-group-divider"
        style="max-height: 500px; overflow-y: scroll"
      >
        <tr v-for="request in requests" :key="request.requestId">
          <td :class="`text-${getColor(request.statusCode)}`">
            {{ request.statusCode ?? "running..." }}
          </td>
          <td>
            {{ request.method }}
          </td>
          <td>
            <b>{{ getFormatedURl(request.url) }}</b>
          </td>
          <td>
            {{ request.took ? request.took.toFixed(2) + "ms" : "running..." }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { copyTextToClipboard } from "@/helpers/clipboard-helper";
import { getStatusCodeColor } from "@/helpers/helpers";
export default {
  props: {
    requests: Object,
  },
  methods: {
    copy(name, value) {
      copyTextToClipboard(`${name}: ${value}`);
    },
    getFormatedURl(urlString) {
      return new URL(urlString).origin;
    },
    getColor(status) {
      return getStatusCodeColor(status);
    },
  },
};
</script>
