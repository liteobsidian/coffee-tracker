<template lang="pug">
  div
    q-input.text-body1(:label='label' :value='value.name' readonly :dense='dense' @click='dialog=true&&!disable')
      template(v-slot:prepend)
        q-icon.q-mr-sm(name='map')
      template(v-slot:after)
        q-icon.cursor-pointer.q-pr-sm(name='clear' @click='!disable&&$emit("clear")')
        q-icon.cursor-pointer(name='fal fa-search' @click='dialog=true&&!disable')
    q-dialog(v-model='dialog' @show='$emit("show")' @hide='$emit("hide")')
      q-card.card_size_l
        q-card-section
          .text-h6 Выберите организацию
        q-card-section
          organization-select-list(@selected='handleSelect')
        q-card-actions(align='right')
          q-btn(icon='clear' outline color='primary' v-close-popup)
            | Закрыть
</template>

<script>
import OrganizationSelectList from './OrganizationSelectList'
export default {
  name: 'OrganizationSelectField',
  props: {
    value: {
      type: Object,
      default: () => ({
        id: '',
        name: ''
      })
    },
    label: {
      type: String,
      default: 'Оносится к группе'
    },
    disable: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    handleSelect (evt) {
      this.dialog = false
      this.$emit('input', evt)
    }
  },
  components: {
    'organization-select-list': OrganizationSelectList
  }

}
</script>
