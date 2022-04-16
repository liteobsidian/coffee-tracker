<template lang="pug">
  .fullscreen.text-primary.text-center.q-pa-md.flex.flex-center
    div
      .div(style="font-size: 30vh") 404
      .text-h2.text-teal(style="opacity:.4") Страница не найдена
      q-btn.q-mt-xl(
        color="primary"
        outline
        @click='$router.push("/")'
        label="На главную"
        no-caps
      )
</template>

<script>
export default {
  name: 'Error404'
}
</script>
