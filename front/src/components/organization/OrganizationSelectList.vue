<template lang="pug">
  div
    select-list(
      type='organization' :items='items' @getdata='getdata' @search='dosearch' @selected='$emit("selected",$event)')
      template(v-slot:list='{item}')
        organization-item(:item='item' :ismark='false')
</template>

<script>
import SelectList from '@components/lists/SelectListSearch.vue'
import OrganizationItem from './OrganizationItem'
import { mapActions, mapGetters } from 'vuex'
import { loadingStatus } from '@mixins'

export default {
  name: 'OrganizationSelectList',
  data () {
    return {
      items: []
    }
  },
  computed: {
    ...mapGetters({ organizations: 'organization/getOrgs' })
  },
  methods: {
    ...mapActions({ organizationList: 'organization/organizationList' }),
    async getdata (parent, search = null) {
      if (this.isLoading) return
      try {
        this.isLoading = true
        const data = await this.organizationList(search)
        this.items = data.result
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    dosearch (val) {
      this.getdata(null, val)
    }
  },
  mounted () {
    if (!this.organizations.length) this.getdata()
  },
  mixins: [loadingStatus],
  components: {
    'select-list': SelectList,
    'organization-item': OrganizationItem
  }
}
</script>
