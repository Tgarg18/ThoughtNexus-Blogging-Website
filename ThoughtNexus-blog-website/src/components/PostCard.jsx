import React from 'react'
import service from '../appwrite/config'
import { Link } from 'react-router-dom'

const PostCard = ({ $id, title, featuredImage }) => {

  return (
    <Link to={`/post/${$id}`} draggable="false">
      <div className='w-full bg-gray-100 rounded-xl h-44 p-4 hover:shadow-2xl'>
        <div className='w-full justify-center mb-4 flex'>
          <img src={service.getFilePreview(featuredImage)} alt={title} className='rounded-xl max-h-20 min-w-20' draggable="false" />
        </div>
        <h2 className='text-xl font-bold'>
          {title}
        </h2>
      </div>
    </Link>
  )

}

export default PostCard