<template lang="pug">
  q-header.bg-white(bordered)
    q-toolbar.text-primary(style='height: 64px')
      q-btn(dense flat round icon='menu' color='teal-3' @click='$emit("toggle")')
      q-toolbar-title.barnaul-bold.text-primary(
        @click='goMain'
        style='cursor: pointer;'
      ) {{ $options.title }}
        div.text-teal.text-caption ver {{ $options.version }}
      q-space(v-if='$q.screen.gt.xs')
      //profile-avatar.q-mr-sm
      q-btn(flat round color='secondary' @click='$q.fullscreen.toggle()' :icon='$q.fullscreen.isActive ? \'fullscreen_exit\' : \'fullscreen\'')
      q-btn.q-mr-sm(flat round icon='logout' size='1.1rem' @click='logout')
        q-tooltip Выход из программы
</template>

<script>
import { systemLogout } from '@mixins'
import { version, description } from '@app/package.json'

export default {
  name: 'MainHeader',
  version: version,
  title: description,
  methods: {
    goMain () {
      if (this.$route.path !== '/users') this.$router.replace('/users')
    }
  },
  mixins: [systemLogout]
}
</script>
