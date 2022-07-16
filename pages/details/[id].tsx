import  { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { GoVerified } from 'react-icons/go'
import { MdCancel } from 'react-icons/md'
import { BsFillPlayFill } from 'react-icons/bs'
import { FaVolumeOff, FaVolumeUp } from 'react-icons/fa'

import axios from 'axios'

import { BASE_URL } from '../../utils'

import { Video } from '../../types.dev'
import useAuthStore from '../../store/authStore'
import LikeButton from '../../components/LikeButton'
import Comments from '../../components/Comments'


interface IProps {
   postDetails: Video;
}

const Details = ({ postDetails } : IProps) => {
    
    const [ post,  setPost ] = useState(postDetails);
    const [ playing,  setPlaying ] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    const router = useRouter();

    const { userProfile }: any = useAuthStore();
    const [comment, setComment] = useState('');
    const [isPostingComment, setIsPostingComment] = useState(false);

    //if the post doesn't exist execute the command below
    if(!post) return null;

    const onVideoClick = () => {
        if(playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  }

    useEffect(() => {
    if(post && videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [post, isVideoMuted])

  // handleLike is found in LikeButton components
    const handleLike = async (like: boolean) => {
      if(userProfile) {
        const { data } = await axios.put(`${BASE_URL}/api/like`, {
          userId: userProfile._id,
          postId: post._id,
          //like is the type of boolean i.e true or false
          like
        })

        setPost({ ...post, likes: data.likes })
      }
    }

    // addComment is found in Comments components
    const addComment = async (e) => {
       e.preventDefault();

       if(userProfile && comment ) {
        setIsPostingComment(true);

        const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
          userId: userProfile._id,
          comment
        });

        //updating the comment
        setPost({ ...post, comments: data.comments });
        setComment('');
        setIsPostingComment(false);
       }
    }

  return (
     <div className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap">
       {/* w-9/12 is 70% */}
       <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black">
          <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">

            <p className='cursor-pointer' onClick={() => router.back()}>
              <MdCancel className="text-white text-[35px]" />
            </p>
          </div>
          <div className="relative">
            <div className="lg:h-[100vh] h-[60vh]">
               <video ref={videoRef} loop src={post.video.asset.url} 
                onClick={onVideoClick}
               className="h-full cursor-pointer" 
               >
               </video>
            </div>
            <div className="absolute top-[45%] left-[45%] cursor-pointer">
              {!playing && (
               <button onClick={onVideoClick}>
                <BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
               </button>
              )}
            </div>
             </div>

             <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
                 {isVideoMuted ? (
                   <button onClick={() => setIsVideoMuted(false)}>
                      <FaVolumeOff className="text-white text-2xl lg:text-3xl" />
                    </button>
                 ) : (
                  <button onClick={() => setIsVideoMuted(true)}>
                     <FaVolumeUp className="text-white text-2xl lg:text-3xl" />
                  </button>
                )}
             </div>
          </div>

            <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
                  <div className="lg:mt-20 mt-10">

                   <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
                     <div className="ml-4 md:w-20 md:h-20 w-16 h-16">
                       <Link href="/">
                         <>
                         <Image width={62} height={62} className="rounded-full" 
                          src={post.postedBy.image} alt="profile image" layout="responsive" />
                         </>
                       </Link>
                     </div>
                   <Link href="/">
                     <div className="flex flex-col gap-2 mt-3">
                       <p className="flex gap-2 items-center md:text-md font-bold text-primary">{post.postedBy.userName} {`
                       `}
                         <GoVerified className="text-blue-400 text-md" />
                       </p>
                       <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">{post.postedBy.userName}</p>
                     </div>
                   </Link>
                 </div>
                    
                    <p className='px-10 text-md text-gray-600 text-lg'>{post.caption}</p>

                    <div className='mt-10 px-10'>
                       {userProfile && (
                        <LikeButton 
                        likes={post.likes}
                        handleLike={() => handleLike(true)} 
                        handleDislike={() => handleLike(false)} 
                        />
                       )}
                    </div>

                     <Comments 
                      comment={comment}
                      setComment={setComment}
                      addComment={addComment}
                      comments={post.comments}
                      isPostingComment={isPostingComment}
                     />
               </div>
            </div>
       </div>
  )
}

export const getServerSideProps = async ({ 
   params: { id } 
}: {
  params: { id: string }
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/post/${id}`)

  return {
    props: { postDetails: data }
  }
}

export default Details