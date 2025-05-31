import to from 'await-to-js'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export const getPasswordResetTokenByEmail = async (email: string) => {
  const [err, passwordResetToken] = await to(
    db.passwordResetToken.findFirst({
      where: { email },
    })
  )

  if (err) return null

  return passwordResetToken
}

export const getPasswordResetTokenByToken = async (token: string) => {
  const [_, passwordResetToken] = await to(
    db.passwordResetToken.findUnique({
      where: { token },
    })
  )

  return passwordResetToken
}

export const deletePasswordResetToken = async (tokenId: string) => {
  await db.passwordResetToken.delete({
    where: { id: tokenId },
  })
}

export const createPasswordResetToken = async (email: string) => {
  return await db.passwordResetToken.create({
    data: {
      email,
      token: uuidv4(),
      expires: new Date(new Date().getTime() + 3600 * 1000),
    },
  })
}
