$('button').click( function buttonClicked (e) {
  e.preventDefault()
  var $this = $(this)
  $.ajax({
    type: 'GET',
    url: '/exec/' + $this.data('name') + '/' + $this.data('command'),
    success: function (data) {
      console.log(data)
    }
  })
})
