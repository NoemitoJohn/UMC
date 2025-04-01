const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const front_img_id = document.getElementById('front_id')
const back_img_id = document.getElementById('back_id')
const profile = document.getElementById('profile')
const full_name = document.getElementById('full_name')
const e_name = document.getElementById('e_name')
const e_number = document.getElementById('e_number')
const position = document.getElementById('position')
const email = document.getElementById('email')
const contact_number = document.getElementById('contact_number')
const address = document.getElementById('address')
const print_btn = document.getElementById('print_btn')

canvas.width = front_img_id.width + back_img_id.width;
canvas.height = front_img_id.height;

ctx.drawImage(front_img_id, 0, 0)
ctx.drawImage(back_img_id, front_img_id.width + 2, 0)

const x = 148, y = 279, 
width = profile.width , height = profile.height, 
radius = 55;

ctx.font = "bold 25px serif";
ctx.fillText(e_name.value, 
  back_img_id.width + 2 + getCenterText(back_img_id.width, ctx.measureText(e_name.value).width ),
  295
)


ctx.font = "23px serif";
ctx.fillText(
  e_number.value, 
  back_img_id.width + 2 + getCenterText(back_img_id.width, ctx.measureText(e_number.value).width ),
  295 + 30
)

ctx.font = "47px serif";
ctx.fillText(full_name.value, 
  getCenterText(front_img_id.width, ctx.measureText(full_name.value).width),
  660
)

ctx.font = "40px serif";
ctx.fillText(position.value, 
  getCenterText(front_img_id.width, ctx.measureText(position.value).width),
  728
)

ctx.font = "23px serif";
ctx.fillText(
  email.value, 
  front_img_id.width + 2 + 265,
  670
)

ctx.fillText(
  address.value, 
  front_img_id.width + 2 + 265,
  723,
  300
)

ctx.fillText(
  contact_number.value, 
  front_img_id.width + 2 + 265,
  768
)

ctx.beginPath();
ctx.moveTo(x + radius, y);
ctx.lineTo(x + width - radius, y);
ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
ctx.lineTo(x + width, y + height - radius);
ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
ctx.lineTo(x + radius, y + height);
ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
ctx.lineTo(x, y + radius);
ctx.quadraticCurveTo(x, y, x + radius, y);
ctx.closePath();
ctx.clip();

ctx.drawImage(profile, x, y,)


function getCenterText(base , text){
  return (base / 2) - (text / 2)
}


print_btn.addEventListener('click',() =>  {
  const link = document.createElement('a')
  link.download = `${full_name.value}-ID.png`
  link.href = canvas.toDataURL()
  link.click()
})