const template = $('.tooltip-error-template')

let cleanup = null;

$('input').each(function(i){

  const temp = template.clone().removeAttr('hidden').addClass(`clone hidden target_${this.name}`).get(0)
  
  cleanup = FloatingUIDOM.autoUpdate(this, temp, () => {
    
    FloatingUIDOM.computePosition(this, temp, {
      placement: 'right',
    }).then(({x,y}) => {
        Object.assign(temp.style, {
          left: `${x}px`,
          top: `${y}px`,
        })
      })

  })
    $('#tooltip-error-container').append(temp)

  $(this).focus(function() {
    if($(this).parent().hasClass('input-error')){
      $(this).parent().removeClass('input-error')
    }

    $('#tooltip-error-container > div.tooltip-error-template').addClass('hidden')
  })
})

// register handler
$('#register_form').submit(function(e){
  
  e.preventDefault()

  axios.post('/auth/register', this, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {

    if(!res.data.success) {
      const errors = res.data.errors
      showInputErrorPopup(errors)
      return
    }

    // success HERE
    if(cleanup) { cleanup() }
    window.location.replace(res.headers.location)

  })
  .catch((res) => {

  })


})

function showInputErrorPopup(errors){
  
  const fields = Object.keys(errors)

  for (const name of fields) {
    const input_error = $(`input[name='${name}']`)
    
    $(`#tooltip-error-container > div.target_${name}`).removeClass('hidden').text(errors[name].msg)
    
    $(input_error).parent().addClass('input-error')
    
    $('input').blur()
  }
}

// login handler
$('#login_form').submit(function(e){
  e.preventDefault()
  $('#credential_error').addClass('hidden')

  axios.post('/auth/login', this, {
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((res) => {

    const success = res.data.success
    
    if(!success && res.data.code == 'VALIDATION') {
      const errors = res.data.errors
      showInputErrorPopup(errors)
      return
    }
    
    if(!success && res.data.code == 'CREDENTIAL') {
      console.log('yawa')
      $('#credential_error').removeClass('hidden')
      return
    }

    window.location.replace(res.headers.location)
    
  }).catch(console.log)
})