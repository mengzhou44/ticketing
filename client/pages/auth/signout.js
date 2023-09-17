'use client';

import useRequest from '../../hooks/use-request'
import Router from 'next/router'
import { useEffect } from 'react'

export default () => {
  const { doRequest, errors } = useRequest(
    {
      url: '/api/users/signout',
      method: 'post',
      onSuccess:   () => Router.push('/')
    }, 
  )

  useEffect(() => {
    doRequest()
  }, [])
}
