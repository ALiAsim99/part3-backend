const express=require('express')
const morgan=require('morgan')
const cors=require('cors')
const mongoose = require('mongoose')

const app=express()

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('dist'))


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


let persons=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(req,res)=>{
    Person.find({}).then(persons=>{
        response.json(persons)
    })
})

app.get('/info',(req,res)=>{
    res.send(`<p>Phonebook has infor for ${persons.length} people`)
})

app.get('/api/persons/:id',(req,res)=>{
    const id=Number(req.params.id);
    const person=persons.find(p=>p.id==id)
    
    if(!person){
        res.status(404).end()
    }else{    
        res.json(person)
    }
})

app.delete('/api/persons/:id',(req,res)=>{
    const id=Number(req.params.id);
    persons=persons.filter(p=>p.id!==id)
    res.status(404).end()
})

app.post('/api/persons',(req,res)=>{
    const body=req.body;
    if(!body.content || !body.number){
       return res.status(404).json({
            error: 'content missing' 
        })
    }
    if(persons.find(p=>p.name==body.name)){
        return res.status(404).json({
            error:'name must be unique'
        })
    }
    const person={
        name:body.name,
        number:body.number,
        id:generateId()
    }
    persons=persons.concat(person)
    res.json(persons.concat(persons))
})

const generateId=()=>{
    const maxId=persons.length>0?Math.max(...persons.map(p=>p.id)):0;

    return maxId+1;
}

morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT,()=>{
    console.log('running on port')
})