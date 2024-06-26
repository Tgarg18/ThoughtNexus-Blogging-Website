import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE, Loader } from '../index'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PostForm = ({ post }) => {
  const [showLoader, setShowLoader] = useState(false)
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      status: post?.status || 'active',
      slug: post?.slug || '',
    }
  })
  const navigate = useNavigate()
  const userData = useSelector(state => state.auth.userData)

  const submit = async (data) => {
    setShowLoader(true)
    if (post) {
      const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
      if (file) {
        appwriteService.deleteFile(post.featuredImage)
      }
      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined
      })
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`)
      }
      setShowLoader(false)
    } else {
      const file = await appwriteService.uploadFile(data.image[0])
      if (file) {
        const fileId = file.$id
        data.featuredImage = fileId
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id
        })
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`)
        }
      }
      setShowLoader(false)
    }
  }

  const slugTransform = useCallback((value) => {
    if (value && typeof value === 'string') {
      return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]/g, '').replace(/\s+/g, '-')
    }
    return ""
  }, [])

  useEffect(() => {

    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        setValue('slug', slugTransform(value.title, { shouldValidate: true }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [watch, slugTransform, setValue])

  return (
    <form onSubmit={handleSubmit(submit)} className='flex flex-wrap'>
      <div className='w-2/3 px-2'>
        <Input
          label="Title: "
          type="text"
          placeholder="Title"
          className="mb-4"
          {
          ...register('title', {
            required: true
          })
          }
        />
        <Input
          label="Slug: "
          type="text"
          placeholder="Slug"
          className="mb-4"
          {
          ...register('slug', {
            required: true
          })
          }
          onInput={(e) => {
            setValue('slug', slugTransform(e.currentTarget.value), { shouldValidate: true })
          }}
        />
        <RTE
          label="Content: "
          name="content"
          control={control}
          defaultValue={getValues('content')}
        />
      </div>
      <div className='w-1/3 px-2'>
        <Input
          label="Featured Image: "
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {
          ...register('image', {
            required: !post
          })
          }
        />
        {
          post && (
            <div className='w-full mb-4'>
              <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} className='rounded-lg' draggable="false" />
            </div>
          )
        }
        <Select
          options={['Active', 'Inactive']}
          label="Status: "
          className="mb-4 bg-black"
          {
          ...register('status', {
            required: true
          })
          }
        />
        <Button type='submit' bgColor={post ? "bg-green-500" : undefined} className={`h-12 w-full flex justify-center items-center ${showLoader ? 'opacity-50 cursor-none' : ''}}`}>
          {
            showLoader ?
              <Loader />
              :
              (
                post ?
                  'Update Post'
                  :
                  'Create Post'
              )
          }
        </Button>
      </div>
    </form>
  )
}

export default PostForm