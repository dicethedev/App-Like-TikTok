import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GoVerified } from 'react-icons/go'
import axios from 'axios'
import { useRouter } from 'next/router'

import VideoCard from '../../components/VideoCard'
import NoResults from '../../components/NoResults'
import { IUser, Video } from '../../types.dev'
import { BASE_URL } from '../../utils'
import useAuthStore from '../../store/authStore'

//@dev - note - videos is from getServerSideProps below and it is destructed
//@dev - note - Video is coming from types.dev because the file was export and can be anyway in the codebase
const SearchTerm = ({ videos }: { videos: Video[] }) => {
 
     //@dev - this useState is handling the switch between accounts and videos field
     const [isAccounts, setIsAccounts ] = useState(false)
     const router = useRouter();
     const { searchTerm }: any = router.query;
     const { allUsers } = useAuthStore();
 
     //@dev - note - this function is declared for tailwind css effect
       const accounts = isAccounts ? 'border-b-2 border-black' : 'text-gray-400'
      const isVideos = !isAccounts ? 'border-b-2 border-black' : 'text-gray-400'
     //  console.log(videos)
     //@dev - searchedTheAccounts
     const searchedTheAccounts = allUsers.filter((user: IUser) => 
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()));

     return (
          <div className="w-full">
                  <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200
                     bg-white w-full">
                         <p className={`text-xl font-semibold cursor-pointer mt-2 ${accounts}`}
                          onClick={() => setIsAccounts(true)}
                          >
                          Accounts
                          </p>
                           <p className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`}
                          onClick={() => setIsAccounts(false)}
                          >
                          Videos
                          </p>
                     </div>
                     {isAccounts ? (
                         <div className='md:mt-16'>
                            {searchedTheAccounts.length > 0 ? (
                                  searchedTheAccounts.map((user: IUser, index: number) => (
                              <Link href={`/profile/${user._id}`} key={index}>
                               <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200">
                                    <div>
                                      <Image 
                                     src={user.image} 
                                     width={50} 
                                     height={50}
                                     className="rounded-full" 
                                     alt="user profile"
                                     />
                                    </div>

                                    <div className="hidden xl:block">
                                     <p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
                                    {/* replace spaces with no spaces */}
                                         {user.userName.replaceAll(' ', '')} 
                                         <GoVerified className="text-blue-400" />
                                         </p>
                                         <p className="capitalize text-xs text-gray-400">
                                       {user.userName}
                                     </p>
                                     </div>
                                </div>
                                </Link>
                               ))
                            ): <NoResults text={`No video results found for ${searchTerm}`} /> }
                         </div>
                     ): <div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
                         {videos.length ? (
                              videos.map((video: Video, index) => (
                                   <VideoCard post={video} key={index} />
                              ))
                         ) : <NoResults text={`No video results found for ${searchTerm}`} /> }
                         </div>}
          </div>
     )
}

export const getServerSideProps = async ({ 
     params: { searchTerm } 
}: {
     params: { searchTerm: string }
}) => {
    const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)
    return {
        props: { videos: res.data }
    }
}

export default SearchTerm
