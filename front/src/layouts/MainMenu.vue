<template lang="pug">
  q-drawer.flex(
    :value='value'
    @input='$emit("input", $event)'
    side='left'
    fit
    show-if-above
    bordered
  )
    q-list
      q-item.flex(style='height: 190px; background: center/cover no-repeat url("img/profile_section_bg.webp")')
        .row.fa-align-center
          .col-12
            q-item-section(avatar)
              q-avatar(color='white' style='height: 60px; width: 60px;')
                span.text-primary {{ profile.name ? profile.name.split(' ').map(el => el[0]).join('') : '' }}
            h6.q-mb-none.q-mt-xs.text-white {{ profile.name }}
    q-list(padding).text-teal-10
      q-item(
        v-for='(item,index) in $options.menu'
        :key='index'
        clickable
        :to=`item.path`
      )
        q-item-section(avatar)
          q-icon(:name='item.icon' class='text-primary' size='1.5rem')
        q-item-section
          q-item-label.barnaul-bold {{ item.title }}
        q-tooltip {{ item.label }}
      q-separator
      // самый простой способ скрыть меню
      q-item(clickable to='users' v-if='false')
        q-item-section(avatar)
          q-icon(name='chart' class='text-primary' size='1.5rem')
        q-item-section
          q-item-label.barnaul-bold Панель администратора
        q-tooltip Просмотр аналитической информации по загруженным отчётам
    div.absolute-bottom(style='padding-bottom: 10px')
      q-separator.q-my-sm
      q-list
        q-item(clickable @click='logout')
          q-item-section(avatar)
            q-icon.text-primary(name='logout' size='1.5rem')
          q-item-section
            q-item-label.text-teal-10 Выход
          q-tooltip Выход из программы
</template>

<script>
import { systemLogout } from '@mixins'
import { MAIN_MENU } from '@assets/menus'
import { mapGetters } from 'vuex'
export default {
  name: 'MainMenu',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({ profile: 'auth/getProfile' })
  },
  menu: MAIN_MENU,
  mixins: [systemLogout]
}
</script>
