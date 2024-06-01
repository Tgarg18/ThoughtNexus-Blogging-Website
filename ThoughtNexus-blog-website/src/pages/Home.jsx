import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components/index'
import { NavLink } from 'react-router-dom'
const Home = () => {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        appwriteService.getPosts()
            .then((posts) => {
                if (posts) {
                    setPosts(posts.documents)
                }
            })
    }, [])

    if (posts.length === 0) {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap justify-center items-center'>
                        <div className="p-2 w-full">
                            <h1 className='text-2xl font-bold text-gray-500'>
                                <NavLink to={'/login'} className={`hover:underline hover:cursor-pointer hover:text-black`} draggable="false">
                                    Login to View Posts!!!
                                </NavLink>
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='w-1/4 p-2'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home