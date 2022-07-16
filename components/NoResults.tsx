import React from 'react'
import { BsCameraVideoOffFill } from 'react-icons/bs'
import { BiCommentX } from 'react-icons/bi'

interface IProps {
     text: string;
}

const NoResults = ({ text }: IProps) => {
  
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <p className="text-8xl">
          {text === 'No comments yet! Make a comment first!'
           ? <BiCommentX /> 
           : <BsCameraVideoOffFill  />
          } 
      </p>
      <p className='text-2xl text-center'>{text}</p>
    </div>
  )
}

export default NoResults