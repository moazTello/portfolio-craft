'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import Link from 'next/link'

const schema = z.object({
  email: z.string().email('Invalid email'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    try {
      await fetch('http://localhost:3001/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      setSent(true)
    } catch {
      toast.error('Something went wrong')
    }
  }

  if (sent) {
    return (
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full max-w-md text-center">
        <div className="text-4xl mb-4">📧</div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Check your email</h1>
        <p className="text-gray-500 text-sm">If this email exists, you will receive a reset link.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full max-w-md">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Forgot password?</h1>
      <p className="text-gray-500 text-sm mb-6">We'll send you a reset link</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/login" className="text-indigo-600 hover:underline">Back to login</Link>
      </p>
    </div>
  )
}