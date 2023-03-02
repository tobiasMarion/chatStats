const form = document.querySelector('.form')
const loading = document.querySelector('.loading')
const fileInput = document.querySelector('#file')

fileInput.addEventListener('change', () => {
  if (fileInput.value != null) {
    form.classList.add('hidden')
    loading.classList.remove('hidden')
    form.submit()
  }
})