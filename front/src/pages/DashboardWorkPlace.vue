<template lang='pug'>
  div
    q-card.work-place.q-pt-none.q-px-md(flat)
      q-card-section.full-height
        .row
          .col-12
            .text-h5.text-teal.q-my-sm {{$route.name}}
        .row(style='padding-top: 200px')
          .col
            .row.flex-center
              q-spinner-pie(color='primary' size='10em')
            h6.text-primary.text-center Графики не обнаружены, загрузите отчёты или попробуйте позже
</template>

<script>

export default {
  name: 'DashboardWorkPlace'
}
</script>
