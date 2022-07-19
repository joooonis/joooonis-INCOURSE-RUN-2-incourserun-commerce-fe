import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { setAuthHeader } from '@apis/_axios/instance';

import Join from './Join';
import JoinLayout from './JoinLayOut';

function JoinPage() {
  const router = useRouter();
  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) router.replace('/login');
    else {
      console.log('토큰넣기 성공');
      setAuthHeader(accessToken);
    }
  }, []);
  return <JoinLayout content={<Join />} />;
}

export default JoinPage;
