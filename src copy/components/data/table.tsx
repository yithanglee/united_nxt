'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useModel } from '@/lib/provider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { JSONTree } from 'react-json-tree';
import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

import { genInputs, postData } from '@/lib/svt_utils'
import DynamicForm from './dynaform'
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from '@/lib/constants'
import { ImageIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import SearchInput from './searchInput';
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Anybody } from 'next/font/google';

// Assuming these are defined in your environment variables

const url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;
// Type for custom columns
interface CustomCol {
  title: string;

  list: (string | {
    label: string
    hidden?: boolean
    value?: any
    selection?: string | string[]
    customCols?: any
    search_queries?: string[]
    newData?: string
    title_key?: string
    boolean?: boolean
    editor?: boolean
    editor2?: boolean
    upload?: boolean
    alt_class?: string
    date?: boolean
  } | CustomSubCol)[]
}
interface CustomSubCol {
  label: string;
  alt_class?: string;
  customCols?: CustomCol[] | null;
  selection: string | string[];
  search_queries: string[];
  newData: string;
  title_key: string;
}
interface DataTableProps {
  appendQueries?: Record<any, any>
  showNew?: boolean
  showGrid?: boolean
  canDelete?: boolean
  search_queries?: string[]
  join_statements?: Record<any, any>
  model: string
  preloads?: string[] | Record<any, any>
  buttons?: {
    name: string
    onclickFn: (item: any, refreshData: () => void, confirmModalFn: (bool: boolean, message: string, fn: () => void, opts?: any) => void) => void
    href?: (item: any) => string
    showCondition?: (item: any) => boolean
  }[]
  customCols?: CustomCol[];

  columns: {
    label: string
    data: string
    subtitle?: { label: string, data: string }
    formatDateTime?: boolean
    offset?: number
    isBadge?: boolean
    showImg?: boolean
    showJson?: boolean
    showPreview?: boolean
    showDateTime?: boolean
    color?: { key: string | boolean, value: string }[]
    through?: string[]
    altClass?: string
  }[]
}

