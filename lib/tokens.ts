import { createTwoFactorToken } from './../data/two-factor-token'
import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetTokenByEmail,
} from '@/data/password-reset-token'
import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByEmail,
} from '@/data/verification-token'
import {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
} from '@/data/two-factor-token'

export const generateVerificationToken = async (email: string) => {
  const existingToken = await getVerificationTokenByEmail(email)
  // Delete token if already exists
  if (existingToken) await deleteVerificationToken(existingToken.id)

  return await createVerificationToken(email)
}

export const generatePasswordResetToken = async (email: string) => {
  const existingToken = await getPasswordResetTokenByEmail(email)
  // Delete token if already exists
  if (existingToken) await deletePasswordResetToken(existingToken.id)

  return await createPasswordResetToken(email)
}

export const generateTwoFactortoken = async (email: string) => {
  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) await deleteTwoFactorToken(existingToken.id)

  return await createTwoFactorToken(email)
}
