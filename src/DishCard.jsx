import React from 'react'

const DishCard = ({ note }) => {

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
