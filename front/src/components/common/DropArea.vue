<template lang="pug">
  div.full-width.relative-position( :style='boxHeightString' @dragenter='dragEnterHandler')
    .absolute-full(
      style='z-index: 0'
      @dragenter.stop.prevent
      @dragover.stop.prevent
      @dragleave='dragLeaveHandler'
      @drop.stop.prevent='onDrop'
      ref='dropArea'
    )
    slot
</template>

<script>
export default {
  name: 'DropArea',
  props: {
    height: {
      type: Number,
      default: 300
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    boxHeightString () {
      return `height: ${this.height}px`
    }
  },
  methods: {
    dragEnterHandler (e) {
      if (this.disable) return
      this.$refs.dropArea.classList.add('drag-enter')
      e.dataTransfer.dropEffect = 'link'
    },
    dragOverHandler (e) {
      e.dataTransfer.dropEffect = 'move'
      e.returnValue = false
    },
    dragLeaveHandler () {
      this.$refs.dropArea.classList.remove('drag-enter')
    },
    onDrop (e) {
      this.$emit('drop', e.dataTransfer.files[0])
      this.$refs.dropArea.classList.remove('drag-enter')
    }
  }
}
</script>
