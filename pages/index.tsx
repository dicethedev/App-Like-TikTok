import type { NextPage } from 'next'
import axios from 'axios'
import { Video } from '../types.dev'
import VideoCard from '../components/VideoCard'
import NoResults from '../components/NoResults'

import { BASE_URL } from '../utils'


interface IProps {
   videos: Video[]
}

// : NextPage 

const Home = ({ videos } : IProps) => {
  console.log(videos);

  return (
    <div className="flex flex-col gap-10 videos h-full">
       {videos.length ? (
         videos.map((video: Video) => (
          <VideoCard post={video} key={video._id} />
        ))
       ) : (
         <NoResults text={'No Videos Available'} />
       )}
    </div>
  )
}

export const getServerSideProps = async () => {
  //check api folder for post folder
  // const response = await axios.get(`http://localhost:3000/api/post`);

    const { data } = await axios.get(`${BASE_URL}/api/post`);


  // console.log(response.data.name);
  return {
    props: {
      videos: data
    }
  }
}

export default Home
