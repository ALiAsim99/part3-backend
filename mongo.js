const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://ali99asim:${password}@cluster0.euqpolc.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: 'Ali Asim',
    number: '021-34567',
})

person.save().then(result => {
  console.log('note saved!')
  console.log(process[1],process[2])
  mongoose.connection.close()
})

Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })