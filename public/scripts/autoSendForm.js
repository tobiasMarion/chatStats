const form = document.querySelector('main section form')
const fileInput = document.querySelector('#file')

fileInput.addEventListener('change', () => {
  if (fileInput.value != null) {
    form.submit()
  }
})