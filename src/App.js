import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
import DishCard from './DishCard';
// import { FacebookProvider, Comments } from 'react-facebook';

const initialFormState = { name: '', description: '' }

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(notesFromAPI.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image);
        note.image = image;
      }
      return note;
    }))
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  function sortByCreatedAt(a, b) {
    return b.createdAt - a.createdAt
  }

  return (
    <div className="App">
      <div className="top-container">
        <div className="title-text">
          <h1>Welcome to Home Eats</h1>
          <h2>Share your favorite dishes!</h2>
        </div>
        <div className="input-container">
          <input
            className="input-text"
            onChange={e => setFormData({ ...formData, 'name': e.target.value})}
            maxLength={60}
            placeholder="Dish name"
            value={formData.name}
          />
          <textarea
            className="input-text-description"
            onChange={e => setFormData({ ...formData, 'description': e.target.value})}
            maxLength={160}
            placeholder="Dish description"
            value={formData.description}
          />
          <input
            type="file"
            onChange={onChange}
          />
          <button className="btn-create" onClick={createNote}>Create food porn</button>
        </div>
      </div>
      <div className="bottom-container">
        <div className="dish-card-container">
          {
            notes.map(note => (
              <div className='card-btn-container'>
                <DishCard note={note}/>
                <button className="btn-delete" onClick={() => deleteNote(note)}>Delete dish</button>
              </div>
            )).sort(sortByCreatedAt)
          }
        </div>
      </div>
      {/* <FacebookProvider appId="1395715404237243">
        <Comments href="http://www.facebook.com" />
      </FacebookProvider> */}
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
