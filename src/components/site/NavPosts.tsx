'use client';

import {createContext, useContext, type ReactNode} from 'react';
import type {NavPost} from '@/content/nav';

const Ctx = createContext<NavPost[]>([]);

/** Hands the server-computed guide teasers to the header, mega panels and mobile menu. */
export function NavPostsProvider({posts, children}: {posts: NavPost[]; children: ReactNode}) {
  return <Ctx.Provider value={posts}>{children}</Ctx.Provider>;
}

export function useNavPosts(): NavPost[] {
  return useContext(Ctx);
}
