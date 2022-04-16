<template lang='pug'>
  div
    q-btn.material-icons-outlined(icon='filter_alt' color='primary' flat :label='labelFilter' size='md' @click="visible=!visible")
      q-tooltip Установить период отбора для документов
      filter-period(:no-storage='noStorage' :visible='visible' @input='setPeriod' @hide='handleHide')
</template>

<script>
import FilterPeriod from './FilterPeriod'
import { mapGetters } from 'vuex'

export default {
  name: 'ButtonFilterPeriod',
  props: {
    noStorage: {
      type: Boolean,
      default: false
    },
    period: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    visible: false
  }),
  computed: {
    ...mapGetters({ getFilterPeriod: 'period/getFilterPeriod' }),
    filterPeriod () {
      return this.noStorage ? this.period : this.getFilterPeriod
    },
    labelFilter () {
      let label = ''
      if ('period_s' in this.filterPeriod) label = `C ${this.filterPeriod.period_s}`
      if ('period_e' in this.filterPeriod) label = `${label} по ${this.filterPeriod.period_e}`
      if (!label) label = 'установить отчётный период'
      return label
    }
  },
  methods: {
    setPeriod (e) {
      if (this.noStorage) {
        this.$emit('input', e)
      }
    },
    handleHide () {
      this.visible = false
      this.$emit('update')
    }
  },
  components: {
    FilterPeriod
  }
}
</script>

<style>

</style>
