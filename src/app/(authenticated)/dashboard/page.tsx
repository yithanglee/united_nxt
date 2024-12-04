"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, X, BookOpen, User, RefreshCcw, Search, Plus, CornerDownLeft, Barcode } from 'lucide-react'
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from '@/lib/constants'
import { postData } from '@/lib/svt_utils'
import DataTable from '@/components/data/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BarcodeScanner from '@/components/data/barcodeScanner'
interface Member {
  id: number;
  name: string;
  code: string;
  group: {
    loan_limit: number;
    loan_period: number;
  };
}

interface Author {
  name: string;
}

interface Book {
  id: number;
  code: string;
  is_missing: boolean;
  book: {
    title: string;
    description: string;
  };
  author: Author;
}

interface Loan {
  id: number;
  book: {
    title: string;
  };
  return_date: string;
  has_extended: boolean;
  late_days: number;
  fine_amount: number;
  member: {
    name: string;
    code: string;
  };
}

interface IsNextReserveResponse {
  can_loan: boolean;
  member: {
    code: string;
  };
}

interface BookCanLoanResponse {
  length: number;
}
export default function LibraryManagementSystem() {
  const [member, setMember] = useState<Member | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [loanDate, setLoanDate] = useState<string>('');
  const [bookCodeDom, setBookCode] = useState<string>('');
  const [memberCodeDom, setMemberCode] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [memberOutstandingLoans, setMemberOutstandingLoans] = useState<Loan[]>([]);
  const [allOutstandingLoans, setAllOutstandingLoans] = useState<Loan[]>([]);
  const [canLoan, setCanLoan] = useState<boolean | null>(null);
  const [loanMessage, setLoanMessage] = useState<string>('');

  const { toast } = useToast()
  const url = `${PHX_HTTP_PROTOCOL}/${PHX_ENDPOINT}`



  const [showScanner, setShowScanner] = useState<'book' | 'member' | null>(null)

  const handleScan = (result: string) => {
    if (showScanner === 'book') {
      setBookCode(result)
      searchBook()
    } else if (showScanner === 'member') {
      setMemberCode(result)
      searchMember()
    }
    setShowScanner(null)
  }



  const setBookCodeBtn = async function (e: any) {
    console.log(e.code)
    setBookCode(e.code)

  }
  const setMemberCodeBtn = async function (e: any) {
    console.log(e.code)
    setMemberCode(e.code)

  }
  const handleBookInputChange = (key: string, value: string) => {

    setBookCode(value)
  };
  const handleMemberInputChange = (key: string, value: string) => {

    setMemberCode(value)
  };
  const searchMember = useCallback(async () => {
    const memberCode = document.querySelector<HTMLInputElement>('input[name="member_code"]')?.value
    if (!memberCode) {
      toast({ title: "Please enter a member code", variant: "destructive" })
      return
    }
    try {
      let memberRes = await postData({
        data: { member_code: memberCode },
        endpoint: `${url}/svt_api/webhook?scope=search_member`
      })
      if (memberRes && memberRes.length == 0) {
        toast({ title: "Member not found", variant: "destructive" })
        return
      }
      setMember(memberRes[0])
      let response = await fetch(`${url}/svt_api/webhook?scope=member_outstanding_loans&member_id=${memberRes[0].id}`)
      if (response.ok) {
        const loans = await response.json()
        setMemberOutstandingLoans(loans)
        setLoanDate(new Date().toISOString().split('T')[0])
        setReturnDate(new Date(Date.now() + memberRes[0].group.loan_period * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      }
      toast({ title: "Found member", description: memberRes[0].name, variant: "default" })

    } catch (error: any) {
      toast({ title: "Error searching member", description: error.message, variant: "destructive" })
    }
  }, [toast, member])


  const searchBook = async () => {
    const barcode = document.querySelector<HTMLInputElement>('input[name="barcode"]')?.value
    if (!barcode) {
      toast({ title: "Please enter a book barcode", variant: "destructive" })
      return
    }
    try {
      const result = await postData({
        data: { barcode: barcode },
        endpoint: `${url}/svt_api/webhook?scope=search_book`
      })
      if (result && result.length == 0) {
        toast({ title: "Book not found", variant: "destructive" })
        return
      }

      setBook(result[0])
      toast({ title: "Found book", description: result[0].book.title, variant: "default" })


      console.log('finish searching book')
    } catch (error: any) {
      toast({ title: "Error searching book", description: error.message, variant: "destructive" })
    }
  }



  useEffect(() => {
    const verifyLoan = async () => {
      if (!member || !book) {
        setCanLoan(null)
        setLoanMessage('')
        return
      }
      try {
        console.log('ceck book is missing..')
        if (book.is_missing) {
          setCanLoan(false)
          setLoanMessage(`${book.book.title} is missing.`)
          return
        }
        console.log('ceck book can loan..')
        const bookCanLoan = await postData({
          data: { member_id: member.id, book_inventory_id: book.id },
          endpoint: `${url}/svt_api/webhook?scope=book_can_loan`
        })

        console.log(bookCanLoan)

        if (bookCanLoan.length > 0) {
          setCanLoan(false)
          setLoanMessage(`${book.book.title} cannot be loaned.`)
          return
        }
        if (member.group.loan_limit <= memberOutstandingLoans.length) {
          setCanLoan(false)
          setLoanMessage("Loan limit reached!")
          return
        }
        const isNextReserve = await postData({
          data: { barcode: book.code, member_code: member.code },
          endpoint: `${url}/svt_api/webhook?scope=is_next_reserved_member`
        })
        if (isNextReserve.can_loan) {
          setCanLoan(true)
          setLoanMessage(`${book.book.title} can be loaned.`)
        } else {
          setCanLoan(false)
          setLoanMessage(`Reserved for ${isNextReserve.member.code}`)
        }
      } catch (error: any) {
        toast({ title: "Error verifying loan", description: error.message, variant: "destructive" })
      }
    }

    verifyLoan()
  }, [member, book])

  const processLoan = useCallback(async () => {
    if (!member || !book || !loanDate || !returnDate || !canLoan) {
      toast({ title: "Cannot process loan", description: "Please ensure all fields are filled and the book can be loaned.", variant: "destructive" })
      return
    }
    try {
      const result = await postData({
        data: { member_code: member.code, barcode: book.code, loan_date: loanDate, return_date: returnDate },
        endpoint: `${url}/svt_api/webhook?scope=process_loan`
      })
      if (result.status === "ok") {
        toast({ title: "Loan processed successfully" })
        setBook(null)
        setLoanMessage('')
        document.querySelector<HTMLInputElement>('input[name="barcode"]')!.value = ''
        const loans = await fetch(`${url}/svt_api/webhook?scope=member_outstanding_loans&member_id=${member.id}`)
        if (loans.ok) {
          const updatedLoans = await loans.json()
          setMemberOutstandingLoans(updatedLoans)
        }

        const allLoans = await fetch(`${url}/svt_api/webhook?scope=all_outstanding_loans`)
        if (allLoans.ok) {
          const updatedAllLoans = await allLoans.json()
          setAllOutstandingLoans(updatedAllLoans)
        }
      }
    } catch (error: any) {
      toast({ title: "Error processing loan", description: error.message, variant: "destructive" })
    }
  }, [member, book, loanDate, returnDate, canLoan, toast])

  const extendBook = useCallback(async (loanId: any) => {
    try {
      const result = await postData({
        data: { loan_id: loanId },
        endpoint: `${url}/svt_api/webhook?scope=extend_book`
      })
      if (result.status === "received") {
        toast({ title: "Book extended successfully" })
        if (member) {
          const loans = await fetch(`${url}/svt_api/webhook?scope=member_outstanding_loans&member_id=${member.id}`)
          if (loans.ok) {
            const updatedLoans = await loans.json()
            setMemberOutstandingLoans(updatedLoans)
          }
        }
        const allLoans = await fetch(`${url}/svt_api/webhook?scope=all_outstanding_loans`)
        if (allLoans.ok) {
          const updatedAllLoans = await allLoans.json()
          setAllOutstandingLoans(updatedAllLoans)
        }
      }
    } catch (error: any) {
      toast({ title: "Error extending book", description: error.message, variant: "destructive" })
    }
  }, [member, toast])

  const returnBook = useCallback(async (loanId: any) => {
    try {
      const result = await postData({
        data: { loan_id: loanId },
        endpoint: `${url}/svt_api/webhook?scope=return_book`
      })

      console.log(result)
      if (result.status === "received") {
        toast({ title: "Book returned successfully" })
        if (member) {
          const loans = await fetch(`${url}/svt_api/webhook?scope=member_outstanding_loans&member_id=${member.id}`)
          if (loans.ok) {
            const updatedLoans = await loans.json()
            setMemberOutstandingLoans(updatedLoans)
          }
        } else {
          setMemberOutstandingLoans([])

        }
        const allLoans = await fetch(`${url}/svt_api/webhook?scope=all_outstanding_loans`)
        if (allLoans.ok) {
          const updatedAllLoans = await allLoans.json()
          setAllOutstandingLoans(updatedAllLoans)
        }
      }
    } catch (error: any) {
      toast({ title: "Error returning book", description: error.message, variant: "destructive" })
    }
  }, [allOutstandingLoans])

  useEffect(() => {
    const fetchAllOutstandingLoans = async () => {
      const loans = await fetch(`${url}/svt_api/webhook?scope=all_outstanding_loans`)
      if (loans.ok) {
        const allLoans = await loans.json()
        setAllOutstandingLoans(allLoans)
      }
    }
    fetchAllOutstandingLoans()
  }, [])
  const [showReturnScanner, setShowReturnScanner] = useState<boolean>(false)

  const handleReturnScan = useCallback(async (scanData: any) => {
    try {
      const result = await postData({
        data: { scan_data: scanData },
        endpoint: `${url}/svt_api/webhook?scope=return_book_by_scan`
      })

      console.log(result)
      if (result.status === "received") {
        toast({ title: "Book returned successfully" })
        if (member) {
          const loans = await fetch(`${url}/svt_api/webhook?scope=member_outstanding_loans&member_id=${member.id}`)
          if (loans.ok) {
            const updatedLoans = await loans.json()
            setMemberOutstandingLoans(updatedLoans)
          }
        } else {
          setMemberOutstandingLoans([])

        }
        const allLoans = await fetch(`${url}/svt_api/webhook?scope=all_outstanding_loans`)
        if (allLoans.ok) {
          const updatedAllLoans = await allLoans.json()
          setAllOutstandingLoans(updatedAllLoans)
        }
      }
    } catch (error: any) {
      toast({ title: "Error returning book", description: error.message, variant: "destructive" })
    }
  }, [allOutstandingLoans, member, toast])

  return (
    <div className="container mx-auto p-4 ">

      <div>
        <h1 className="text-2xl font-bold mb-6">PMC Library</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Card>
            <CardContent className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className='col-span-2'>
                  <h3 className="text-lg font-semibold mb-2">Book Info</h3>
                  {book ? (
                    <div className="space-y-2">
                      <h4 className="font-medium">{book.book.title}</h4>
                      <p className="text-sm text-muted-foreground">by {book.author.name}</p>
                      <p className="text-sm">{book.book.description}</p>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-2" />
                      <p>Search for a book</p>
                    </div>
                  )}
                </div>
                <div className='col-span-2'>
                  <h3 className="text-lg font-semibold mb-2">Member Info</h3>
                  {member ? (
                    <div className="space-y-2">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">Code: {member.code}</p>
                      <div>
                        <h5 className="font-medium text-sm mb-1">Outstanding Loans</h5>
                        <ScrollArea className="h-[450px]">
                          {memberOutstandingLoans.map((loan) => (
                            <div key={loan.id} className="flex justify-between items-center mb-2 p-2 bg-muted rounded text-sm">
                              <div>
                                <p className="font-medium">{loan.book.title}</p>
                                <p className="text-xs text-muted-foreground">Return by: {loan.return_date}</p>
                              </div>
                              <div className="space-x-1">
                                {!loan.has_extended && (
                                  <Button size="sm" variant="outline" onClick={() => extendBook(loan.id)}><Plus className="h-3 w-3" /></Button>
                                )}
                                <Button size="sm" onClick={() => returnBook(loan.id)}><CornerDownLeft className="h-3 w-3" /></Button>
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <User className="h-12 w-12 mx-auto mb-2" />
                      <p>Search for a member</p>
                    </div>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader className="bg-primary text-primary-foreground">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Loan</h2>
                  <p>Process members loan</p>
                </div>
                <BookOpen className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div>
                <Label htmlFor="member_code">Members barcode</Label>
                <div className="flex space-x-2">
                  <Input id="member_code" name="member_code" value={memberCodeDom}

                    onChange={(e) => handleMemberInputChange(memberCodeDom, e.target.value)}
                  />
                  <Button onClick={searchMember}><Search className="h-4 w-4 mr-2" /> Search</Button>
                </div>
              </div>
              <div>
                <Label htmlFor="barcode">Books barcode</Label>
                <div className="flex space-x-2">
                  <Input
                    id="barcode"
                    name="barcode"
                    value={bookCodeDom}
                    onChange={(e) => handleBookInputChange(bookCodeDom, e.target.value)}
                  />
                  {/* <Button onClick={searchBook}><Search className="h-4 w-4 mr-2" /> Search</Button> */}
                  <Button onClick={() => setShowScanner('book')}><Barcode className="h-4 w-4 mr-2" /> Scan</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="loan_date">Loan Date</Label>
                  <Input id="loan_date" name="loan_date" type="date" value={loanDate} onChange={(e) => setLoanDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="return_date">Return Date</Label>
                  <Input id="return_date" name="return_date" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                {canLoan !== null && (
                  <div className={`flex items-center ${canLoan ? 'text-green-500' : 'text-red-500'}`}>
                    {canLoan ? <Check className="h-6 w-6 mr-2" /> : <X className="h-6 w-6 mr-2" />}
                    {loanMessage}
                  </div>
                )}
                <Button onClick={processLoan} className="w-full" disabled={!canLoan}>Process Loan</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Return</h2>
                  <p className="text-sm text-muted-foreground">Quick returns</p>
                </div>
                <RefreshCcw className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {allOutstandingLoans.map((loan) => (
                  <div key={loan.id} className="flex justify-between items-center mb-2 p-2 bg-muted rounded">
                    <div>
                      <p className="font-medium">{loan.book.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {loan.member.name} ({loan.member.code}) - Return by: {loan.return_date}
                      </p>
                      {loan.late_days > 0 && (
                        <p className="text-sm text-destructive">
                          Late by {loan.late_days} days - Fine: ${loan.fine_amount.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="space-x-2">
                      {loan.late_days === 0 && (
                        <Button size="sm" variant="outline" onClick={() => extendBook(loan.id)}><Plus className="h-4 w-4" /></Button>
                      )}
                      <Button size="sm" onClick={() => returnBook(loan.id)}><CornerDownLeft className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Outstanding Return: {allOutstandingLoans.length}</Button>
              <Button onClick={() => setShowReturnScanner(true)} className="w-full">
                <Barcode className="h-4 w-4 mr-2" /> Scan to Return
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="mt-8">
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="books">Books</TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Member Management</h2>
              </CardHeader>
              <CardContent>
                <DataTable
                  modelPath=''
                  model={'Member'}
                  preloads={['organization', 'group']}
                  buttons={[{ name: 'Use', onclickFn: setMemberCodeBtn }]}
                  search_queries={['a.name']}
                  customCols={[
                    {
                      title: 'General',
                      list: [
                        'id', 'name', 'username', 'email',
                        { label: 'is_approved', boolean: true },
                        'phone', 'username', 'password',
                        {
                          label: 'group_id',
                          customCols: null,
                          selection: 'Group',
                          search_queries: ['a.name'],
                          newData: 'name',
                          title_key: 'name'
                        },
                        {
                          label: 'organization_id',
                          customCols: null,
                          selection: 'Organization',
                          search_queries: ['a.name'],
                          newData: 'name',
                          title_key: 'name'
                        }
                      ]
                    },
                    {
                      title: 'Detail',
                      list: []
                    },
                  ]}
                  columns={[
                    { label: 'Organization', data: 'name', through: ['organization'] },
                    { label: 'Group', data: 'name', through: ['group'] },
                    { label: 'Member Code', data: 'code', subtitle: { label: 'psid', data: 'psid' } },
                    {
                      label: 'Approved?', data: 'is_approved', color: [
                        { key: false, value: 'destructive' },
                        { key: true, value: 'default' }
                      ]
                    },
                    { label: 'Name', data: 'name' },
                    { label: 'Username', data: 'username' },
                    { label: 'Email', data: 'email' },
                    { label: 'Phone', data: 'phone' },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="books">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Book Inventory</h2>
              </CardHeader>
              <CardContent>
                <DataTable
                  modelPath=''
                  itemsPerPage={10}
                  model={'BookInventory'}
                  preloads={['book', 'book_category', 'author', 'organization', 'book_images']}
                  join_statements={[{ book: 'book' }]}
                  search_queries={['a.code|b.title']}
                  buttons={[{ name: 'Use', onclickFn: setBookCodeBtn }]}
                  customCols={[
                    {
                      title: 'General',
                      list: [
                        'id', 'code', 'book.title', 'book.price', 'book.isbn', 'book.call_no',
                        { label: 'update_assoc.book', hidden: true, value: "true" },
                        { label: 'book_image.img_url', upload: true },
                        {
                          label: 'organization_id',
                          customCols: null,
                          selection: 'Organization',
                          search_queries: ['a.name'],
                          newData: 'name',
                          title_key: 'name'
                        }
                      ]
                    },
                    {
                      title: 'Detail',
                      list: []
                    },
                  ]}
                  columns={[
                    { label: 'Cover', data: 'img_url', through: ['book_images'], showImg: true },
                    { label: 'Barcode', data: 'code' },
                    { label: 'Title', data: 'title', through: ['book'] },
                    { label: 'Category', data: 'name', through: ['book_category'] },
                    { label: 'Price', data: 'price', through: ['book'] },
                    { label: 'Barcode', data: 'code' },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <BarcodeScanner onScan={handleScan} scanType={showScanner} />
            <Button onClick={() => setShowScanner(null)} className="mt-4 w-full">Close Scanner</Button>
          </div>
        </div>
      )} */}


      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">

            <div className="mb-4">
              <Label htmlFor="book_code_scan">Book Code</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="book_code_scan"
                  name="book_code_scan"
                  value={bookCodeDom}
                  onChange={(e) => handleBookInputChange(bookCodeDom, e.target.value)}
                />
                <Button onClick={searchBook}><Search className="h-4 w-4 mr-2" /> Search</Button>
              </div>
            </div>

            <BarcodeScanner
              onScan={handleScan}
              scanType={showScanner}
            // memberCode={memberCodeDom}
            // onMemberCodeChange={(e) => handleMemberInputChange(memberCodeDom, e.target.value)}
            // onSearchMember={searchMember}
            />
            <Button onClick={() => setShowScanner(null)} className="mt-4 w-full">Close Scanner</Button>
          </div>
        </div>
      )}
      {showReturnScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Scan Book to Return</h3>
            <BarcodeScanner
              onScan={handleReturnScan}
              scanType="book"
            />
            <Button onClick={() => setShowReturnScanner(false)} className="mt-4 w-full">
              Close Scanner
            </Button>
          </div>
        </div>
      )}


    </div>
  )
}