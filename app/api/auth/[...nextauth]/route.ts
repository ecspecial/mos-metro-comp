import NextAuth from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/app/lib/auth';

type CombineRequest = Request & NextApiRequest;
type CombineResponse = Response & NextApiResponse;

async function handler(req: CombineRequest, res: CombineResponse) {
  return await NextAuth(req, res, authOptions(req));
}

export { handler as GET, handler as POST };