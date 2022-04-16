<template lang='pug'>
  div
    q-card.work-place.q-pt-none.q-px-md(flat)
      q-card-section
        .row
          .col-12
            .text-h5.text-teal.q-my-sm {{$route.name}}
          .col-12
            organization-select-field.text-body1(
              label="Организация пользователя *"
              :value="organization"
              @input="setOrganization"
              @clear="setOrganization"
              dense
            )
          .col-12
            reports-list(:organization='organization' :type-report='typeReport')
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import OrganizationSelectField from '@components/organization/OrganizationSelectField'
import ReportsList from '@components/reports/ReportsList'

export default {
  name: 'MainWorkPlace',
  props: {
    typeReport: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      organization: 'organization/getSelected',
      userId: 'auth/getUserId'
    })
  },
  methods: {
    ...mapActions({ setOrganization: 'organization/setOrganization' })
  },
  components: { OrganizationSelectField, ReportsList },
  created () {
    this.setOrganization(this.profileOrganization)
  }
}
</script>
