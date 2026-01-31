'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { Gamepad2, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const { user, signIn, isAuthenticated } = useAuth()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')

  // Move redirect to useEffect to avoid setState during render
  useEffect(() => {
    if (isAuthenticated() && user) {
      router.push('/courses')
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setDebugInfo('')
    setLoading(true)

    console.log('Sign In Name:', name)
    console.log('Sign In Email:', email)

    if (!name.trim()) {
      setError('Please enter your name')
      setLoading(false)
      return
    }

    if (!email.trim()) {
      setError('Please enter your email')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email')
      setLoading(false)
      return
    }

    try {
      setDebugInfo('Calling AuthContext signIn...')
      
      // ✅ CORRECT - Call AuthContext's signIn with just the email string
      await signIn(email.trim())
      
      setDebugInfo('Sign in successful!')
      router.push('/courses')
    } catch (err: any) {
      console.error('Error:', err)
      setDebugInfo('Catch error: ' + (err?.message || String(err)))
      setError(err?.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-8 group">
          <div className="flex items-center gap-2 group-hover:scale-105 transition-transform">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold">CodeQuest</span>
          </div>
        </Link>

        <Card className="border-2">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-2xl">Welcome Back, Adventurer!</CardTitle>
            <CardDescription>
              Sign in to continue your coding journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {debugInfo && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 px-4 py-3 rounded-lg text-xs">
                  <div>Debug: {debugInfo}</div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-600 px-4 py-3 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-transparent border-t-white rounded-full"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-4 text-center">
          <div className="bg-muted/50 rounded-lg p-6 border">
            <ShieldCheck className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Your Progress is Saved</h3>
            <p className="text-sm text-muted-foreground">
              Your name, email, and learning progress are saved in our database. Sign in again anytime to continue.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
     
