export default function displayData(data) {
    const divs = document.querySelectorAll('.landing, .results')

    data.forEach((person, index) => {
        const avatar = document.querySelector(`article[data-person='${index}'] header img`)
        let src = `https://avatars.dicebear.com/api/big-smile/${person.name}.svg`
        if (index % 2 == 1) {
            src += '?flip=true'
        }
        avatar.src = encodeURI(src)

        const simpleStats = ['name', 'messages', 'characters', 'bigMessages']

        for (const key in person) {
            if (simpleStats.includes(key)) {
                const element = document.querySelector(`article[data-person='${index}'] *[data-stats='${key}']`)
                
                if (typeof person[key] == 'number') {
                    element.innerHTML = person[key].toLocaleString('pt-BR')
                } else {
                    element.innerHTML = person[key]
                }
            }
        }
    })


    divs.forEach(element => {
        element.classList.toggle('hidden')
    })
}