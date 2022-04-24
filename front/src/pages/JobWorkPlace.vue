<template lang='pug'>
  div
    q-card.work-place.q-pt-none.q-px-md(flat)
      q-card-section
        div &nbsp;
      q-card-section
        q-card
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
              .row.q-col-gutter-sm(style='z-index: 1;')
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
                    :disable='currentWorkday.date_open'
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
                    :disable='currentWorkday.date_close'
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
      date: null
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
      getWorkdayByUser: 'workday/loadWorkdayByUser'
    }),
    showNotify (message) {
      Notify.create(message)
    },
    async closeWorkday () {
      // eslint-disable-next-line camelcase
      const { id, date, user_id: userId, division_id: divisionId } = this.currentWorkday
      const isAdd = !id
      if (!date) this.$q.notify({ message: 'Укажите дату смены', type: 'info' })
      if (!userId) this.$q.notify({ message: 'Выберите сотрудника', type: 'info' })
      if (!divisionId) this.$q.notify({ message: 'Выберите точку', type: 'info' })
      const payload = { ...this.currentWorkday, cash_sum: this.cashSum }
      // eslint-disable-next-line camelcase
      if (date && userId && divisionId) {
        try {
          isAdd ? await this.pushNomenclatureInDB(payload) : await this.editNomenclature(payload)
          this.clearForm()
          this.showDialog = false
          return
        } catch (err) {
          this.$q.notify(err && err.response && err.response.data ? err.response.data.message : 'Ошибка')
        }
      }
      console.error(`Не получилось ${isAdd ? 'добавить' : 'изменить'} смену`)
      this.$q.notify({ message: `Не получилось ${isAdd ? 'добавить' : 'изменить'} смену`, color: 'primary' })
    },
    clearForm () {
      this.currentWorkday = {
        id: '',
        date: null,
        user_name: '',
        division_name: '',
        user_id: '',
        division_id: '',
        uncash_sum: '0.00',
        cash_sum: '0.00',
        date_open: null,
        date_close: null,
        total: '0.00'
      }
    },
    async openEditWorkday (item) {
      if (!this.isAdmin) return
      try {
        this.isLoading = true
        if (!this.divisions && !this.divisions.length) await this.updateDivisionsList('')
        if (!this.users && !this.users.length) await this.updateUsersList('')
        this.currentWorkday = { ...item, total: (+this.fixIncass + +item.cash_sum).toFixed(2) }
        this.showDialog = true
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    async openWorkdayForm () {
      if (!this.isAdmin) return
      try {
        this.clearForm()
        this.isLoading = true
        if (!this.divisions || !this.divisions.length) await this.updateDivisionsList('')
        if (!this.users || !this.users.length) await this.updateUsersList('')
        this.currentWorkday.total = this.fixIncass.toFixed(2)
        this.showDialog = true
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
        this.currentWorkday = { ...workday, total: this.fixIncass }
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
