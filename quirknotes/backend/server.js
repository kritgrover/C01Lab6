import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";

const app = express();
const PORT = 4000;
const mongoURL = "mongodb://127.0.0.1:27017";
const dbName = "quirknotes";

// Connect to MongoDB
let db;

async function connectToMongo() {
  const client = new MongoClient(mongoURL);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    db = client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongo();

// Open Port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

app.use(cors());

// Collections to manage
const COLLECTIONS = {
    notes: "notes",
  };


// Get all notes available
app.get("/getAllNotes", express.json(), async (req, res) => {
  try {
    // Find notes with username attached to them
    const collection = db.collection(COLLECTIONS.notes);
    const data = await collection.find().toArray();
    res.json({ response: data });
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})
  
// Post a note
app.post("/postNote", express.json(), async (req, res) => {
  try {
    // Basic body request check
    const { title, content } = req.body;
    const createdAt = new Date();

    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Title and content are both required." });
    }

    // Send note to database
    const collection = db.collection(COLLECTIONS.notes);
    const result = await collection.insertOne({
      title,
      content,
      createdAt
    });
    res.json({
      response: "Note added succesfully.",
      insertedId: result.insertedId,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a note
app.delete("/deleteNote/:noteId", express.json(), async (req, res) => {
  try {
    // Basic param checking
    const noteId = req.params.noteId;
    if (!ObjectId.isValid(noteId)) {
      return res.status(400).json({ error: "Invalid note ID." });
    }

    // Find note with given ID
    const collection = db.collection(COLLECTIONS.notes);
    const data = await collection.deleteOne({
      _id: new ObjectId(noteId),
    });


    if (data.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Unable to find note with given ID." });
    }
    res.json({ response: `Document with ID ${noteId} deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
  
// Patch a note
app.patch("/patchNote/:noteId", express.json(), async (req, res) => {
  try {
    // Basic param checking
    const noteId = req.params.noteId;
    if (!ObjectId.isValid(noteId)) {
      return res.status(400).json({ error: "Invalid note ID." });
    }

    // Basic body request check
    const { title, content } = req.body;
    if (!title && !content) {
      return res
        .status(400)
        .json({ error: "Must have at least one of title or content." });
    }

    
    // Find note with given ID
    const collection = db.collection(COLLECTIONS.notes);
    const data = await collection.updateOne({
      _id: new ObjectId(noteId),
    }, {
      $set: {
        ...(title && {title}),
        ...(content && {content})
      }
    });

    if (data.matchedCount === 0) {
      return res
        .status(404)
        .json({ error: "Unable to find note with given ID." });
    }
    res.json({ response: `Document with ID ${noteId} patched.` });
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

app.delete("/deleteAllNotes", express.json(), async (req, res) => {
  try {
    const collection = db.collection(COLLECTIONS.notes);
    const data = await collection.deleteMany({});

    res.json({ response: `${data.deletedCount} note(s) deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


app.patch('/updateNoteColor/:noteId', express.json(), async (req, res) => {
  const { noteId } = req.params;
  const { color } = req.body;

  if (!ObjectId.isValid(noteId)) {
      return res.status(400).json({ error: "Invalid note ID." });
  }

  try {
      const collection = db.collection('notes');
      await collection.updateOne({ _id: new ObjectId(noteId) }, { $set: { color } });
      res.json({ message: 'Note color updated successfully.' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});