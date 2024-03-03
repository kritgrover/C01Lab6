import React from 'react';

const NoteSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search notes by title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ margin: '20px 0', padding: '10px', width: 'calc(100% - 40px)' }}
      />
      <button onClick={() => setSearchQuery("")} style={{ padding: '10px' }}>Clear Search</button>
    </div>
  );
};

export default NoteSearch;