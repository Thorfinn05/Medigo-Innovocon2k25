'use client'
import { ClerkLoaded, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Form from 'next/form'
import React from 'react'
import { DocumentsIcon, PackageIcon, TrolleyIcon } from '@sanity/icons'

const Header = () => {
    const { user } = useUser();
    const createClerkPasskey = async () => {
        try{
            const response = await user?.createPasskey();
            console.log(response);
        }
        catch(err){
            console.log("Error",JSON.stringify(err,null,2))
        }
    }

    return (
        <header className='flex justify-between items-center px-4 py-2'>
            <div className='flex w-full items-center space-x-4'>
                {/* Logo */}
                <Link href="/"
                    className="text-2xl font-bold text-blue-500 hover:opacity-50 cursor-pointer flex-shrink-0" 
                >Medigo</Link>

                {/* Search Bar */}
                <Form action='/search' className='flex-grow'>
                    <input type="text"
                        name="query"
                        placeholder='Search for medicine'
                        className='w-full bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border'
                    />
                </Form>

                {/* Icons and User Section */}
                <div className='flex items-center space-x-4'>
                    {/* My Basket */}
                    <Link href="/basket" className='relative flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                        <TrolleyIcon className='w-6 h-6'/>
                        <span className='hidden md:inline'>My Basket</span>
                    </Link>

                    {/* My Orders */}
                    <ClerkLoaded>
                        {user && (
                            <Link href="/orders" className='relative flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                                <PackageIcon className='h-6 w-6'/>
                                <span className='hidden md:inline'>My Orders</span>
                            </Link>
                        )}

                        {/* Pres Ana */}
                        <Link href="/basket" className='relative flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                        <DocumentsIcon className='w-6 h-6'/>
                        <span className='hidden md:inline'>Upload Prescription</span>
                    </Link>

                        {/* User Profile */}
                        {user ? (
                            <div className='flex items-center space-x-2'>
                                <UserButton/>
                                <div className='hidden md:block text-xs'>
                                    <p className='text-gray-400'>Welcome Back</p>
                                    <p className='font-bold'>{user.fullName}!</p>
                                </div>
                            </div>
                        ) : (
                            <SignInButton mode="modal"/>
                        )}

                        {/* Create Passkey Button */}
                        {user?.passkeys.length === 0 && (
                            <button onClick={createClerkPasskey}
                                className='bg-white hover:blue-700 hover:text-white animate-pulse text-blue-500 font-bold py-2 px-4 rounded border-blue-300 border'>
                                Create passkey
                            </button>
                        )}
                    </ClerkLoaded>
                </div>
            </div>
        </header>
    )
}

export default Header
