import { db } from '@/lib/db'
import to from 'await-to-js'

export const getTwoFactorConfirmationbyUserId = async (
  confimationId: string
) => {
  const [err, resp] = await to(
    db.twoFactorConfirmation.findUnique({
      where: { userId: confimationId },
    })
  )
  console.log({
    from: 'getTwoFActorConfirmationbyUserId',
    err: err,
    resp: resp,
  })
  return resp
}

export const deleteTwoFactorConfirmation = async (confimationId: string) => {
  try {
    await db.twoFactorConfirmation.delete({
      where: { id: confimationId },
    })
  } catch {
    return null
  }
}

export const createTwoFActorConfirmation = async (userId: string) => {
  const [err, resp] = await to(
    db.twoFactorConfirmation.create({
      data: {
        userId: userId,
      },
    })
  )
}
