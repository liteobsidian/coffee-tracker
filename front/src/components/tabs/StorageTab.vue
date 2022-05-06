<template lang='pug'>
  div
    div.disclaimer(v-if='!remains || !remains.length')
      .text-h6.text-center.text-primary.self-center Остатки не найдены. Проверьте наличие заполненной инвентаризации.
    q-markup-table.sticky_remains_table.scroll(flat bordered separator='horizontal' v-if='remains && remains.length')
      thead
        tr
          th.text-bold.text-teal.text-left Точка
          th.text-bold.text-teal.text-right Номенклатура
          th.text-bold.text-teal.text-right Дата
            q-tooltip Дата последнего изменения
          th.text-bold.text-teal.text-right Остаток
          th.text-bold.text-teal.text-left Ед. изм.
          th.text-bold.text-teal.text-center Цена
          th.text-bold.text-teal.text-center Сумма
      tbody.scroll.bg-teal-1
        tr.bg-teal-1.cursor-pointer(v-for='(item, idx) in remains' :key='idx')
          td.text-left {{item.division_name}}
          td.text-right {{item.nomenclature_name}}
          td.text-right {{item.date}}
          td.text-right {{item.count}}
          td.text-left {{item.unit}}
          td.text-right {{item.cost || 0}} р.
          td.text-right {{item.sum || 0}} р.
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
.disclaimer {
  height: calc(100vh - 200px);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.sticky_remains_table {
  height: calc(100vh - 200px);
}
.sticky_remains_table thead tr th {
  position: sticky;
  z-index: 1;
  font-size: 14px !important;
}
.sticky_remains_table thead tr:first-child th {
  top: 0;
}
.sticky_remains_table thead tr th {
  top: 83px
}
</style>
