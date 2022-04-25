<template lang='pug'>
  div
    q-card.work-place.q-pt-none.q-px-md(flat)
      q-card-section
        .row
          .col-12
            .text-h5.text-teal.q-my-sm {{$route.name}}
        q-splitter.storage_splitter(v-model='splitterModel')
          template(v-slot:before='')
            q-tabs.text-teal(v-model='tab' vertical active-class='text-primary')
              q-tab(name='storage' icon='inventory_2' label='Склад')
              q-tab(name='request' icon='local_shipping' label='Заявки')
              q-tab(name='invent' icon='inventory' label='Инвентаризация')
          template(v-slot:after='')
            q-tab-panels(v-model='tab' animated='' swipeable='' vertical='' transition-prev='jump-up' transition-next='jump-up')
              q-tab-panel(name='storage')
                storage-tab
              q-tab-panel(name='request')
                request-tab
              q-tab-panel(name='invent')
                invent-tab
</template>

<script>
import StorageTab from '@components/tabs/StorageTab'
import RequestTab from '@components/tabs/RequestTab'
import InventTab from '@components/tabs/InventTab'

export default {
  name: 'StorageWorkPlace',
  props: {
    listType: {
      type: String,
      default: 'storage'
    }
  },
  data () {
    return {
      tab: 'storage',
      splitterModel: 15
    }
  },
  components: { StorageTab, RequestTab, InventTab }
}
</script>

<style>
.storage_splitter {
  height: calc(100vh - 160px);
  width: 100%;
}
</style>
