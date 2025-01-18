$(document).ready(function() {
  
  const crop_container_1x1 = $('#crop_container_1x1')
  
  $('#user_form_info').submit(function(e){
    e.preventDefault()
    
    const formData = new FormData(this);
  
    console.log('submit')
  })
  
  
  $('#pic_1x1').change(function(e){
    if(e.target.files <= 0) {
      return;
    }
    const file = e.target.files[0];
    const image = new Image()

    image.src = URL.createObjectURL(file)
    image.classList.add('max-w-full')
    
    image.onload = () => {
      URL.revokeObjectURL(image.src)
    }
    
    const temp_img = $('#crop_container_1x1 > div.modal-box > div#img_container')
    temp_img.empty();

    temp_img.append(image)

    crop_container_1x1.addClass('modal-open');
  
  })
  
  $('#modal_close').click(function(e) {

    crop_container_1x1.removeClass('modal-open')
  })

}) 