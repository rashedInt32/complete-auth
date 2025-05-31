import { db } from '@/lib/db'
import { RegisterSchema } from '@/schema'
import { z } from 'zod'

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } })

    return user
  } catch {
    return null
  }
}

export const getUserById = async (userId: string | undefined) => {
  try {
    const user = await db.user.findUnique({ where: { id: userId } })

    return user
  } catch {
    return null
  }
}

export const createUser = async (values: z.infer<typeof RegisterSchema>) => {
  return await db.user.create({
    data: values,
  })
}

export const updateUser = async (userId: string, data: Record<string, any>) => {
  return db.user.update({
    where: { id: userId },
    data: { ...data },
  })
}
