process.on('message', msg => {
    let quantity = msg

    console.log('quantity: ', quantity)
    let numbers = []
    for (let i = 0; i <= quantity; i++) {
        let randomNumbers = Math.floor((Math.random() * (1000 - 1 + 1)) + 1)
        let search = numbers.findIndex(random => random.numb == randomNumbers)
        if (search >= 0) {
            numbers[search].quantity++
        } else {
            numbers.push({
                number: randomNumbers,
                quantity: 1
            })
        }

    }

    const sorting = numbers.sort((a, b) => a.numb - b.numb)

    process.send(sorting)
    process.exit()
})

process.send('done')