'use client'
import { useSearchParams } from 'next/navigation'
import { CardWrapper } from './card-wrapper'
import { BarLoader } from 'react-spinners'
import { useCallback, useEffect, useState } from 'react'
import { newVerification } from '@/actions/ new-verification'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const onSubmit = useCallback(() => {
    if (!token) return setError('Missing Token')
    newVerification(token)
      .then((data) => {
        setError(data?.error)
        setSuccess(data?.success)
      })
      .catch(() => {
        setError('something went wrong')
      })
  }, [token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])
  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocial={false}
    >
      <div className="flex items-center flex-col w-full justify-center">
        {!error && !success && <BarLoader />}

        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  )
}
