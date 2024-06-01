import React, { useEffect, useState } from 'react'
import { Container, PostCard } from '../components/index'
import { useSelector } from 'react-redux'
import appwriteService from '../appwrite/config'
import { Link } from 'react-router-dom'

const MyProfile = () => {

  const user = useSelector(state => state.auth.userData)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if (user) {
      appwriteService.getAllPosts()
        .then((posts) => {
          if (posts) {
            const userPosts = posts.documents.filter(post => post.userId === user.$id);
            setPosts(userPosts);
          }
        })
        .catch(error => {
          console.error("Error fetching posts:", error);
        })
    }
  }, [user])

  return (
    <Container>
      <div className='font-bold text-xl my-3'>
        My Profile
      </div>
      <div className='flex justify-center items-center gap-20'>
        <div>
          <p className='text-xl ml-2'>{user?.name}</p>
          <p className='text-lg ml-2 text-gray-600'>{user?.email}</p>
        </div>
      </div>
      <hr className='my-5 border border-black' />
      <div>
        <div className='my-5 font-semibold text-xl'>My Posts:</div>
        <div className='flex flex-wrap'>
          {posts.length === 0 ?
            (
              <div className='w-full text-center mt-10'>
                <Link to={'/add-posts'} draggable="false">
                  <p className='text-gray-600 hover:text-black hover:underline'>
                    No Posts Found!!! Click to Add Post
                  </p>
                </Link>
              </div>
            ) :
            (
              posts.map((post) => (
                <div key={post.$id} className='w-1/4 p-2'>
                  <PostCard {...post} />
                </div>
              ))
            )}
        </div>
      </div>
    </Container>
  )
}

export default MyProfile