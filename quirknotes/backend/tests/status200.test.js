test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
});

const SERVER_URL = "http://127.0.0.1:4000";

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
    const response = await fetch(`${SERVER_URL}/getAllNotes`);
    const data = await response.json();
    expect(data.response.length).toBe(0);
});
  
 test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  const insertedNoteId1 = await insertTestNote();
  const insertedNoteId2 = await insertTestNote();

  const response = await fetch(`${SERVER_URL}/getAllNotes`);
  const data = await response.json();
  expect(data.response.length).toBe(2);
});

test("/postNote - Post a note", async () => {
    const title = "NoteTitleTest";
    const content = "NoteTitleContent";
  
    const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    });
  
    const postNoteBody = await postNoteRes.json();
  
    expect(postNoteRes.status).toBe(200);
    expect(postNoteBody.response).toBe("Note added succesfully.");
});

test("/deleteNote - Delete a note", async () => {
    const insertedNoteId = await insertTestNote();
  
    const response = await fetch(`${SERVER_URL}/deleteNote/${insertedNoteId}`, { method: 'DELETE' });
    const data = await response.json();
    expect(data.response).toBe(`Document with ID ${insertedNoteId} deleted.`);
});
  
test("/patchNote - Patch with content and title", async () => {
    const insertedNoteId = await insertTestNote();
  
    const response = await fetch(`${SERVER_URL}/patchNote/${insertedNoteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'New Title', content: 'New Content' }),
    });
    const data = await response.json();
    expect(data.response).toBe(`Document with ID ${insertedNoteId} patched.`);
});
  
test("/patchNote - Patch with just title", async () => {
    const insertedNoteId = await insertTestNote();
  
    const response = await fetch(`${SERVER_URL}/patchNote/${insertedNoteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'New Title' }),
    });
    const data = await response.json();
    expect(data.response).toBe(`Document with ID ${insertedNoteId} patched.`);
});

test("/patchNote - Patch with just content", async () => {
    const insertedNoteId = await insertTestNote();
  
    const response = await fetch(`${SERVER_URL}/patchNote/${insertedNoteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: 'New Content' }),
    });
    const data = await response.json();
    expect(data.response).toBe(`Document with ID ${insertedNoteId} patched.`);
});

test("/deleteAllNotes - Delete all notes", async () => {
    const response = await fetch(`${SERVER_URL}/deleteAllNotes`, { method: 'DELETE' });
    const data = await response.json();
    expect(data.response).toBe('6 note(s) deleted.');
});

test("/deleteAllNotes - Delete one note", async () => {
    const insertedNoteId = await insertTestNote();
  
    const response = await fetch(`${SERVER_URL}/deleteAllNotes`, { method: 'DELETE' });
    const data = await response.json();
    expect(data.response).toBe(`1 note(s) deleted.`);
});

test("/deleteAllNotes - Delete three notes", async () => {
    const insertedNoteId1 = await insertTestNote();
    const insertedNoteId2 = await insertTestNote();
    const insertedNoteId3 = await insertTestNote();
  
    const response = await fetch(`${SERVER_URL}/deleteAllNotes`, { method: 'DELETE' });
    const data = await response.json();
    expect(data.response).toBe(`3 note(s) deleted.`);
});


test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
    const insertedNoteId = await insertTestNote();
  
    const response = await fetch(`${SERVER_URL}/updateNoteColor/${insertedNoteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ color: '#FF0000' }),
    });
    const data = await response.json();
    expect(data.message).toBe('Note color updated successfully.');
});

test("/deleteAllNotes - Delete remaining notes", async () => {
    const response = await fetch(`${SERVER_URL}/deleteAllNotes`, { method: 'DELETE' });
    const data = await response.json();
    expect(data.response).toBe('1 note(s) deleted.');
});

test("/deleteAllNotes - Delete one note", async () => {
    const insertedNoteId = await insertTestNote();

    const response = await fetch(`${SERVER_URL}/deleteAllNotes`, { method: 'DELETE' });
    const data = await response.json();
    expect(data.response).toBe('1 note(s) deleted.');
});

test("/deleteAllNotes - Delete three notes", async () => {
    const insertedNoteId1 = await insertTestNote();
    const insertedNoteId2 = await insertTestNote();
    const insertedNoteId3 = await insertTestNote();
  
    const response = await fetch(`${SERVER_URL}/deleteAllNotes`, { method: 'DELETE' });
    const data = await response.json();
    expect(data.response).toBe('3 note(s) deleted.');
  });

  // Helper function to insert a test note
async function insertTestNote() {
    const response = await fetch(`${SERVER_URL}/postNote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Test Note', content: 'Test Content' }),
    });
    const data = await response.json();
    return data.insertedId;
}
  