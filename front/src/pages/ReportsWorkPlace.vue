<template lang='pug'>
  div
    q-card.work-place.q-pt-none.q-px-md(flat)
      q-card-section
        .row
          .col-12
            .text-h5.text-teal.q-my-sm {{$route.name}}
          q-scroll-area.workplace_scroll
            .col-12
              q-list(bordered)
                q-item(clickable outline v-for='(report, idx) in reports' :key='idx' @click='openReportForm(report)')
                  q-item-section( avatar )
                    q-icon(color='primary' name='description')
                  q-item-section {{report.label}}
    q-dialog(v-model='showDialog')
      q-card.q-px-sm(style='width: 600px')
        q-card-section.q-mb-sm
          .row.justify-between
            .text-h6 Укажите временной период для формирования отчёта
            q-btn(flat fab-mini color='grey' icon='close' @click='closeForm')
        q-card-section.q-pt-none
          .row.q-col-gutter-sm.q-mb-md
            .col-6
              select-date(
                label='Начало'
                dense
                v-model='dateStart'
                @clear='dateStart = null'
                ref='field01'
              )
            .col-6
              select-date(
                label='Конец'
                dense
                v-model='dateEnd'
                @clear='dateEnd = null'
                ref='field02'
              )
          .float-right.q-mb-md
            q-btn.q-mr-md(outline color='primary' label='Печать' @click='printReport')
            q-btn(outline color='primary' label='Отмена' @click='closeForm')
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'
import SelectDate from '@components/inputs/SelectDate'

export default {
  name: 'ReportsWorkPlace',
  props: {
    listType: {
      type: String,
      default: 'reports'
    }
  },
  data () {
    return {
      showDialog: false,
      dateStart: null,
      dateEnd: null,
      selectedMethod: null,
      selectedDescription: '',
      selectedHead: '',
      reports: [
        {
          id: 1,
          label: 'Отчёт для налоговой',
          method: 'report_nalog',
          description: 'Отчёт о выручке по дням',
          head: ['Дата смены', 'Идентификатор точки', 'Название точки', 'Выручка за день', 'Выручка точки за выбранный период']
        },
        {
          id: 2,
          label: 'Отчёт о работе сотрудников',
          method: 'report_user',
          description: 'Отчёт о выручке сотрудников на разных точках',
          head: ['Пользователь', 'Точка', 'Проработано часов', 'Выручка за указанный период']
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      isAdmin: 'auth/isAdmin'
    }),
    formName () {
      return !this.item.id ? 'Создание номенклатуры' : 'Изменение номенклатуры'
    }
  },
  methods: {
    ...mapActions({
      getReport: 'reports/getReport'
    }),
    showNotify (message) {
      Notify.create(message)
    },
    closeForm () {
      this.showDialog = false
    },
    openReportForm ({ method, description, head }) {
      this.showDialog = true
      this.selectedMethod = method
      this.selectedDescription = description
      this.selectedHead = head
    },
    async printReport () {
      const { list: report } = await this.getReport({
        method: this.selectedMethod,
        dateStart: this.dateStart || null,
        dateEnd: this.dateEnd || null,
        description: this.selectedDescription || null,
        head: this.selectedHead || null
      })
      console.log(report)
      this.showNotify('Печать отчёта')
    }
  },
  components: { 'select-date': SelectDate }
}
</script>

<style>
.workplace_scroll {
  height: calc(100vh - 150px);
  width: 100%;
}
</style>
