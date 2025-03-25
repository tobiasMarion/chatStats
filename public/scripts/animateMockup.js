gsap.registerPlugin(ScrollTrigger)

async function substituteMockup(imgElement) {
  await SVGInject(imgElement)

  if (innerWidth > 768) {
    setAnimation()
  }
}

function setAnimation() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#mockup',
      start: 'top 50%',
      end: 'bottom 80%',
      scrub: 1,
      // markers: true
    }
  })

  tl.fromTo('.paper', {opacity: 1}, { y: -128, opacity: 0, scale: 0.75, x: '12.5%', duration: 2 })
  tl.fromTo('.ui', { opacity: 0 }, { opacity: 1, duration: 1 }, "-=.5")
  tl.fromTo('.chart', { clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1 }, "-=0.5")
}