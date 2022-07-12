import { useState, useEffect, useRef } from 'react'
import { NextPage } from 'next'
import  Image  from 'next/image'
import Link from 'next/link'
import { BsVolumeUp, BsVolumeOff } from 'react-icons/bs'
import { BsPlay, BsPlayFill, BsPauseFill } from 'react-icons/bs'
import { GoVerified } from 'react-icons/go'

import { Video } from '../types.dev'

interface IProps {
   post: Video
}

const VideoCard: NextPage<IProps> = ({ post }) => {

  const [isHover, setIsHover] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  // ref in React.js
  const videoRef = useRef<HTMLVideoElement>(null);

  //if you are getting with null in typescript add "?"
  const onVideoPress = () => {
    if(playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  }

  return (
    <div className="flex flex-col border-b-2 border-gray-200 pb-6">
      <div>
        <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
          <div className="md:w-16 md:h-16 w-10 h-10">
            <Link href="/">
              <>
              <Image width={60} height={60} className="rounded-full" src={post.postedBy.image} alt="profile image" layout="responsive" />
              </>
            </Link>
          </div>
        </div>
        <Link href="/">
          <div className="flex items-center gap-2">
            <p className="flex gap-2 items-center md:text-md font-bold text-primary">{post.postedBy.userName} {`
            `}
              <GoVerified className="text-blue-400 text-md" />
            </p>
            <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">{post.postedBy.userName}</p>
          </div>
        </Link>
      </div>

       <div className="lg:ml-20 flex gap-4 relative mt-10">
            <div className="rounded-3xl" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
              <Link href={`/details/${post._id}`}>
                <video src={post.video.asset.url} ref={videoRef} loop className="lg:w-[600px] h-[300px] md:h-[400px] lg:h-[530px] w-[200px] rounded-2xl cursor-pointer bg-gray-200">
                </video>
              </Link>
                 
                {/* control button will hide and show this div below */}
              {isHover && (
                <div className="absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] p-3">
                    {playing ? (
                      <button onClick={onVideoPress}>
                        <BsPauseFill className="text-black text-2xl lg:text-3xl" />
                      </button>
                    ) : (
                      <button onClick={onVideoPress}>
                        <BsPlayFill className="text-black text-2xl lg:text-3xl" />
                      </button>
                    )}
                      {isVideoMuted ? (
                      <button onClick={() => setIsVideoMuted(false)}>
                        <BsVolumeOff className="text-black text-2xl lg:text-3xl" />
                      </button>
                    ) : (
                      <button onClick={() => setIsVideoMuted(true)}>
                        <BsVolumeUp className="text-black text-2xl lg:text-3xl" />
                      </button>
                    )}
                </div>
              )}
            </div>
       </div>
    </div>
  )
}

export default VideoCard