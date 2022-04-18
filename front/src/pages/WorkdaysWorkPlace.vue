<template lang='pug'>
  div
    q-card.work-place.q-pt-none.q-px-md(flat)
      q-card-section
        q-markup-table(flat)
          thead.bg-teal
            tr
              th(colspan='6')
                .row.no-wrap.items-center
                  q-img.rounded-borders(
                    style='width: 70px'
                    :ratio='1'
                    src='https://media.istockphoto.com/photos/male-barista-making-cappuccino-picture-id842948570?k=20&m=842948570&s=612x612&w=0&h=BRaz9dIccxudXFSqixgv-k-fwJRwoNnwkzT2xrHyGWI='
                  )
                  .text-h4.q-ml-md.text-white Установка смен сотрудникам
            tr
              th.text-bold.text-white.text-left Дата
              th.text-bold.text-white.text-right Точка
              th.text-bold.text-white.text-right Сотрудник
              th.text-bold.text-white.text-right Открыта
              th.text-bold.text-white.text-right Закрыта
              th.text-bold.text-white.text-right Выручка
            tr(v-for='(item, idx) in workdays' :key='idx' @click='openEditWorkday(item)')
              td.text-left {{item.date}}
              td.text-right {{item.division_name}}
              td.text-right {{item.user_name}}
              td.text-right {{item.date_open}}
              td.text-right {{item.date_close}}
              td.text-right {{+item.uncash_sum + +item.cash_sum}}
        q-page-sticky(
          position='bottom-right'
          :offset='[120, 16]'
        )
          q-btn(
            v-if='isAdmin'
            fab
            outline
            icon='add'
            label='Назначить смену'
            color='teal-6'
            @click='showDialog=true'
          )
    q-dialog(v-model='showDialog')
      q-card.q-px-sm(style='width: 600px')
        q-card-section.q-mb-sm
          .row.justify-between
            .text-h6 {{formName}}
            q-btn(flat fab-mini color='grey' icon='close' @click='closeForm')
        q-card-section.q-pt-none
          .row.q-col-gutter-sm
            .col-12
              q-input(flat dense label='Название' v-model='currentWorkday.name')
            .col-4
              q-input(flat dense label='Единица измерения' v-model='currentWorkday.unit')
            .col-4
              q-input.q-mb-lg(flat dense label='Цена' mask='#.##' fill-mask='0'  reverse-fill-mask v-model='currentWorkday.cost')
            .col-4.self-center
              q-checkbox.text-teal.text-caption.q-mb-lg(flat dense v-model='currentWorkday.is_perishable') Скоропортящийся продукт
            .col-4
              q-input.q-mb-lg(flat dense label='Сумма закупки' mask='#.##' fill-mask='0'  reverse-fill-mask v-model='currentWorkday.lot_value')
            .col-4
              q-input.q-mb-lg(flat dense label='Минимальное количество' mask='#' fill-mask='0'  reverse-fill-mask v-model='currentWorkday.min_count')
            .col-4
              q-input.q-mb-lg(flat dense label='Максимальное количество' mask='#' fill-mask='0'  reverse-fill-mask v-model='currentWorkday.max_count')
          .float-right.q-mb-md
            q-btn.q-mr-md(outline color='primary' label='Сохранить' @click='addWorkday(currentWorkday)')
            q-btn(outline color='primary' label='Отмена' @click='closeForm')
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'

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
        date: null,
        user_name: '',
        division_name: '',
        user_id: '',
        division_id: '',
        uncash_sum: 0,
        cash_sum: 0,
        date_open: null,
        date_close: null
      },
      fixIncass: 3000
    }
  },
  computed: {
    ...mapGetters({
      workdays: 'workday/getWorkdays',
      isAdmin: 'auth/isAdmin'
    }),
    formName () {
      return !this.currentWorkday.id ? 'Создание смены' : 'Изменение смены'
    }
  },
  methods: {
    ...mapActions({
      listWorkdays: 'workday/listWorkdays',
      pushNomenclatureInDB: 'workday/addWorkday',
      editNomenclature: 'workday/editWorkday',
      deleteNomenclature: 'workday/deleteWorkday'
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
      // eslint-disable-next-line camelcase
      if (date && userId && divisionId) {
        try {
          isAdd ? await this.pushNomenclatureInDB(this.item) : await this.editNomenclature(this.item)
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
        uncash_sum: 0,
        cash_sum: 0,
        date_open: null,
        date_close: null
      }
    },
    closeForm () {
      this.showDialog = false
      this.clearForm()
    },
    openEditWorkday (item) {
      if (!this.isAdmin) return
      this.currentWorkday = item
      this.showDialog = true
    }
  },
  created () {
    this.listWorkdays('')
  }
}
</script>
