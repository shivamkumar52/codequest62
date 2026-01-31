import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hash } from 'bcryptjs'
import { sendThankYouEmail, sendAdminSignInNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email is a string
    if (typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email must be a valid email address' },
        { status: 400 }
      )
    }

    // Validate password is a string
    if (typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Set admin role for specific email
    const role = email === 'shivta6200@gmail.com' ? 'admin' : 'user'

    // Create user
    const user = await db.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        password: hashedPassword,
        role,
        xp: 0,
        level: 1,
        streak: 0,
        maxStreak: 0
      }
    })

    // Send welcome email to user
    const welcomeEmailResult = await sendThankYouEmail(
      user.email,
      user.name || user.email.split('@')[0],
      user.id
    )

    // Send notification to admin about new user signup
    if (email !== 'shivta6200@gmail.com') {
      await sendAdminSignInNotification(
        user.name || user.email.split('@')[0],
        user.email,
        user.id
      )
    }

    // Return user without password
    const { password: userPassword, ...userWithoutPassword } = user as any

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword,
        emailSent: welcomeEmailResult.success
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
