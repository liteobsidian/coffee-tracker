<template lang='pug'>
  div
    q-card.work-place.q-pt-none.q-px-md(flat)
      q-card-section
        div &nbsp;
      q-card-section
        q-card(v-if='!currentWorkday.id')
          q-card-section.q-pb-none
            .col-12.flex.justify-between.items-end
              .text-h6.text-teal Смена
              .text-primary {{currentTime}}
          q-card-section.background_coffee_image.q-mt-md
            .blur
              .row.q-col-gutter-sm.text-center(style='z-index: 1; height: 30vh;')
                .col-12.self-center.text-primary.text-h6 На сегодня смен не назначено!
        q-card(v-else)
          q-card-section.q-pb-none
            .col-12.flex.justify-between.items-end
              .text-h6.text-teal Смена
              q-btn(
                v-if='!currentWorkday.date_open'
                outline
                label='Открыть смену'
                color='teal-6'
                @click='openWorkday'
              )
              .text-primary(v-else) {{currentTime}}
          q-card-section.background_coffee_image.q-mt-md
            .blur
              form.row.q-col-gutter-sm(style='z-index: 1;')
                .col-12.flex.justify-between
                  select-date(
                    label='Дата'
                    dense
                    readonly
                    v-model='normalizeWorkdayDate'
                    ref='field01'
                    style='max-width: 300px'
                  )
                  .text-primary
                    span Точка:
                    span.q-ml-sm.text-teal {{currentWorkday.division_name}}
                .col-6
                  q-input.q-mb-lg(
                    input-class='text-right'
                    :disable='!currentWorkday.date_open'
                    :readonly='!!currentWorkday.date_close'
                    flat dense label='Выручка б/н'
                    mask='#.##' fill-mask='0'
                    reverse-fill-mask
                    v-model='currentWorkday.uncash_sum'
                  )
                .col-6
                  q-input.q-mb-lg(
                    input-class='text-right'
                    flat dense label='Касса'
                    mask='#.##' fill-mask='0'
                    reverse-fill-mask
                    v-model='currentWorkday.total'
                    :disable='!currentWorkday.date_open'
                    :readonly='!!currentWorkday.date_close'
                  )
                .col-12
                  span.text-teal Инкассация:
                  span.text-primary.q-ml-sm {{fixIncass}} р.
                .col-6.q-pt-lg
                  .col-12.q-my-none.q-py-none
                    span.text-caption Выручка наличными:
                    span.text-caption.text-teal.q-ml-sm {{cashSum}} руб.
                  .col-12.q-my-none.q-py-none
                    span.text-caption Суммарная выручка:
                    span.text-caption.text-teal.q-ml-sm {{profit}} руб.
                .col-6.q-pt-none
                  .col-12(v-if='currentWorkday.date_open')
                    span Открытие смены:
                    span.text-teal.q-ml-sm {{currentWorkday.date_open}}
                  .col-12(v-if='currentWorkday.date_open')
                    span Закрытие смены:
                    span.text-teal.q-ml-sm {{currentWorkday.date_close}}
                .col-12
                  .row
                    .col-6(v-if='!!nextDate && !!nextDivision')
                      span.text-teal Следующая смена:
                      span.text-primary.q-ml-sm {{this.nextDate}}
                      span.text-teal.q-ml-sm на точке:
                      span.text-primary.q-ml-sm {{this.nextDivision}}
                    .col-6(v-else)
                    .col-6
                      q-btn.float-right(
                        v-if='!currentWorkday.date_close && !!currentWorkday.date_open'
                        outline
                        :disable='!(+currentWorkday.uncash_sum + +cashSum)'
                        label='Закрыть смену'
                        color='teal-6'
                        @click='closeWorkday'
                      )
                      q-tooltip(v-if='!(+currentWorkday.uncash_sum + +cashSum)') Заполните выручку
                      div.float-right.flex(v-if='currentWorkday.date_close')
                        .text-teal.rounded-borders Смена закрыта
                        q-icon.q-ml-sm(color='teal' name='check' size='sm')
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'
import SelectDate from '@components/inputs/SelectDate'
import Vue from 'vue'
import { loadingStatus, dateHelper } from '@mixins'

const normalizeDate = (value) => value ? value.split(' ')[0].split('-').reverse().join('.') : ''

export default {
  name: 'WorkdaysWorkPlace',
  props: {
    listType: {
      type: String,
      default: 'nomenclatures'
    }
  },
  data () {
    return {
      showDialog: false,
      currentWorkday: {
        id: '',
        date: '',
        user_name: '',
        division_name: '',
        user_id: '',
        division_id: '',
        uncash_sum: '0.00',
        cash_sum: '0.00',
        date_open: null,
        date_close: null,
        total: '0.00'
      },
      fixIncass: 3000,
      intervalId: null,
      date: null,
      nextDate: null,
      nextDivision: ''
    }
  },
  computed: {
    ...mapGetters({
      isAdmin: 'auth/isAdmin'
    }),
    currentTime () {
      return (new Date(this.date)).toLocaleTimeString()
    },
    normalizeWorkdayDate: {
      get: function () {
        return normalizeDate(this.currentWorkday.date)
      },
      set: function (val) {
        Vue.set(this.currentWorkday, 'date', val)
      }
    },
    cashSum () {
      return (+this.currentWorkday.total - +this.fixIncass).toFixed(2)
    },
    profit () {
      return ((+this.currentWorkday.total - +this.fixIncass) + +this.currentWorkday.uncash_sum).toFixed(2)
    }
  },
  methods: {
    ...mapActions({
      getWorkdayByUser: 'workday/loadWorkdayByUser',
      openCurrentWorkday: 'workday/openWorkday',
      closeCurrentWorkday: 'workday/closeWorkday',
      getNextWorkday: 'workday/nextWorkday'
    }),
    showNotify (message) {
      Notify.create(message)
    },
    async openWorkday () {
      try {
        this.isLoading = true
        await this.openCurrentWorkday()
        await this.updateWorkday()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    async closeWorkday () {
      try {
        this.isLoading = true
        await this.closeCurrentWorkday({
          cash_sum: this.cashSum,
          uncash_sum: this.currentWorkday.uncash_sum
        })
        await this.updateWorkday()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    async updateWorkday () {
      try {
        this.isLoading = true
        const workday = await this.getWorkdayByUser()
        this.currentWorkday = { ...workday, total: (+workday.cash_sum + +this.fixIncass).toFixed(2) }
        const { item } = await this.getNextWorkday()
        if (item) {
          this.nextDate = item.date
          this.nextDivision = item.name
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    }
  },
  beforeCreate () {
    this.date = Date.now()
    // eslint-disable-next-line no-return-assign
    this.intervalId = setInterval(() => this.date = Date.now(), 1000)
  },
  created () {
    this.updateWorkday()
  },
  beforeDestroy () {
    if (this.intervalId) clearInterval(this.intervalId)
  },
  components: { 'select-date': SelectDate },
  mixins: [loadingStatus, dateHelper]
}
</script>
<style>
.background_coffee_image {
  background-image: url("https://images.pexels.com/photos/266755/pexels-photo-266755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  z-index:0
}
.blur {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0);
  height: 100%;
  width: 100%;
  padding: 10px;
}
</style>
