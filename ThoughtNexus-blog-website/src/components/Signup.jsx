import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { Button, Input, Loader, Logo } from './index'

const Signup = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState("")
    const { register, handleSubmit } = useForm()
    const [showLoader, setShowLoader] = useState(false)

    const signup = async (data) => {
        setShowLoader(true)
        setError("")
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                const userData = await authService.getCurrentUser()
                if (userData) {
                    dispatch(login({ userData }))
                }
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
        finally {
            setShowLoader(false)
        }
    }

    return (
        <div className='flex items-center justify-center'>
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[100px]'>
                        <Logo width='100%' />
                    </span>
                </div>
                <h2 className='text-center text-2xl font-bold leading-tight'>Sign up to Create Account</h2>
                <p className='mt-2 text-center text-base text-black/60'>
                    Already have an account?&nbsp;
                    <Link to="/login" className='font-medium text-primary transition-all duration-200 hover:underline'>
                        Sign in
                    </Link>
                </p>
                {error && <p className='mt-8 text-center text-red-600'>{error}</p>}
                <form onSubmit={handleSubmit(signup)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input label="Full Name: " placeholder="Enter your full name" type="text" {...register("name", {
                            required: true
                        })} />
                        <Input label="Email: " placeholder="Enter your email" type="email" {...register("email", {
                            required: true,
                            validate: {
                                matchPattern: (value) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must ba a valid address",
                            }
                        })} />
                        <Input label="Password: " placeholder="Enter your password" type="password" {...register("password", {
                            required: true,
                            minLength: 6,
                            maxLength: 20,
                            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,20}$/
                        })} />
                    </div>
                    <Button type="submit" className={`w-full flex h-12 justify-center items-center ${showLoader ? "opacity-50 cursor-none" : ""}`}>
                        {showLoader ?
                            <Loader />
                            :
                            "Sign up"
                        }
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Signup



