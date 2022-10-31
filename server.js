const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 5001
const { db } = require('./firebasev.js')

app.use(express.json())

const types = {
    'dell': 'type',
    'hp': 'type',
    'lenovo': 'type',
    'color': 'black',
}

app.get('/types', async (req, res) => {
    const peopleRef = db.collection('laptop').doc('brands')
    const doc = await peopleRef.get()
    if (!doc.exists) {
        return res.sendStatus(400)
    }

    res.status(200).send(doc.data())
})

app.get('/types/:name', (req, res) => {
    const { name } = req.params
    if (!name || !(name in types)) {
        return res.sendStatus(404)
    }
    res.status(200).send({ [name]: types[name] })
})

app.post('/addtype', async (req, res) => {
    const { name, status } = req.body
    const peopleRef = db.collection('laptop').doc('brands')
    const res2 = await peopleRef.set({
        [name]: status
    }, { merge: true })
    res.status(200).send(types)
})

app.patch('/changestatus', async (req, res) => {
    const { name, newStatus } = req.body
    const peopleRef = db.collection('laptop').doc('brands')
    const res2 = await peopleRef.set({
        [name]: newStatus
    }, { merge: true })
    res.status(200).send(types)
})

app.delete('/types', async (req, res) => {
    const { name } = req.body
    const peopleRef = db.collection('laptop').doc('brands')
    const res2 = await peopleRef.update({
        [name]: FieldValue.delete()
    })
    res.status(200).send(types)
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))