<template lang="pug">
  q-dialog(ref='dialog' :value='visible' @hide='$emit("hide")')
    q-card.q-mx-auto(flat style='min-width: 500px')
      q-card-section
        .text-h6 Установить отбор для периода
      q-card-section
        .row
          .col-6
            q-option-group.q-mt-sm(style='font-size:14px;' v-model='group' :options='options' color='teal')
          .col-6.col
            select-date.text-body2(:disable='disableInput' label='Начало периода' v-model='date_begin')
            select-date.text-body2(:disable='disableInput' label='Конец периода' v-model='date_end')
            q-btn.q-mt-md(v-if='group===2||group==1' outline color='primary' style='width:100%' :label='labelPeriod')
              q-icon.q-ml-md(size='18px' name='event')
              q-popup-proxy(ref='qDatePeriodProxy' transition-show='scale' transition-hide='scale')
                q-date(v-model='proxyDate' minimal :locale='$options.localeDate' :default-view='defaultView' emit-immediately @input='() => $refs.qDatePeriodProxy.hide()')
      q-card-actions(align='right')
        q-btn(icon='filter-alt' :disable='disableSetButton' @click='setFilter' outline color='primary' label='Установить')
        q-btn(icon='clear' v-close-popup outline color='primary' label='Закрыть')
</template>

<script>
import { date } from 'quasar'
import SelectDate from '@components/selects/SelectDate'
import { localeDate } from '@assets/localeDate'
import { dateHelper } from '@mixins'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'FilterPeriod',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    noStorage: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: [
        { label: 'Без ограничений', value: 0 },
        { label: 'Месяц', value: 1 },
        { label: 'Год', value: 2 },
        { label: 'Произвольный период', value: 3 }
      ],
      group: 0,
      date_begin: '',
      date_end: '',
      proxyDate: ''
    }
  },
  watch: {
    visible: function (newval) {
      if (newval) {
        this.group = 0
        this.date_begin = this.filterPeriod.period_s || ''
        this.date_end = this.filterPeriod.period_e || ''
        if (!!this.date_begin || !!this.date_end) this.group = 3
        this.proxyDate = ''
      }
    },
    group: function (newval) {
      switch (newval) {
        case 0:
          this.date_begin = ''
          this.date_end = ''
          break
        case 1:
          this.date_begin = date.formatDate(date.startOfDate(new Date(), 'month'), 'DD.MM.YYYY')
          this.date_end = date.formatDate(date.endOfDate(new Date(), 'month'), 'DD.MM.YYYY')
          break
        case 2:
          this.date_begin = date.formatDate(date.startOfDate(new Date(), 'year'), 'DD.MM.YYYY')
          this.date_end = date.formatDate(date.endOfDate(new Date(), 'year'), 'DD.MM.YYYY')
      }
    },
    proxyDate: function (newval) {
      if (newval) {
        let t = {}
        if (this.group === 1) {
          t = this.getPeriodMonth(newval)
        } else if (this.group === 2) {
          t = this.getPeriodYear(newval)
        }
        if (Object.keys(t).length > 0) {
          this.date_begin = t.start
          this.date_end = t.end
        }
      }
    }
  },
  computed: {
    ...mapGetters({ filterPeriod: 'period/getFilterPeriod' }),
    disableInput () {
      return this.group !== 3
    },
    disableSetButton () {
      return this.group !== 0 && !(this.date_begin || this.date_end)
    },
    labelPeriod () {
      if (this.group === 1) return 'Выбрать месяц'
      if (this.group === 2) return 'Выбрать год'
      return ''
    },
    defaultView () {
      if (this.group === 1) return 'Months'
      if (this.group === 2) return 'Years'
      return 'Calendar'
    }
  },
  methods: {
    ...mapActions({ setFilterPeriod: 'period/setFilterPeriod' }),
    setFilter () {
      let r = {}
      if (this.date_begin) r = { ...r, period_s: this.date_begin }
      if (this.date_end) r = { ...r, period_e: this.date_end }
      if (!this.noStorage) {
        this.setFilterPeriod(r)
      } else {
        this.$emit('input', r)
      }
      this.$emit('hide')
    }
  },
  mixins: [dateHelper],
  components: { SelectDate },
  localeDate: localeDate
}
</script>
