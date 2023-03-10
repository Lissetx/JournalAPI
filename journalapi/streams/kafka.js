const {Kafka} = require('kafkajs')
const brokerAddress = process.env.BROKER_SERVER_ADDRESS
const journalapiTopic = process.env.JOURNALAPI_TOPIC

const kafka = new Kafka({
    brokers: [brokerAddress],
    clientId: 'journalapi-producer'
})

const producer = kafka.producer()


///////////////////////////USER////////////////////////////

async function postCreateUser(userEvent, user){
    await producer.connect()
    producer.send({
        topic: journalapiTopic,
        messages: [
        {
            key: userEvent,
            value: JSON.stringify(user)
        }
        ]
    })
}


async function patchUpdateUser(userEvent,  user){
    
    //send id and user to journalapi

    await producer.connect()
    producer.send({
        topic: journalapiTopic,
        messages: [
        {
            key: userEvent,
            value: JSON.stringify(user)
        }
        ]
    })


}

async function deleteUser(userEvent, userId){
    console.log("delete user event")
    await producer.connect()
    producer.send({
        topic: journalapiTopic,
        messages: [
        {
            key: userEvent,
            value: JSON.stringify(userId)
        }
        ]
    })
}

///////////////////////////JOURNAL////////////////////////////

async function patchUpdateJounral(journalEvent, journal){
    await producer.connect()
    producer.send({
        topic: journalapiTopic,
        messages: [
        {
            key: journalEvent,
            value: JSON.stringify(journal)
        }
        ]
    })
}

async function deleteJournal(journalEvent, journal){
    await producer.connect()
    producer.send({
        topic: journalapiTopic,
        messages: [
        {
            key: journalEvent,
            value: JSON.stringify(journal)
        }
        ]
    })
}

async function postCreateJournal(journalEvent, journal){
    await producer.connect()
    producer.send({
        topic: journalapiTopic,
        messages: [
        {
            key: journalEvent,
            value: JSON.stringify(journal)
        }
        ]
    })
}

///////////////////////////ENTRY////////////////////////////

async function postCreateEntry(entryEvent, entry){
    await producer.connect()
    producer.send({
        topic: journalapiTopic,
        messages: [
        {
            key: entryEvent,
            value: JSON.stringify(entry)
        }
        ]
    })
}

async function patchUpdateEntry(entryEvent, entry){
    await producer.connect()
    producer.send({
        topic: journalapiTopic,
        messages: [
        {
            key: entryEvent,
            value: JSON.stringify(entry)
        }
        ]
    })
}

async function deleteEntry(entryEvent, entry){
    await producer.connect()
    producer.send({
        topic: journalapiTopic,
        messages: [
        {
            key: entryEvent,
            value: JSON.stringify(entry)
        }
        ]
    })
}








//consumer code





module.exports = {postCreateJournal, deleteEntry, postCreateEntry, patchUpdateEntry, deleteJournal, patchUpdateJounral, deleteUser, patchUpdateUser, postCreateUser};