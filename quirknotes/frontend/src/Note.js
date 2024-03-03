import './App.css';

const Note = ({entry, editNote, deleteNote, onChangeColor}) => {

    const handleColorChange = (event) => {
        const newColor = event.target.value;
        onChangeColor(entry._id, newColor);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div style={{...NoteStyle.note, backgroundColor: entry.color || 'grey'}}>
            <span style={{ fontSize: '0.75rem', display: 'block', marginBottom: '5px' }}>
                {formatDate(entry.createdAt)}
            </span>
            <p style={NoteStyle.text}>{entry.title}</p>
                <input type="color" onChange={handleColorChange} value={entry.color || 'grey'} />
                <button
                    onClick={() => editNote(entry)}
                    >
                    Edit note
                </button>
                {<button
                    onClick={() => deleteNote(entry)}
                    >
                    Delete note
                </button>}
        </div>
    )

}

export default Note;

const NoteStyle = {
    note: {
      padding: '20px',
      margin: '20px',
      width: '200px',
      borderStyle: 'dotted',
      borderRadius: '30px',
      borderWidth: 'thin',
      overflowWrap: "break-word"
    },
    text: {
      margin: "0px"
    }, 
}