const mongoose = require('mongoose')


const password = process.argv[2]

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
const url =
  `mongodb+srv://fullstack:${password}@cluster0.kkhvl.mongodb.net/person?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})
if (process.argv.length == 5) {
    person.save().then(response => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
    })
}

if (process.argv.length==3) {
  Person.find({}).then(result => {
      result.forEach(person => {
          console.log(person)
      })
    mongoose.connection.close()
  })
  
  

}
