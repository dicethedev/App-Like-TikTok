import { useState, useEffect } from 'react' 
import { useRouter } from 'next/router'
import { MdCloudUpload } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import axios from 'axios'
import { SanityAssetDocument } from '@sanity/client'

import useAuthStore from '../store/authStore'
import { client } from '../utils/client'

import { topics } from '../utils/constants'


const Upload = () => {

     const [isLoading, setIsLoading] = useState(false);
     const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>();
     const [wrongFileType, setWrongFileType] = useState(false);

     //state for Uploading caption section
     const [caption, setCaption]  = useState('')
     const [category, setCategory]  = useState(topics[0].name)
     const [savingPost, setSavingPost]  = useState(false)

     //userProfile
     const { userProfile }: { userProfile: any } = useAuthStore();
     //next rounter
     const router = useRouter();

     // ========== function for uploading video ============== 
     const uploadVideo = async (e: any) => {
           const selectedFile = e.target.files[0];
           const fileTypes = ['video/mp4', 'video/ogg', 'video/webm', 'video/mpeg'];

           if(fileTypes.includes(selectedFile.type)) {
               //the client is from sanity backend
             client.assets.upload('file', selectedFile, {
               contentType: selectedFile.type,
               filename: selectedFile.filename
             })
             .then((data) => {
               setVideoAsset(data);
               setIsLoading(false);
             })
           } else {
               setIsLoading(false);
               setWrongFileType(true);
           }
     }

     //handle Post to post video to sanity
     const handlePost = async () => {
          if( caption && videoAsset?._id && category) {
               setSavingPost(true);

               //document to pass to sanity database i.e the video that is uploaded
               const document =  {
                    _type: 'post',
                    caption,
                    video: {
                         _type: 'file',
                         asset: {
                              _type: 'reference',
                              _ref: videoAsset?._id
                         }
                    },
                    userId: userProfile?._id,
                    postedBy: {
                         _type: 'postedBy',
                         _ref: userProfile?._id
                    },
                    topic: category
               }
               
               await axios.post('http://localhost:3000/api/post', document);

               router.push('/');
          }
     }

     return (
          <div className="flex w-full h-full absolute left-0 top-[60px] mb-10 pt-10 lg:pt-20 bg-[#F8F8F8] justify-center">
               <div className="bg-white rounded-lg xl:h-[80vh] w-[60%] flex gap-6 flex-wrap justify-between items-center p-14 pt-6">
                    <div>
                         <div>
                              <p className="text-2xl font-bold">Upload Video</p>
                              <p className="text-md text-gray-500 mt-1">Post a video to your account</p>
                         </div>
                         <div className="border-dashed rounded-xl border-4 border-gray-300 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[460px] p-10 cursor-pointer hover:border-[#F51997] hover:bg-gray-100">
                           {isLoading ? (
                              <p>Uploading...</p>
                           ) : (
                              <div>
                                 {videoAsset ? (
                                   <div>
                                       <video src={videoAsset.url} loop controls className="rounded-xl h-[430px] mt-0 bg-black"></video>
                                   </div>
                                 ) : (
                                   <label className="cursor-pointer">
                                      <div className="flex flex-col justify-center items-center h-full">
                                         <div className="flex flex-col justify-center items-center">
                                           <p className="font-bold text-xl">
                                             <MdCloudUpload className="text-gray-400 text-7xl" />
                                           </p>

                                           <p className="font-semibold text-xl">
                                             Upload Video
                                           </p>
                                          </div>

                                          <p className="text-gray-500 text-center mt-10 text-sm leading-10">
                                             MP4 or WebM or ogg or mpeg <br />
                                             720x1280 or higher <br />
                                             Up to 10 minutes <br />
                                             Less than 2GB
                                          </p>
                                          <p className="bg-[#F51997] text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none">
                                               Select File
                                          </p>
                                      </div>
                                       <input type="file" name="upload-video" className="w-0 h-0" onChange={uploadVideo} />
                                   </label>
                                 )}
                              </div>
                           )}
                           {wrongFileType && (
                              <p className='text-center text-xl text-red-400 font-semibold mt-4 w-[250px]'>
                                  Please select a video file
                              </p>
                           )}
                         </div>
                    </div>
                          
                           <div className='flex flex-col gap-3 pb-10'>
                              <label className='text-md font-medium'>Caption</label>
                              <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} 
                              className="rounded outline-none text-md border-2 border-gray-300 p-2"/>
                            
                             <label className='text-md font-medium'>Choose a Category</label>
                                 <select onChange={(e) => setCategory(e.target.value)} 
                                 className="outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer"
                                 >
                                    {topics.map((topic) => (
                                        <option key={topic.name} className="outlined-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300"
                                         value={topic.name}
                                        >
                                             {topic.name}
                                        </option>
                                    ))}
                                 </select>
                                 <div className="flex gap-6 mt-10">
                                   {/* button>1 */}
                                     <button type="button" onClick={() => {}} 
                                      className="border-gray-300 border-2 text-md font-medium p-2 rounded wd-28 lg:w-44 hover:bg-gray-200 outline-none "
                                      >
                                        Discard
                                      </button>
                                       {/* button>2 */}
                                        <button type="button" onClick={handlePost} 
                                      className="bg-[#F51997] text-white text-md font-medium p-2 rounded wd-28 lg:w-44 outline-none "
                                      >
                                        Post
                                      </button>
                                 </div>
                           </div>

               </div>
          </div>
     )
}

export default Upload