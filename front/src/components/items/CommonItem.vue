<template lang="pug">
  div(style='display: contents')
    q-item-section(avatar)
      q-avatar.text-primary(color='white' size='48px')
        slot(name='avatar')
    q-item-section
      q-item-label.text-subtitle1.barnaul-medium
        slot(name='title')
      q-item-label.text-body2.ellipsis(style='color: #353F76')
        slot(name='caption')
      q-item-label.text-body2.ellipsis.text-teal(v-if='additionalLabel' style='color: #f3745a')
        slot(name='additional')
    q-item-section(side v-if='ismark &&!ismenu')
      q-icon(name='check_box_outline_blank' @click.stop='')
    q-item-section(side v-if='ismenu')
      q-btn(color='primary' flat round icon='more_vert' @click.stop='')
        slot(name='menu')
</template>

<script>
export default {
  name: 'CommonItem',
  props: {
    ismenu: {
      type: Boolean,
      default: false
    },
    ismark: {
      type: Boolean,
      default: false
    },
    openpath: {
      type: String,
      default: ''
    },
    addpath: {
      type: String,
      default: ''
    },
    additionalLabel: {
      type: Boolean,
      default: false
    }
  }
}
</script>
