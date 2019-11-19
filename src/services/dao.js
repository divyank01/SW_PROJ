import {MongoClient} from 'mongodb'
import mongojs from 'mongojs'

const uri = "mongodb+srv://meggi:megha123@cluster0-runta.mongodb.net/test?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true,keepAlive:true })
const DB = `LetUsCare`

const TYPES_PK = {
    User:'userId',
    NGO:'ngoId',
    Login:'loginId',
    Events: 'eventId',
    Interest: `interestId`
}

export default {
    save:async (type,data) => {
        await client.connect()
        const db = client.db(DB)
        const seq = await db.collection('Sequence').find({}).toArray()
        const payload = {
            ...data,
            [TYPES_PK[type]]:seq[0][type.toLowerCase()]
        }
        const _seq = {
            ...seq,
            [type.toLowerCase()]:seq[0][type.toLowerCase()]+1
        }
        await db.collection(type).insert(payload)
        await db.collection('Sequence').update({_id:"0"},{'$set':{[type.toLowerCase()]:seq[0][type.toLowerCase()]+1}})
        return payload
    },
    get:async (type,filter) => {
        await client.connect()
        const db = client.db(DB)
        console.log(`finding by ${JSON.stringify(filter)}`)
        const out = await db.collection(type).find(filter).toArray()
        return out[0]
    },
    getAll:async (type,filter) => {
        await client.connect()
        const db = client.db(DB)
        const out = await db.collection(type).find(filter).toArray()
        return out
    },
    update:async (type,data,id) => {
        await client.connect()
        const db = client.db(DB)
        console.log(`budating by ${JSON.stringify(id)}`)
        await db.collection(type).update({[TYPES_PK[type]]:parseInt(id)},{'$set':data})
    },
}