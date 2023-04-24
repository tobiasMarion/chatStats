const ANIMATION_DURATION = 1000

const section = document.querySelector('#how-to-use')
const tl = anime.timeline({
  easing: 'linear',
  duration: ANIMATION_DURATION,
  autoplay: false
})

window.addEventListener('load', () => {
  tl.add({
    targets: '.paper',
    translateY: -32,
    opacity: 0,
    scale: .8,
  })

  tl.add({
    targets: '.cloud',
    opacity: 1,
  })
});

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY
  const { offsetTop, offsetHeight } = section

  const scrollPercent = scrollPosition / (offsetTop + offsetHeight) - .1

  tl.seek(scrollPercent * ANIMATION_DURATION)
})




