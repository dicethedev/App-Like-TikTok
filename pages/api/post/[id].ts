import type { NextApiRequest, NextApiResponse } from 'next'
//uuid stand for unique identifier
import { uuid } from 'uuidv4';
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
  } else if (req.method === 'PUT') {
    const { comment, userId } = req.body;
    const { id }:any = req.query;

     const data =  await client
        .patch(id)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
             {
              comment,
               _key: uuid(),
               postedBy: { _type: 'postedBy', _ref: userId }
             }
        ])
        .commit()

        res.status(200).json(data);
  }
}
