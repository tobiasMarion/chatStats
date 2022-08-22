import formatMessages from './formatData.js'
import getData from './getData.js'


const input = document.querySelector('#file')

input.addEventListener('change', async ({ target }) => {
  const start = Date.now()
  let text = await target.files[0].text()

  text = text.replace(/\u200e/g, '')

  if (!text) { return }

  const messages = formatMessages(text)

  const data = getData(messages)

  const delay = (Date.now() - start) / 1000

  console.log(data)
  console.log(`Total de mensagens: ${messages.length}`)
  console.log(`Tempo de Execução: ${delay.toFixed(2)} segundos`)
  console.log(`Mensagens analisadas por segundo: ${(messages.length / delay).toFixed(2)}`)
})