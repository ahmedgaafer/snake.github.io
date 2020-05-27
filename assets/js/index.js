
window.onload = () => {

  setInterval(() => {
    document.getElementById('snake-logo').classList.toggle('shake-bottom')
  }, 3000)

  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseover', () => {
      new Howl({
        src: ['assets/sounds/hover.mp3']
      }).play()
    })
  })
}

