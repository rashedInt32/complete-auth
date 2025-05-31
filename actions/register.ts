'use server'
import { createUser, getUserByEmail } from '@/data/user'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/tokens'
import { RegisterSchema } from '@/schema'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values)
  if (!validateFields.success) return { error: 'Invalid fields' }

  const { email, password, name } = validateFields.data

  const user = await getUserByEmail(email)
  if (user) return { error: 'user already exits' }

  const hashedPassword = await bcrypt.hash(password, 10)

  await createUser({
    email,
    password: hashedPassword,
    name,
  })

  const verificationToken = await generateVerificationToken(email)

  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { success: 'User created' }
}
