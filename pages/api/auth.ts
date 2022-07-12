import type { NextApiRequest, NextApiResponse } from 'next'

import { client } from '../../utils/client';

export default async function handler( req: NextApiRequest, 
     res: NextApiResponse )
{
     //my own local backend
//   res.status(200).json({ name: 'Response is Successful' })
// connecting to sanity backend
  if(req.method === 'POST') {
     const user = req.body;

     client.createIfNotExists(user)
     .then(() => res.status(200).json('Login Successful!'))
  }
}
