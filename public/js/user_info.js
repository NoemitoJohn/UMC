let cropper = null

$(document).ready(function() {

  const edit_id_btn = $('#edit_id_1x1');
  const view_id_btn = $('#view_id_1x1');
  const crop_container_1x1 = $('#crop_container_1x1');
  const crop_view_container_1x1 = $('#crop_view_container_1x1');
  const user_form_info = $('#user_form_info')
  
  const region_select = $(`select[name='region_code']`).selectize({
    valueField: 'code',
    labelField: 'name',
    searchField: 'name',
    onInitialize : function() {
      axios.get('https://psgc.gitlab.io/api/island-groups/mindanao/regions/')
      .then(response => {
        let selected_value = ''

        if(this.items.length > 0) {
          selected_value = this.items[0]
        }
        
        this.clear();
        
        this.clearOptions()
        
        this.addOption(response.data)

        if(selected_value) {
          this.setValue(selected_value, true)
        }

      })
      
    },

  }).get(0).selectize

  
  const provinces_select = $(`select[name='province_code']`).selectize({
    valueField: 'code',
    labelField: 'name',
    searchField: 'name',
    onInitialize : function() {
      
      if(!region_select.getValue()){
        return
      }
      axios.get(`https://psgc.gitlab.io/api/regions/${region_select.getValue()}/provinces/`)
      .then(response => {
        let selected_value = ''

        if(this.items.length > 0) {
          selected_value = this.items[0]
        }

        this.clear();
        
        this.clearOptions()
        
        this.addOption(response.data);
        if(selected_value) {
          this.setValue(selected_value, true)
        }
        // provinces_select.enable();
      })
    },
  }).get(0).selectize

  const cities_select = $(`select[name='city_code']`).selectize({
    valueField: 'code',
    labelField: 'name',
    searchField: 'name',
    onInitialize : function() {
      
      if(!provinces_select.getValue()) {
        return;
      }

      axios.get(`https://psgc.gitlab.io/api/provinces/${provinces_select.getValue()}/cities-municipalities/`)
      .then(response => {
        let selected_value = ''

        if(this.items.length > 0) {
          selected_value = this.items[0]
        }

        this.clear();
        
        this.clearOptions()
        
        this.addOption(response.data);
        
        if(selected_value) {
          this.setValue(selected_value, true)
        }
        // provinces_select.enable();
      })
    }
  }).get(0).selectize

  const barangay_select = $(`select[name='barangay_code']`).selectize({
    valueField: 'code',
    labelField: 'name',
    searchField: 'name',
    onInitialize : function() {
      if(!cities_select.getValue()){
        return
      }

      axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${cities_select.getValue()}/barangays/`)
      .then(response => {
        let selected_value = ''

        if(this.items.length > 0) {
          selected_value = this.items[0]
        }

        this.clear();
        
        this.clearOptions()
        
        this.addOption(response.data);
        if(selected_value) {
          this.setValue(selected_value, true)
        }
      })
    
    },
  }).get(0).selectize

  $(`select[name='local_church']`).selectize({
    persist: true,
    valueField: 'id',
    labelField: 'name',
    searchField: 'name',
    onInitialize : function () {
      axios.get('/church').then((res)=> {
        let selected_value = ''

        if(this.items.length > 0) {
          selected_value = this.items[0]
        }
        this.clear();
        
        this.clearOptions()
        this.addOption(res.data)
        if(selected_value){
          this.setValue(selected_value, true)
        }
      })
    },

    create : function(input, callback) {
      axios.post('/church', { name : input })
        .then(res => { 
          callback(res.data) }).catch(() => callback())
    }
  })

  $(`select[name='episcopal_area']`).selectize({
    persist: true,
    valueField: 'id',
    labelField: 'name',
    searchField: 'name',
    onInitialize : function () {
      axios.get('/church/episcopal_area').then((res)=> {
        let selected_value = ''

        if(this.items.length > 0) {
          selected_value = this.items[0]
        }
        this.clear();
        
        this.clearOptions()

        this.addOption(res.data)
        if(selected_value){
          this.setValue(selected_value, true)
        }
      })
    },
    create : function(input, callback) {
      axios.post('/church/episcopal_area', { name : input })
        .then(res => { callback(res.data) }).catch(() => callback())
    }
  })

  $(`select[name='annual_conference']`).selectize({
    persist : true,
    valueField: 'id',
    labelField: 'name',
    searchField: 'name',
    onInitialize : function () {
      axios.get('/church/annual_conference').then((res)=> {
        let selected_value = ''

        if(this.items.length > 0) {
          selected_value = this.items[0]
        }
        this.clear();
        
        this.clearOptions()

        this.addOption(res.data)
        if(selected_value){
          this.setValue(selected_value, true)
        }
      })
    },

    create : function (input, callback) {
      axios.post('/church/annual_conference', { name : input })
      .then(res => { callback(res.data) }).catch(() => callback())
    }
  })
  
  $(`select[name='district_conference']`).selectize({
    persist : true,
    valueField: 'id',
    labelField: 'name',
    searchField: 'name',
    onInitialize : function () {
      axios.get('/church/district_conference').then((res)=> {
        let selected_value = ''

        if(this.items.length > 0) {
          selected_value = this.items[0]
        }

        this.clear();
        
        this.clearOptions()

        this.addOption(res.data)

        if(selected_value){
          this.setValue(selected_value, true)
        }
      })
    },

    create : function (input, callback) {
      axios.post('/church/district_conference', { name : input })
      .then(res => { callback(res.data) }).catch(() => callback())
    }
  })


  region_select.on('change', function (region_code, e)  {
    
    if(!region_code) { return; } 
    provinces_select.disable();
    provinces_select.clear();
    provinces_select.clearOptions();
    axios.get(`https://psgc.gitlab.io/api/regions/${region_code}/provinces/`)
      .then(response => {
        provinces_select.addOption(response.data);
        
        provinces_select.enable();
      })
  })
    
  provinces_select.on('change', (province_code) => {
    if(!province_code) { return; }
    cities_select.disable()
    cities_select.clear()
    cities_select.clearOptions()

    axios.get(`https://psgc.gitlab.io/api/provinces/${province_code}/cities-municipalities/`)
      .then(response => {
        // provinces_select.addOption(response.data)
        cities_select.addOption(response.data)
        cities_select.enable()


      })
  })
  
  cities_select.on('change', (city_code) => {
    if(!city_code) { return }
    barangay_select.disable()
    barangay_select.clear()
    barangay_select.clearOptions()
    
    axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${city_code}/barangays/`)
    .then(response => {
      
      // provinces_select.addOption(response.data)
      barangay_select.enable()
      barangay_select.addOption(response.data)
    })
    // https://psgc.gitlab.io/api/cities/104305000/barangays/
  })
  
  user_form_info.submit(function(e){
    e.preventDefault()
    
    const formData = new FormData(this);
    const pic_1x1 = formData.has('pic_1x1');
    
    const region_name = region_select.getOption(region_select.getValue()).text();
    const province_name = provinces_select.getOption(provinces_select.getValue()).text();
    const city_name = cities_select.getOption(cities_select.getValue()).text();
    const barangay_name = barangay_select.getOption(barangay_select.getValue()).text();
    
    formData.append('region_name', region_name)
    formData.append('province_name', province_name)
    formData.append('city_name', city_name)
    formData.append('barangay_name', barangay_name)


    if(cropper && pic_1x1) {
      
      const crop = cropper.getCroppedCanvas({width : 320, height : 180});
      
      formData.delete('pic_1x1');
      
      crop.toBlob((blob) => {
        formData.append('id_img_1x1', blob);
        axios.post('/user/info', formData).then(function(response) {
          // success
          if(response.status === 200) {
            window.location.replace('/admin/users')
            return
          }
            
          // error
          
        }).catch(err => {
          console.log(err)
        })
         
      })
    }
  })
  
  edit_id_btn.click(function() {
    crop_container_1x1.addClass('modal-open')
  })

  view_id_btn.click(function() {
    if(!cropper) {
      return;
    }

    const crop_data_canvas = cropper.getCroppedCanvas({width : 320, height : 180});

    crop_view_container_1x1
      .find('div.modal-box > div#img_container')
      .empty()
      .append(crop_data_canvas);

    crop_view_container_1x1.addClass('modal-open');
  })

  $('#pic_1x1').change(function(e){
    
    if(e.target.files <= 0) {
      return;
    }

    const file = e.target.files[0];
    const image = new Image()
    
    edit_id_btn.prop('disabled', false)
    view_id_btn.prop('disabled', false)

    image.src = URL.createObjectURL(file)
    image.classList.add('max-w-full')
  
    image.onload = function() {
      // bind events???
      bindCropper(this)
    }

    const temp_img = $('#crop_container_1x1 > div.modal-box > div#img_container')
    temp_img.empty();
    
    $(image).appendTo(temp_img)
    

  })
  
  $('.modal_close').click(function(e) {
    $(e.target).parents('dialog').removeClass('modal-open');
  })
}) 


function bindCropper(imageElement) {
  const modal_crop_btn = $('#modal_crop_btn');

  cropper = new Cropper(imageElement, {aspectRatio : 1})

  $(modal_crop_btn).click(function(){
    
    if(!cropper) {
      return console.log('No crop img selected')
    }
    
    const crop_data = cropper.getCroppedCanvas()
    console.log(crop_data)
  })
}

function canvasToBlobs(canvas) {
  return new Promise((resolve, reject) => {
    if(canvas) {
      canvas.toBlob((b) => {
        if(b) { resolve(b) }
        reject
      })
    }
    else { reject }

  })
}
