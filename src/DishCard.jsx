import React from 'react'
// import { deleteNote as deleteNoteMutation } from './graphql/mutations'
// import { API } from 'aws-amplify';


const DishCard = ({ note }) => {
  // const [notes, setNotes] = useState([]);

  // async function deleteNote({ id }) {
  //   const newNotesArray = notes.filter(note => note.id !== id);
  //   setNotes(newNotesArray);
  //   await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  // }

  return (
    <div key={note.id || note.name} className='dish-card'>
      <div className="card-text">
        <h3 className='dish-name'>{note.name}</h3>
        <p className='dish-description'>{note.description}</p>
      </div>
      {
        note.image && <img src={note.image} alt='' className='img-food' />
      }
    </div>
  )
}

export default DishCard
