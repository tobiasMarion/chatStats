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

const howToButtons = document.querySelectorAll('#how-to-use nav ul li button')
const steps = document.querySelectorAll('#how-to-use nav + div > ul')

howToButtons.forEach(button => button.addEventListener('click', changePlatform))

function changePlatform() {
  howToButtons.forEach((button, index) => {
    const buttonClasses = ['text-slate-600','text-slate-500', 'after:w-full', 'font-semibold']
    const stepsClasses = ['opacity-100', 'translate-y-0', 'opacity-0', 'translate-y-8', 'delay-300', 'z-[-10]']
    
    buttonClasses.forEach(buttonClass => button.classList.toggle(buttonClass))
    stepsClasses.forEach(stepClass => steps[index].classList.toggle(stepClass))
  })
}

const countNowButton = document.querySelector('#count-now-button')
countNowButton.addEventListener('click', () => {
  const label = document.querySelector('#label-file')
  
  gsap.fromTo(label, { scale: 1 },  { scale: 1.05, duration: 1, ease: "back.out(1.7)"})
})

const asqCofeeButton = document.querySelector('.asq-cofee-button')

asqCofeeButton.addEventListener('click', () => { document.querySelector('#bmc-wbtn').click() })