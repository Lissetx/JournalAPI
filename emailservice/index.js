
const startJournalApiConsumer = require("./consumer.js");
const {createUser, updateUser, deleteUser, createJournal, updateJournal, deleteJournal, createEntry, updateEntry, deleteEntry} = require("./businesslogic.js");




//const user
//const pass
async function main() {
  console.log("starting email service");
  startJournalApiConsumer(handleEvent);


}

function handleEvent(eventMessage){
  var key = eventMessage.key.toString();
  var data = JSON.parse(eventMessage.value.toString());
  console.log("going to handler");
  switch(key){
    case "userCreated":
      createUser(data);
      break;
    case "userUpdated":
      updateUser(data);
      break;
    case "userDeleted":
      deleteUser(data);
      break;
    case "journalCreated":
      createJournal(data);
      break;
    case "journalUpdated":
      updateJournal(data);
      break;
    case "journalDeleted":
      deleteJournal(data);
      break;
    case "entryCreated":
      createEntry(data);
      break;
    case "entryUpdated":
      updateEntry(data);
      break;
    case "entryDeleted":
      deleteEntry(data);
      break;
    
}
}




      



main().catch(console.error);
