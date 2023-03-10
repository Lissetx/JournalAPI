const {Kafka} = require('kafkajs')
const brokerAddress = "broker:29092"
const journalapiTopic = "journalapiTopic"

const kafkaconsumer = new Kafka({
    brokers: [brokerAddress],
    clientId: 'journalapi-consumer'
})
const consumer = kafkaconsumer.consumer({groupId: 'journal-consumer'})


async function startJournalApiConsumer(handler){
    await consumer.connect()
    await consumer.subscribe({topic: journalapiTopic}) //, offersAcceptedTopic, offersRejectedTopic, passwordChangedTopic
    await consumer.run({
        eachMessage: async ({topic, partition, message, heartbeat, pause }) => handler(message)
    })
}
//  async function startOfferAcceptedConsumer(handler){
//     await consumer.connect()
//     await consumer.subscribe({topic: offersAcceptedTopic})
//     await consumer.run({
//         eachMessage: async ({topic, partition, message, heartbeat, pause }) => handler(message)
//     })
//  }

//  async function startOfferRejectedConsumer(handler){
//     await consumer.connect()
//     await consumer.subscribe({topic: offersRejectedTopic})
//     await consumer.run({
//         eachMessage: async ({topic, partition, message, heartbeat, pause }) => handler(message)
//     })
//     }
//     async function startPasswordChangedConsumer(handler){
//         await consumer.connect()
//         await consumer.subscribe({topic: passwordChangedTopic})
//         await consumer.run({
//             eachMessage: async ({topic, partition, message, heartbeat, pause }) => handler(message)
//         })
//     }



// async function initializeOfferConsumer(){
//     await consumer.connect()
//     await consumer.subscribe({topic: offersTopic, fromBeginning: true})
//     await consumer.run({
//         eachMessage: async ({topic, partition, message}) => {
//             console.log({
//                 value: message.value.toString(),
//             })
//         }
//     })
// }
 module.exports = startJournalApiConsumer // startOfferAcceptedConsumer, startOfferRejectedConsumer, startPasswordChangedConsumer