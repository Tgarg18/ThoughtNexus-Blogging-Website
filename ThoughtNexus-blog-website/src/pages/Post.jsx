import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import appwriteService from '../appwrite/config'
import { Button, Container } from '../components/index'
import parse from 'html-react-parser'
import { useSelector } from 'react-redux'

const Post = () => {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)
    const isAuthor = post && userData ? post.userId === userData.$id : false

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then(post => {
                if (post) setPost(post)
                else navigate('/')
            })
        } else navigate('/')
    }, [slug, navigate])

    const deletePost = () => {
        appwriteService.deletePost(post.$id)
            .then((status) => {
                if (status) {
                    appwriteService.deleteFile(post.featuredImage)
                    navigate('/')
                }
            })
    }

    return post ? (
        <div className='py-8'>
            <Container>
                <div className='w-full flex justify-center mb-4 relative border rounded-xl p-2'>
                    <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} className='rounded-xl mt-12 max-h-96' draggable='false' />
                    {isAuthor && (
                        <div className='absolute right-2 top-2'>
                            <Link to={`/edit-post/${post.$id}`} draggable='false'>
                                <Button bgColor='bg-green-500' className='mr-3 hover:opacity-60'>
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor='bg-red-500' onClick={deletePost} className='hover:opacity-60'>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className='w-full mb-6'>
                    <h1 className='text-3xl font-bold'>{post.title}</h1>
                    <p className='text-gray-600 font-semibold my-2'>Posted on: {Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(post.$createdAt))}</p>
                    {
                        post.status == "Inactive"?
                        (<p className='text-white text-lg hover:underline hover:cursor-pointer hover:text-gray-200'>Post Status is Inactive!!! <span>This post is not visible to the public. </span> <span>Go to the edit page to make it active</span></p>)
                        :
                        null
                    }
                </div>
                <div className='browser-css text-justify'>
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null
}

export default Post