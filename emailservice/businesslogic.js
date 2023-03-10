
    const db = require("./db.js");

    ///////////////////USER////////////////////////

    const createUser = async function (user) {
        console.log("Tyring to create user ", user);
        const database = await db.connectDatabase();
        const result = await database.collection("Users").insertOne(user);
        return result;
    };

   const  updateUser = async function (user) {
        ("Tyring to update user ", user)
        //check if username and password are correct and match the user id
        const database = await db.connectDatabase();
        const result = await database
            .collection("Users")
            .updateOne({ userId: user.userId }, { $set: user });
        return result;
    };

   const deleteUser = async function (userIdJSON) {
        console.log("Tyring to delete user with id:", userIdJSON.userId);
        const database = await db.connectDatabase();
       //delete the user delete the journals and entries associated with the user
       const result = await database.collection("Users").deleteOne({ userId: userIdJSON.userId });


        //find all journals with the userId and delete them
        const journals = await database.collection("Journals").find({ userId: userIdJSON.userId }).toArray();
     
        for (let i = 0; i < journals.length; i++) {
            const journalId = journals[i].journalId;
            await database.collection("Journals").deleteOne({ journalId: userIdJSON.userId });
        }

        //find all entries with the userId and delete them
        const entries = await database.collection("Entries").find({ userId: userIdJSON.userId }).toArray();
      
        for (let i = 0; i < entries.length; i++) {
            const entryId = entries[i].entryId;
            await database.collection("Entries").deleteOne({ entryId: entryId });
        }
        console.log("result:", result);
        return result;
        
    };


    ///////////////////JOURNAL////////////////////////

    const createJournal = async function (journal) {
        console.log("Tyring to create journal ", journal);
        const database = await db.connectDatabase();
        const result = await database.collection("Journals").insertOne(journal);
        //add the journal to the user bu the user id
        await database
            .collection("Users")
            .updateOne({ userId: journal.userId }, { $push: { journals: journal.journalId } });
        

        return result;
    };

    const updateJournal = async function (journal) {
        console.log("Tyring to update journal with id:", journal);
        const database = await db.connectDatabase();
        const result = await database
            .collection("Journals")
            .updateOne({ journalId: journal.journalId }, { $set: journal });
        return result;
    };

    const deleteJournal = async function (journalIdJson) {
        console.log("Tyring to delete journal with id:", journalIdJson.journalId);
        const database = await db.connectDatabase();
        //delete the journal and delete the entries associated with the journal
        const result = await database.collection("Journals").deleteOne({ journalId: journalIdJson.journalId });   
        //find all entries with the journalId and delete them
        const entries = await database.collection("Entries").find({ journalId: journalIdJson.journalId }).toArray();
        for (let i = 0; i < entries.length; i++) {
            await database.collection("Entries").deleteOne({ entryId: entries[i].entryId });
        }
        //find the user and remove the journal from the user
        await database
            .collection("Users")
            .updateOne({ journals: journalIdJson.journalId }, { $pull: { journals: journalIdJson.journalId } });

        return result;
    };

    ///////////////////ENTRY////////////////////////
     
    const createEntry = async function (entry) {
        console.log("Tyring to create entry ", entry);
        const database = await db.connectDatabase();
        const result = await database.collection("Entries").insertOne(entry);
        //add the entry to the journal by the journal id
        await database
            .collection("Journals")
            .updateOne({ journalId: entry.journalId }, { $push: { entries: entry.entryId } });
        return result;
    };

    const updateEntry = async function (entry) {
        console.log("Tyring to update entry with id:", entry);
        const database = await db.connectDatabase();
        const result = await database
            .collection("Entries")
            .updateOne({ entryId: entry.entryId }, { $set: entry });
        return result;
    };

    const deleteEntry = async function (entryIdJson) {
        console.log("Tyring to delete entry with id:", entryIdJson.entryId);
        const database = await db.connectDatabase();
        //delete the entry
        const result = await database.collection("Entries").deleteOne({ entryId: entryIdJson.entryId});
        //find the journal and remove the entry from the journal
        await database
            .collection("Journals")
            .updateOne({ entries: entryIdJson.entryId }, { $pull: { entries: entryIdJson.entryId } });
        return result;
    };

    



module.exports = { createUser, updateUser, deleteUser, createJournal, updateJournal, deleteJournal, createEntry, updateEntry, deleteEntry };