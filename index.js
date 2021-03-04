const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person.js')
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('json', (req, res) => {
    return `${JSON.stringify(req.body)}`
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

let persons = [
    
]
/*Person.find({}).then(resp => {
    resp.forEach(person => {
        persons.push(person)
    })
})*/
const info = `Phonebook has info for ${persons.length}.\n ${new Date()}`

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people.map(person => person.toJSON()))
    })   
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
        response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
    /*const id = Number(request.params.id)
    const body = request.body

    persons = persons.filter(person => person.id !== id)
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }
    persons = persons.concat(person)
    response.json(person)*/
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
}) 

app.delete('/api/persons/:id', (request, response) => {
    /*const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()*/
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
})

app.post('/api/persons', (request, response) => {
    /*const id = Math.floor(Math.random() * 10000)
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
    response.json(person)*/

    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({error: 'Name/number missing'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})




app.get('/info', (request, response) => {
    response.send(info)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(persons)
    console.log(`server is running on port ${PORT}`)})