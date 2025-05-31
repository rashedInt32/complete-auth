'use server'

import { signIn } from '@/auth'
import { LoginSchema } from './../schema/index'

import { z } from 'zod'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { getUserByEmail } from '@/data/user'
import { generateTwoFactortoken, generateVerificationToken } from '@/lib/tokens'
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail'
import {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
} from '@/data/two-factor-token'
import {
  createTwoFActorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationbyUserId,
} from '@/data/two-facgtor-confirmation'
import { db } from '@/lib/db'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values)
  if (!validateFields.success) return { error: 'Invalid fields!' }

  const { email, password, code } = validateFields.data

  const existingUser = await getUserByEmail(email)
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    )
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { success: 'Confirmation email sent!' }
  }

  if (existingUser.isTwoFactorEnable && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
      if (!twoFactorToken) return { error: 'Invalid code!' }
      if (twoFactorToken.token !== code) {
        return { error: 'Invalid code' }
      }

      const hasExpires = new Date(twoFactorToken.expires) < new Date()
      if (hasExpires) return { error: 'code expired!' }

      await deleteTwoFactorToken(twoFactorToken.id)

      const existingConfirmation = await getTwoFactorConfirmationbyUserId(
        existingUser.id
      )

      if (existingConfirmation) {
        await deleteTwoFactorConfirmation(existingConfirmation.id)
      }

      console.log('existing user Id', existingUser.id)
      await createTwoFActorConfirmation(existingUser.id)
    } else {
      const twoFactorToken = await generateTwoFactortoken(existingUser.email)
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)
      return { twoFactor: true }
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credntials' }
        default:
          return { error: 'Something went wrong' }
      }
    }
    throw error
  }
}
