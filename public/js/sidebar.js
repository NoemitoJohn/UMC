$('#sidebar').find('#logout').click(function(){
  axios.post('/auth/logout')
  .then((res) => {
    if(res.status == 200){
      window.location.replace(res.headers.location)
    }
  })
})

$('#save').click(function(){
  console.log($("input[name='birthday']").val())
})