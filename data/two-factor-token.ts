import to from 'await-to-js'
import { db } from '@/lib/db'
import crypto from 'crypto'

export const getTwoFactorTokenByToken = async (token: string) => {
  const [_, twoFactorToken] = await to(
    db.twoFactorToken.findUnique({
      where: {
        token,
      },
    })
  )
  return twoFactorToken
}

export const getTwoFactorTokenByEmail = async (email: string) => {
  const [_, twoFactorToken] = await to(
    db.twoFactorToken.findFirst({
      where: {
        email,
      },
    })
  )
  return twoFactorToken
}

export const deleteTwoFactorToken = async (tokenId: string) => {
  await db.twoFactorToken.delete({
    where: { id: tokenId },
  })
}

export const createTwoFactorToken = async (email: string) => {
  return await db.twoFactorToken.create({
    data: {
      email,
      token: crypto.randomInt(100_000, 1_000_000).toString(),
      expires: new Date(new Date().getTime() + 5 * 60 * 1000),
    },
  })
}
