'use server'

import { getUserByEmail } from '@/data/user'
import { sendPasswordResetEmail } from '@/lib/mail'
import { generatePasswordResetToken } from '@/lib/tokens'
import { ResetSchema } from '@/schema'
import { z } from 'zod'

export const reset = async (value: z.infer<typeof ResetSchema>) => {
  const { success, data } = ResetSchema.safeParse(value)

  if (!success) return { error: 'Invalid email' }

  const { email } = data
  const existingUser = await getUserByEmail(email)
  if (!existingUser) return { error: 'Email not found' }

  const passwordResetToken = await generatePasswordResetToken(email)

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  )

  return { success: 'Reset email send' }
}
