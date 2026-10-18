'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LockIcon, MailIcon } from 'lucide-react'
import { useLogin } from '@/lib/useLogin'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"

interface TurnstileInstance {
  render: (container: string | HTMLElement, options: any) => string
  reset: (widgetId?: string) => void
  getResponse: (widgetId?: string) => string | undefined
  remove: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileInstance
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileWidgetId = useRef<string>()
  const { handleLogin, error } = useLogin()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const resetTurnstile = useCallback(() => {
    setTurnstileToken('')
    if (window.turnstile) {
      try {
        if (turnstileWidgetId.current) {
          window.turnstile.reset(turnstileWidgetId.current)
        } else {
          window.turnstile.reset()
        }
      } catch (err) {
        console.warn('Turnstile reset error:', err)
      }
    }
  }, [])

  const initTurnstile = useCallback(() => {
    const turnstileContainer = document.getElementById('cf-turnstile')
    if (window.turnstile && turnstileContainer && !turnstileWidgetId.current) {
      try {
        turnstileWidgetId.current = window.turnstile.render(turnstileContainer, {
          sitekey: '0x4AAAAAAAz-_sGAaRbcy8Ks',
          callback: (token: string) => {
            setTurnstileToken(token)
          },
          'expired-callback': () => {
            setTurnstileToken('')
          },
          'error-callback': () => {
            setTurnstileToken('')
            toast({
              title: "Verification Error",
              description: "Failed to load verification challenge. Please refresh the page.",
              variant: "destructive",
            })
          }
        })
      } catch (err) {
        console.warn('Turnstile render warning:', err)
      }
    }
  }, [toast])

  const handleTurnstileLoad = useCallback(() => {
    initTurnstile()
  }, [initTurnstile])

  useEffect(() => {
    // If turnstile is already loaded when component mounts
    if (window.turnstile) {
      handleTurnstileLoad()
    }

    return () => {
      // Cleanup turnstile widget when component unmounts
      if (window.turnstile && turnstileWidgetId.current) {
        try {
          window.turnstile.remove(turnstileWidgetId.current)
        } catch {}
        turnstileWidgetId.current = undefined
      }
    }
  }, [handleTurnstileLoad])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const activeToken =
        turnstileToken ||
        (turnstileWidgetId.current ? window.turnstile?.getResponse(turnstileWidgetId.current) : undefined) ||
        window.turnstile?.getResponse() ||
        ''
      
      if (!activeToken) {
        toast({
          title: "Verification Required",
          description: "Please complete the verification challenge.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      await handleLogin(email, password, activeToken)
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      resetTurnstile()
    }
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        async
        defer
        onLoad={handleTurnstileLoad}
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Enter your email and password to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Username</Label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    placeholder="m@example.com"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div id="cf-turnstile"></div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}