export default function DataTable({

  appendQueries = {},
  showNew = false,
  showGrid = false,
  canDelete = false,
  join_statements = [],
  search_queries = [],
  model,
  preloads = [],
  buttons = [],
  customCols = [],
  columns
}: DataTableProps) {


  const { toast } = useToast()
  const [items, setItems] = useState<any[]>([])
  const { data, setData } = useModel();
  const [colInputs, setColInputs] = useState<any[]>([]) // State to hold colInputs
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchQuery, setSearchQuery] = useState<Record<string, string>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmModalMessage, setConfirmModalMessage] = useState('')
  const [confirmModalFunction, setConfirmModalFunction] = useState<(() => void) | null>(null)

  const [error, setError] = useState<string | null>(null)

  const [previewModal, setPreviewModal] = useState(false)
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  let selectedData = {};
  const itemsPerPage = 100

  let isLoading = false, isLoading2 = false;

  // Fetch colInputs using genInputs inside useEffect
  useEffect(() => {
    const fetchColInputs = async () => {
      isLoading = true;
      const inputs = await genInputs(url, model);
      isLoading = false;
      setColInputs(inputs);
    };



    if (!isLoading) {
      fetchColInputs();
    }




  }, []);

  const buildSearchString = useCallback((query: any) => {


    if (Object.keys(query).length == 0) {
      return null
    } else {
      const slist = Object.entries(query)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
      return slist.join('|') || search_queries.join('|')
    }


  }, [search_queries])

  function buildQueryString(data: any, parentKey: any) {
    return Object.keys(data)
      .map((key): any => {
        const nestedKey = parentKey
          ? `${parentKey}[${encodeURIComponent(key)}]`
          : encodeURIComponent(key);

        if (data[key] != null && typeof data[key] === 'object' && !Array.isArray(data[key])) {
          return buildQueryString(data[key], nestedKey);
        } else if (data[key] == null) {

          return ``;
        } else {
          return `${nestedKey}=${encodeURIComponent(data[key])}`;
        }
      })
      .join('&');
  }
  const fetchData = useCallback(async (pageNumber: number) => {

    if (isLoading2) return; // Avoid fetching data while it's already being fetched
    isLoading2 = true;


    setError(null);
    let finalSearchQuery: Record<any, any> | string = {};
    finalSearchQuery = searchQuery
    console.log(finalSearchQuery)

    try {
      for (const key in finalSearchQuery) {
        if (finalSearchQuery[key] === '') {
          delete finalSearchQuery[key];
        }
      }

    } catch (e) {
      finalSearchQuery = ''
    }

    const apiData = {
      search: { regex: 'false', value: finalSearchQuery },
      additional_join_statements: JSON.stringify(join_statements),
      additional_search_queries: buildSearchString(searchQuery),
      draw: '1',
      length: itemsPerPage,
      model: model,
      columns: { 0: { data: 'id', name: 'id' } },
      order: { 0: { column: 0, dir: 'desc' } },
      preloads: JSON.stringify(preloads),
      start: (pageNumber - 1) * itemsPerPage,
    };

    const queryString = buildQueryString({ ...apiData, ...appendQueries }, null);
    const blog_url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;
    console.info(apiData)
    try {
      const response = await fetch(`${blog_url}/svt_api/${model}?${queryString}`, {
        headers: {
          'content-type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const dataList = await response.json();
      setItems(dataList.data);
      setData(dataList.data);
      setTotalPages(Math.ceil(dataList.recordsFiltered / itemsPerPage));
    } catch (error) {
      console.error('An error occurred', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      isLoading2 = true;

    }
  },
    [model, searchQuery, appendQueries, preloads, buildSearchString]
  );
  useEffect(() => {

    if (!isLoading2) {
      fetchData(currentPage); // This will automatically fetch data when currentPage or searchQuery changes
    }
  }, [currentPage, searchQuery]); // Trigger only when these states change


  // const updateUrlWithSearch = useCallback(() => {
  //   const searchParam = JSON.stringify(searchQuery)
  //   const newParams = new URLSearchParams(searchParams.toString())
  //   newParams.set('search', searchParam)
  //   console.log(router)
  //   router.replace(`${window.location.pathname}?${newParams.toString()}`, { scroll: false })
  // }, [router, searchParams, searchQuery])


  // const parseSearchFromUrl = useCallback(() => {
  //   const searchParam = searchParams.get('search')
  //   console.log(searchParam)
  //   if (searchParam) {
  //     try {
  //       const parsedSearch = JSON.parse(searchParam)
  //       console.log(parsedSearch)
  //       setSearchQuery(parsedSearch)
  //     } catch (error) {
  //       console.error('Error parsing search query from URL:', error)
  //     }
  //   }
  // }, [searchParams])

  // Effect to update URL when search query changes
  useEffect(() => {
    if (Object.keys(searchQuery).length) {
      // updateUrlWithSearch()
    }
  }, [searchQuery])



  // Modify handleSearch to include URL update
  const handleSearch = (newSearchQuery: any) => {
    setSearchQuery(newSearchQuery)
    setCurrentPage(1)
    // updateUrlWithSearch()
  }
  // Effect to parse search query from URL on initial load
  // useEffect(() => {
  //   parseSearchFromUrl()
  // }, [parseSearchFromUrl])

  const handleNew = () => {
    setSelectedItem({ ...{ id: "0" }, ...appendQueries })
    setIsModalOpen(true)

  }

  const handleEdit = (item: any) => {

    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setConfirmModalMessage("Are you sure you want to delete this item?");
    setConfirmModalFunction(() => async () => {
      (async () => {


        await postData({
          method: "DELETE",
          endpoint: `${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/svt_api/${model}/${item.id}`,
        });

        await fetchData(currentPage); // Explicitly await fetchData

        setConfirmModalOpen(false);

        toast({
          title: "Action completed!",
          description: "Your action was successful!",
        });
      })();
    });
    setConfirmModalOpen(true);
  };


  const confirmModalFn = (bool: boolean, message: string, fn: () => void, opts?: any) => {
    setConfirmModalOpen(bool)
    setConfirmModalMessage(message)
    setConfirmModalFunction(() => fn)
  }


  interface Column {
    altClass?: string;
    data: string
    subtitle?: { label: string, data: string }
    showPreview?: boolean
    formatDate?: boolean
    formatDateTime?: boolean
    through?: string[]
    color?: { key: string | boolean; value: string }[]
    showImg?: boolean
    showJson?: boolean

    isBadge?: boolean
    offset?: number
  }

  const renderCell = (item: any, column: Column) => {


    const url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT

    const badgeColor = (value: string | boolean, conditionList: { key: string | boolean; value: string }[]) => {
      const result = conditionList.find(v => v.key === value)

      return result ? result.value : 'destructive'
    }

    const checkAssoc = (data: any, val: string, through: string[]) => {
      try {
        if (data[through[0]]) {

          if (column.showImg) {

            if (data[through[0]][0]) {
              return (

                <Image
                  className="rounded-lg"
                  src={`${url}${data[through[0]][0][val] ? data[through[0]][0][val] : '/'}`}
                  alt={`Image for ${column.data}`}
                  width={160}
                  height={120}
                />

              )
            } else {
              return <ImageIcon></ImageIcon>
            }
          }

          return data[through[0]][val]
        } else {
          return ''
        }



      } catch (e) {
        console.error(e)
        return ''
      }
    }

    const formatDate = (date: string, offset: number = 0) => {
      const dt = new Date(date)
      dt.setTime(dt.getTime() + offset * 60 * 60 * 1000)
      return dt.toLocaleDateString('en-GB', {
        timeZone: 'Asia/Kuala_Lumpur',
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatDateTime = (date: string, offset: number = 0) => {
      const dt = new Date(date)
      dt.setTime(dt.getTime() + offset * 60 * 60 * 1000)
      return dt.toLocaleString('en-GB', {
        timeZone: 'Asia/Kuala_Lumpur',
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    let value = item[column.data]


    if (column.subtitle) {
      return (
        <>
          {value}
          <br />
          <small className="font-extralight dark:text-white">
            {item[column.subtitle.data]}
          </small>
        </>
      )
    }

    if (column.showPreview) {
      return (
        <>
          <Button
            onClick={() => {
              setImgUrl(value)
              setPreviewModal(true)
            }}
            disabled={!value}
          >
            Preview
          </Button>
          <Dialog open={previewModal} onOpenChange={setPreviewModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Preview</DialogTitle>
              </DialogHeader>
              {imgUrl && (
                <Image src={`${url}${imgUrl}`} alt="Preview" width={1200} height={700} />
              )}
            </DialogContent>
          </Dialog>
        </>
      )
    }

    if (column.formatDate) {
      return formatDate(value, column.offset)
    }

    if (column.formatDateTime) {
      return (<><small>{formatDateTime(value, column.offset)}</small></>)
    }

    if (column.through) {
      return checkAssoc(item, column.data, column.through)
    }

    if (column.color) {

      let showVal = value


      if ([true, false].includes(value)) {
        showVal = value ? 'Yes' : 'No'
      }
      return (
        <Badge className="capitalize" variant={badgeColor(value, column.color) as any}>
          {showVal.replace("_", " ")}
        </Badge>
      )
    }
    if (column.showJson) {

      let theme = {
        scheme: 'bright',
        author: 'chris kempson (http://chriskempson.com)',
        base00: '#000000',
        base01: '#303030',
        base02: '#505050',
        base03: '#b0b0b0',
        base04: '#d0d0d0',
        base05: '#e0e0e0',
        base06: '#f5f5f5',
        base07: '#ffffff',
        base08: '#fb0120',
        base09: '#fc6d24',
        base0A: '#fda331',
        base0B: '#a1c659',
        base0C: '#76c7b7',
        base0D: '#6fb3d2',
        base0E: '#d381c3',
        base0F: '#be643c'
      };
      return (
        <div className="hasJson">
          <JSONTree data={value}
            shouldExpandNodeInitially={(k, d, l) => {

              return false;
            }}
            theme={{
              extend: theme,

              valueLabel: {
                textDecoration: 'underline',
              },

            }}


          />
        </div>

      )

    }

    if (column.showImg) {

      if (value) {
        return (
          <div style={{ width: '120px' }}>
            <Image
              className="rounded-lg"
              src={`${url}${value ? value : '/'}`}
              alt={`Image for ${column.data}`}
              width={120}
              height={80}
            />
          </div>
        )
      } else {
        return (
          <div style={{ width: '120px' }}>
            <ImageIcon></ImageIcon>
          </div>
        )
      }

    }

    if (column.isBadge) {
      return (
        <Badge className="capitalize" variant="default">
          {value ? value.split('_').join(' ') : ''}
        </Badge>
      )
    }


    return value || ''
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (

    <div className="space-y-4">
      <div className="flex space-x-2">
        <SearchInput
          model={model}
          join_statements={join_statements}
          oriSearchQuery={searchQuery}
          searchQueries={search_queries} onSearch={handleSearch} />


        {showNew && <Button onClick={
          handleNew
        }><PlusIcon className="mr-2 h-4 w-4" />New</Button>}
      </div>
      <div className=" rounded-md border">
        {showGrid &&
          <div className='grid grid-cols-6 gap-4'>

            {items.map((item, itemIndex) => (

              <div key={itemIndex} className='p-6'>
                {columns.map((column, columnIndex) => (
                  <div key={columnIndex} >
                    {column.altClass && <div className={column.altClass}>
                      {renderCell(item, column)}
                    </div>}
                    {!column.altClass && renderCell(item, column)}
                  </div>
                ))}
              </div>


            ))}

          </div>}

        {!showGrid &&
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index}>{column.label}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, itemIndex) => (
                <TableRow key={itemIndex}>
                  {columns.map((column, columnIndex) => (
                    <TableCell key={columnIndex}>
                      {renderCell(item, column)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="ghost" onClick={() => handleEdit(item)}>Edit</Button>
                    {buttons.map((button, buttonIndex) => {
                      if (button.showCondition && !button.showCondition(item)) {
                        return null;
                      }

                      const buttonProps = {
                        key: buttonIndex,
                        variant: "ghost" as const,
                        onClick: button.onclickFn
                          ? () => button.onclickFn!(item, () => fetchData(currentPage), confirmModalFn)
                          : undefined
                      };

                      const buttonContent = <span>{button.name}</span>;

                      if (button.href) {
                        const href = typeof button.href === 'function' ? button.href(item) : button.href;
                        return (
                          <Button asChild {...buttonProps}>
                            <Link href={href}>
                              {buttonContent}
                            </Link>
                          </Button>
                        );
                      }

                      return (
                        <Button {...buttonProps}>
                          {buttonContent}
                        </Button>
                      );
                    })}




                    {canDelete && (
                      <Button variant="ghost" onClick={() => handleDelete(item)}>Delete</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
      </div>

      <div className="flex justify-center space-x-2">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <DynamicForm data={selectedItem} inputs={colInputs} customCols={customCols} module={model} postFn={function (): void {
            setIsModalOpen(false)
            fetchData(currentPage);
          }}

          />
        </DialogContent>
      </Dialog>

      <Dialog open={confirmModalOpen} onOpenChange={
        setConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <DialogDescription>{confirmModalMessage}</DialogDescription>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
            <Button onClick={() => confirmModalFunction && confirmModalFunction()}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>

  )
}
