const header = document.querySelector('.header')
const sections = document.querySelectorAll('section')
const navLinks = document.querySelectorAll('.header nav ul li a')

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY
  // Toogle header shadow
  if (scrollPosition > 0) {
    header.classList.remove('border-transparent')
    header.classList.add('border-slate-200', 'drop-shadow-sm')
  } else {
    header.classList.remove('border-slate-200', 'drop-shadow-sm')
    header.classList.add('border-transparent')
  }

  sections.forEach((section, index) => {
    const { offsetTop, offsetHeight } = section

    const isVisible = (scrollPosition >= offsetTop - 256) && (scrollPosition < offsetTop + offsetHeight - 256)

    if (isVisible) {
      navLinks[index].classList.remove('after:w-0')
      navLinks[index].classList.add('font-medium', 'text-slate-700', 'after:w-full')
    } else {      
      navLinks[index].classList.add('after:w-0')
      navLinks[index].classList.remove('font-medium', 'text-slate-700', 'after:w-full')
    }
  })
})