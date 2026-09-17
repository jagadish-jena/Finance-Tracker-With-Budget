'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hasUser = Boolean(localStorage.getItem('user'));
    router.replace(hasUser ? '/dashboard' : '/login');
  }, [router]);

  return null;
}
