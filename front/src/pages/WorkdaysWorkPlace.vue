<template lang='pug'>
  div
    q-card.q-pt-none.work-place.q-px-md(flat)
      q-card-section
        .row
          .col-12
            .text-h5.text-teal.q-my-sm {{$route.name}}
        q-markup-table.sticky_workdays_table.scroll(flat bordered separator='horizontal')
          thead
            tr.bg-teal
              th.text-bold.text-white.text-left Дата
              th.text-bold.text-white.text-right Точка
              th.text-bold.text-white.text-right Сотрудник
              th.text-bold.text-white.text-right Открыта
              th.text-bold.text-white.text-right Закрыта
              th.text-bold.text-white.text-right Выручка
          tbody.scroll.bg-teal-1
            tr.bg-teal-1.cursor-pointer(v-for='(item, idx) in workdays' :key='idx' @click='openEditWorkday(item)')
              td.text-left {{item.date}}
              td.text-right {{item.division_name}}
              td.text-right {{item.user_name}}
              td.text-right {{item.date_open}}
              td.text-right {{item.date_close}}
              td.text-right {{+item.uncash_sum + +item.cash_sum}}
        q-page-sticky(
          position='bottom-right'
          :offset='[120, 50]'
        )
          q-btn.bg-white(
            v-if='isAdmin'
            outline
            fab
            icon='add'
            label='Назначить смену'
            color='teal-6'
            @click='openWorkdayForm'
          )
    q-dialog(v-model='showDialog')
      q-card.q-px-sm(style='width: 600px')
        q-card-section.q-mb-sm
          .row.justify-between
            .text-h6 {{formName}}
            q-btn(flat fab-mini color='grey' icon='close' @click='closeForm')
        q-card-section.q-pt-none
          .row.q-col-gutter-sm
            .col-4
              select-date(
                label='Дата *'
                dense
                v-model='normalizeWorkdayDate'
                @clear='currentWorkday.date=""'
                ref='field01'
                :rules='[ value => !!value || "Нельзя назначить смену на пустую дату"]'
              )
            .col-4
              q-select(flat dense label='Точка' :options='divisions' v-model='currentWorkday.division_name' @input='setDivision($event)' ref='divisionSelect')
                template(v-slot:option='scope')
                  q-item(v-bind='scope.itemProps' v-on="scope.itemEvents")
                    q-item-section
                      span {{scope.opt.name}}
            .col-4
              q-select(flat dense label='Пользователь' :options='users' v-model='currentWorkday.user_name' @input='setUser($event)' ref='userSelect')
                template(v-slot:option='scope')
                  q-item(v-bind='scope.itemProps' v-on="scope.itemEvents")
                    q-item-section
                      span {{scope.opt.name}}
            .col-6
              q-input.q-mb-lg(input-class='text-right' :disable='!currentWorkday.id' flat dense label='Выручка б/н' mask='#.##' fill-mask='0' reverse-fill-mask v-model='currentWorkday.uncash_sum')
            .col-6
              q-input.q-mb-lg(input-class='text-right' :disable='!currentWorkday.id' flat dense label='Касса' mask='#.##' fill-mask='0' reverse-fill-mask v-model='currentWorkday.total')
            .col-6.q-pt-none
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
          .float-right.q-mb-md
            q-btn.q-mr-md(outline color='primary' label='Сохранить' @click='addWorkday(currentWorkday)')
            q-btn(outline color='primary' label='Отмена' @click='closeForm')
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
      fixIncass: 3000
    }
  },
  computed: {
    ...mapGetters({
      divisions: 'division/getDivisionsList',
      users: 'auth/getUsersList',
      workdays: 'workday/getWorkdays',
      isAdmin: 'auth/isAdmin'
    }),
    formName () {
      return !this.currentWorkday.id ? 'Создание смены' : 'Изменение смены'
    },
    normalizeWorkdayDate: {
      get: function () {
        return normalizeDate(this.currentWorkday.date)
      },
      set: function (val) {
        Vue.set(this.currentWorkday, 'date', val)
      }
    },
    normalizeWorkdayStartDate: {
      get: function () {
        return normalizeDate(this.currentWorkday.date_open)
      },
      set: function (val) {
        Vue.set(this.currentWorkday, 'date_open', val)
      }
    },
    normalizeWorkdayEndDate: {
      get: function () {
        return normalizeDate(this.currentWorkday.date_close)
      },
      set: function (val) {
        Vue.set(this.currentWorkday, 'date_close', val)
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
      listWorkdays: 'workday/listWorkdays',
      pushNomenclatureInDB: 'workday/addWorkday',
      editNomenclature: 'workday/editWorkday',
      deleteNomenclature: 'workday/deleteWorkday',
      updateDivisionsList: 'division/listDivisions',
      updateUsersList: 'auth/listUsers'
    }),
    showNotify (message) {
      Notify.create(message)
    },
    async addWorkday () {
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
    closeForm () {
      this.showDialog = false
      this.clearForm()
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
    setDivision (val) {
      this.currentWorkday.division_name = val.name
      this.currentWorkday.division_id = val.id
      this.$refs.divisionSelect.hidePopup()
    },
    setUser (val) {
      this.currentWorkday.user_name = val.name
      this.currentWorkday.user_id = val.id
      this.$refs.userSelect.hidePopup()
    }
  },
  created () {
    this.listWorkdays('')
  },
  components: { 'select-date': SelectDate },
  mixins: [loadingStatus, dateHelper]
}
</script>

<style lang="sass">
.sticky_workdays_table
  height: calc(100vh - 150px)
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
  thead tr th
    top: 83px
</style>
