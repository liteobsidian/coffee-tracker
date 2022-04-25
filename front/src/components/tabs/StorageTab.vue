<template lang='pug'>
  div
    div.full-width.full-height
      .text-h6.text-center.text-primary.self-center Остатки не найдены. Проверьте наличие заполненной инвентаризации.
    q-markup-table.sticky_workdays_table.scroll(flat bordered separator='horizontal' v-if='remains.length')
      thead
        tr
          th.text-bold.text-white.text-left Точка
          th.text-bold.text-white.text-right Номенклатура
          th.text-bold.text-white.text-right Дата
            q-tooltip Дата последнего изменения
          th.text-bold.text-white.text-right Остаток
          th.text-bold.text-white.text-right Цена
          th.text-bold.text-white.text-right Сумма
      tbody.scroll.bg-teal-1
        tr.bg-teal-1.cursor-pointer(v-for='(item, idx) in remains' :key='idx')
          td.text-left {{item.division_name}}
          td.text-right {{item.nomenclature}}
          td.text-right {{item.date}}
          td.text-right {{item.count}}
          td.text-right {{item.cost}}
          td.text-right {{item.total_sum}}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'

export default {
  name: 'StorageTab',
  data () {
    return {
      tab: 'storage',
      showDialog: false
    }
  },
  computed: {
    ...mapGetters({
      remains: 'storage/getRemains'
    })
  },
  methods: {
    ...mapActions({
      listRemains: 'storage/listRemains'
    }),
    showNotify (message) {
      Notify.create(message)
    }
  },
  created () {
    this.listRemains()
  }
}
</script>

<style>
.workplace_scroll {
  height: calc(100vh - 150px);
  width: 100%;
}
</style>
