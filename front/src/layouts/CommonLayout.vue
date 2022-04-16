<template lang='pug'>
  q-layout(view="lHh LpR fFf")
    main-header(
      @toggle='visible=!visible'
    )
    main-menu(
      v-model='visible'
      :menu='menu'
    )
    q-page-container.page-container
      router-view
</template>

<script>
import MainHeader from './MainHeader'
import MainMenu from './MainMenu'
export default {
  name: 'CommonLayout',
  props: {
    isRoute: {
      type: Boolean,
      default: false
    },
    menu: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false
    }
  },
  components: {
    MainHeader, MainMenu
  }
}
</script>
