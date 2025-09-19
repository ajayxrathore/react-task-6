import React from 'react'

function Button({children, type='button',variant='primary', ...props}) {
    const baseStyles = 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2'
    const variantStyles ={
        primary:'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
        danger:'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    }
  return (
    <button
    type={type}
    className={`${baseStyles} ${variantStyles[variant]} ${props.className}`}
    {...props}
    >
        {children}
    </button>
  )
}

export default Button
