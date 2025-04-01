


const table = new DataTable('#users_table', {
  columnDefs: [
    {
      target: 0,
      visible: false,
      searchable: false,
    },
  ]
})

table.on('click', 'td', function(e) {
  const tr = e.target.closest('tr')
  const row = table.row(tr)
  const id = row.data()[0]
  const link = document.createElement('a')

  link.href = `/admin/users/print/${id}`

  link.setAttribute('target', '_blank')

  link.click()

  link.remove()
})

function initCanvas() {
  canvas.width = front_img_id.width + back_img_id.width;
  canvas.height = front_img_id.height;

  ctx.drawImage(front_img_id, 0, 0)
  ctx.drawImage(back_img_id, front_img_id.width + 2, 0)

}
// console.log()
// initCanvas()
// ctx.drawImage(front_img_id, 0, 0)