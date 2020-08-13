const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.json())
app.use(cors())
morgan.token('json', (req, res) => {
    return `${JSON.stringify(req.body)}`
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-55-5323523",
        id: 4
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
]

const info = `Phonebook has info for ${persons.length}.\n ${new Date()}`

app.get('/api/persons', (request, response) => {
    response.json(persons)
    }
)

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const body = request.body

    persons = persons.filter(person => person.id !== id)
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }
    persons = persons.concat(person)
    response.json(person)
}) 

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 10000)
    const body = request.body

    if (!body.name) {
        return(response.status(400).json({
            error: 'Name missing'
        }
        ))
    }
    if (!body.number) {
        return(response.status(400).json({
            error: 'Number missing'
        }))
    }
    if (persons.find(person => person.name === body.name)) {
        return(response.status(401).json({
            error: 'Name must be unique'
        }))
    }
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }

    persons = persons.concat(person)
    response.json(person)
})



app.get('/info', (request, response) => {
    response.send(info)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(persons)
    console.log(`server is running on port ${PORT}`)})