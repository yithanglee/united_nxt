import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, BarChart3, Clock, DollarSign } from 'lucide-react'

export default function LandingPage() {
  return (
    <div style={{
      height: '100vh',
      overflow: 'scroll',
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(/images/library.jpeg)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center'
    }}>
      <div className="flex flex-col  items-center justify-center" >
        <header className="text-white  px-4 lg:px-6 h-14 flex items-center w-full ">
          <Link className="flex items-center justify-center" href="#">
            <BookOpen className="h-6 w-6" />
            <span className="ml-2 text-2xl font-bold">United v3</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="hidden text-sm font-medium hover:underline underline-offset-4" href="#features">
              Features
            </Link>
            <Link className="hidden text-sm font-medium hover:underline underline-offset-4" href="#benefits">
              Benefits
            </Link>
            <Link className="hidden text-sm font-medium hover:underline underline-offset-4" href="#pricing">
              Pricing
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
              Login
            </Link>
          </nav>
        </header>
        <main className="w-full flex flex-col items-center justify-center">
          <section className="flex justify-center w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-white  text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Revolutionize Your Community Library
                  </h1>
                  <p className="text-white  mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Empower your library with data-driven decisions, efficient loan management, and enhanced user experiences.
                  </p>
                </div>
                <div className="space-x-4">
                  <Button>Get Started</Button>
                  <Button variant="outline">Learn More</Button>
                </div>
              </div>
            </div>
          </section>
          <section id="features" className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" /> Loan Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    Easily track and manage book loans, extensions, and returns.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-4 w-4" /> User Accounts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    Provide personalized experiences with individual user accounts.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" /> Data Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    Gain insights into reading trends and popular genres.
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section id="benefits" className="flex justify-center w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <h2 className="text-white text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" /> Time-Saving
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    Automate routine tasks and streamline library operations.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" /> Cost-Effective
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    Make informed decisions on book purchases based on real data.
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Users Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Sarah Johnson</CardTitle>
                  </CardHeader>
                  <CardContent>
                    &quot;United v3 has transformed how we manage our community library. The data insights are invaluable!&quot;
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Mike Thompson</CardTitle>
                  </CardHeader>
                  <CardContent>
                    &quot;Our patrons love the easy-to-use interface, and we ve seen a significant increase in engagement.&quot;
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Emily Chen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    &quot;The reporting features have helped us make smarter decisions about our book purchases.&quot;
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section id="pricing" className="flex justify-center w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <h2 className="text-white  text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Pricing Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">$49/mo</p>
                    <ul className="mt-4 space-y-2">
                      <li>Up to 5,000 books</li>
                      <li>Basic reporting</li>
                      <li>Email support</li>
                    </ul>
                    <Button className="mt-4 w-full">Choose Plan</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Pro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">$99/mo</p>
                    <ul className="mt-4 space-y-2">
                      <li>Up to 20,000 books</li>
                      <li>Advanced reporting</li>
                      <li>Priority support</li>
                    </ul>
                    <Button className="mt-4 w-full">Choose Plan</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">Custom</p>
                    <ul className="mt-4 space-y-2">
                      <li>Unlimited books</li>
                      <li>Custom reporting</li>
                      <li>24/7 support</li>
                    </ul>
                    <Button className="mt-4 w-full">Contact Us</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to Transform Your Library?
                  </h2>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Join thousands of libraries already benefiting from United v3.
                  </p>
                </div>
                <div className="space-x-4">
                  <Button size="lg">Get Started Now</Button>
                  <Button size="lg" variant="outline">Request a Demo</Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 United v3. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </div>

  )
}

