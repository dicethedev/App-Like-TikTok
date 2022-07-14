import type { NextApiRequest, NextApiResponse } from 'next'

import { postDetailQuery } from '../../../utils/queries'
import { client } from '../../../utils/client'

export default async function handler( req: NextApiRequest, 
     res: NextApiResponse )
{
     //my own local backend
//   res.status(200).json({ name: 'Response is Successful' })
// connecting to sanity backend
  if(req.method === 'GET') {
    const { id } = req.query;
    
    //posting to sanity database
    const query = postDetailQuery(id); 

    const data = await client.fetch(query);

    res.status(200).json(data[0]);
  }
}
