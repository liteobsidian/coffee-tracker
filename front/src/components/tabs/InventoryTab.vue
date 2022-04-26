<template lang='pug'>
  div
    div.full-width.full-height(v-if='!inventoryList || !inventoryList.length')
      .text-h6.text-center.text-primary.self-center Нет ни одной заполненной инвентаризации.
    q-markup-table.sticky_workdays_table.scroll(flat bordered separator='horizontal' v-if='inventoryList && inventoryList.length')
      thead
        tr
          th.text-bold.text-white.text-left Дата
          th.text-bold.text-white.text-right Точка
          th.text-bold.text-white.text-right Пользователь
          th.text-bold.text-white.text-right Сумма
      tbody.scroll.bg-teal-1
        tr.bg-teal-1.cursor-pointer(v-for='(item, idx) in inventoryList' :key='idx')
          td.text-left {{item.date}}
          td.text-right {{item.division_name}}
          td.text-right {{item.user_name}}
          td.text-right {{item.total_sum}}
    q-page-sticky(
      position='bottom-right'
      :offset='[120, 16]'
    )
      q-btn(
        v-if='isAdmin'
        fab
        icon='add'
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
              q-input(flat dense label='Название' v-model='item.name')
            .col-4
              q-input(flat dense label='Единица измерения' v-model='item.unit')
            .col-4
              q-input.q-mb-lg(flat dense label='Цена' mask='#.##' fill-mask='0'  reverse-fill-mask v-model='item.cost')
            .col-4.self-center
              q-checkbox.text-teal.text-caption.q-mb-lg(flat dense v-model='item.is_perishable') Скоропортящийся продукт
            .col-4
              q-input.q-mb-lg(flat dense label='Сумма закупки' mask='#.##' fill-mask='0'  reverse-fill-mask v-model='item.lot_value')
            .col-4
              q-input.q-mb-lg(flat dense label='Минимальное количество' mask='#' fill-mask='0'  reverse-fill-mask v-model='item.min_count')
            .col-4
              q-input.q-mb-lg(flat dense label='Максимальное количество' mask='#' fill-mask='0'  reverse-fill-mask v-model='item.max_count')
          .float-right.q-mb-md
            q-btn.q-mr-md(outline color='primary' label='Сохранить' @click='addNomenclature')
            q-btn(outline color='primary' label='Отмена' @click='closeForm')
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'

export default {
  name: 'InventoryTab',
  data () {
    return {
      showDialog: false,
      item: {
        id: '',
        date: null,
        division_id: '',
        division_name: '',
        user_id: '',
        user_name: '',
        total_sum: '',
        nomenclature: []
      }
    }
  },
  computed: {
    ...mapGetters({
      inventoryList: 'inventory/getInventoryList',
      isAdmin: 'auth/isAdmin'
    }),
    formName () {
      return !this.item.id ? 'Заполнение инвентаризации' : 'Изменение инвентаризации'
    }
  },
  methods: {
    ...mapActions({
      listInventory: 'inventory/listInventory',
      addInventory: 'inventory/addInventory',
      updateInventory: 'inventory/updateInventory',
      deleteInventory: 'inventory/deleteInventory'
    }),
    showNotify (message) {
      Notify.create(message)
    },
    async saveInventory () {
      // eslint-disable-next-line camelcase
      const { id, date, division_id: divisionId, nomenclature } = this.item
      const isAdd = !id
      if (!date) this.$q.notify({ message: 'Введите дату ', type: 'info' })
      if (!divisionId) this.$q.notify({ message: 'Укажите подразделение ', type: 'info' })
      if (!nomenclature || !nomenclature.length) this.$q.notify({ message: 'В документе отсутствует номенклатура ', type: 'info' })
      // eslint-disable-next-line camelcase
      if (date && divisionId && nomenclature && nomenclature.length) {
        try {
          isAdd ? await this.addInventory(this.item) : await this.updateInventory(this.item)
          this.clearForm()
          this.showDialog = false
          return
        } catch (err) {
          this.$q.notify(err && err.response && err.response.data ? err.response.data.message : 'Ошибка')
        }
      }
      console.error(`Не получилось ${isAdd ? 'добавить' : 'изменить'} документ инвентаризации`)
      this.$q.notify({ message: `Не получилось ${isAdd ? 'добавить' : 'изменить'} документ инвентаризации`, color: 'primary' })
    },
    clearForm () {
      this.item = {
        id: '',
        date: null,
        division_id: '',
        division_name: '',
        user_id: '',
        user_name: '',
        total_sum: '',
        nomenclature: []
      }
    },
    closeForm () {
      this.showDialog = false
      this.clearForm()
    },
    openEditInventory (inventory) {
      if (!this.isAdmin) return
      this.item = { ...inventory }
      this.showDialog = true
    }
  },
  created () {
    this.listInventory()
  }
}
</script>

<style>
.workplace_scroll {
  height: calc(100vh - 150px);
  width: 100%;
}
</style>
