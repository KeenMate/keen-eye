<template>
  <div class="basic-settings">
    <label>Headers</label>
    <div @keyup.esc.stop>
      <multiselect
        :value="settings.headerRules"
        :clear-on-select="false"
        :options="pageHeaders"
        :show-labels="false"
        :multiple="true"
        tag-placeholder="Add"
        placeholder="Search or add a header rule"
        taggable
        :close-on-select="false"
        @tag="addHeaderRule"
        @input="val => updateSettings('headerRules', val)"
      />
    </div>

    <div class="form-group" @keyup.esc.stop>
      <label>Requests</label>
      <multiselect
        :value="settings.requestsRules"
        :options="requests"
        :clear-on-select="false"
        :show-labels="false"
        :multiple="true"
        tag-placeholder="Add"
        placeholder="Search or add a request rule"
        taggable
        :close-on-select="false"
        @tag="addRequestRule"
        @input="val => updateSettings('requestsRules', val)"
      />
    </div>

    <div class="form-group">
	    <label>Locale</label>
      <div class="input-group">
        <multiselect
          :value="settings.locale"
          :options="languages"
          :multiple="false"
          track-by="code"
          label="name"
          group-values="languages"
          group-label="type"
          class="form-control form-control-sm"
          :custom-label="customLabel"
          @input="val => updateSettings('locale', val)"
          @keyup.esc.stop
        />
	      <div class="input-group-append">
		      <button
			      class="btn btn-danger"
			      @click="onRemoveLocale"
		      >
			      Remove
		      </button>
	      </div>
      </div>
    </div>
  </div>
</template>

<script>
import languages from "@/languages/languages"
import Multiselect from "vue-multiselect"

export default {
	name: "BasicSettings",
	components: {Multiselect},
	props: {
		settings: {
			type: Object,
			required: true
		},
		requestInfo: {
			type: Object,
			required: true
		}
	},
	emits: ["change"],
	data() {
		return {}
	},
	computed: {
		pageHeaders() {
			return (
				this.requestInfo?.response?.responseHeaders?.map((o) => o.name) ?? []
			)
		},
		requests() {
			if (!this.requestInfo?.requests) return []
			return Object.values(this.requestInfo.requests).map((req) => req.url)
		},
		languages() {
			return languages
		}
	},
	methods: {
		onRemoveLocale() {
			if (!this.settings)
				return

			this.updateSettings("locale", null)
		},
		customLabel(object) {
			return `[${object.code}] ${object.name}`
		},
		addHeaderRule(val) {
			this.updateSettings("headerRules", [...(this.settings.headerRules || []), val])
		},
		addRequestRule(val) {
			this.updateSettings("requestsRules", [...(this.settings.headerRules || []), val])
		},
		updateSettings(key, value) {
			this.$emit("change", {...(this.settings || {}), [key]: value})
		}
	}
}
</script>
