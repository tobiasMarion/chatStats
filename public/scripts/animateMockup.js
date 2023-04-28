window.addEventListener('load', () => {
  gsap.registerPlugin(ScrollTrigger)

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#mockup',
      start: 'top 50%',
      end: 'bottom 80%',
      scrub: 1,
      // markers: true
    }
  })

  tl.to('.paper', { y: -128, opacity: 0, scale: 0.75, x: '12.5%', duration: 2 })
  tl.fromTo('.ui', { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.5")
  tl.fromTo('.chart', { clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1 }, "-=0.5")
})