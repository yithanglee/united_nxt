'use client';
import DataTable from "@/components/data/table"
import { useEffect, useState } from "react";

export default function PaymentsPage({ params }: { params: { book_category_id: string } }) {
    const [data, setData] = useState<any[]>([]);
    console.log(data)
    const book_category_id = params.book_category_id
    // Load data from localStorage when the component mounts
    useEffect(() => {
        const storedData = localStorage.getItem('modelData');  // Replace 'modelData' with your key
        if (storedData) {
            setData(JSON.parse(storedData));  // Parse and set the data in state
        }
    }, []);
    // This is a placeholder for future implementation

    function approveFn(data: any) {
        console.log(data)
        return null;
    }


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Inventories</h2>

            </div>


            <DataTable canDelete={true}
                showNew={true}
                appendQueries={{ book_category_id: book_category_id }}
                model={'BookInventory'}
                preloads={['book', 'book_category', 'author', 'organization']}
                search_queries={['b.name']}
                // buttons={[{ name: 'Approve', onclickFn: approveFn }]}
                customCols={
                    [
                        {
                            title: 'General',
                            list: [
                                'id',
                                //    {label:  'code', alt_name: 'Barcode'},
                                'code',
                                'book.title',
                                'book.price',
                                // {
                                //     label: 'book.author_id',
                                //     customCols: null,
                                //     selection: 'Author',
                                //     search_queries: ['a.name'],
                                //     newData: 'name',
                                //     title_key: 'name'
                                // },
                                // {
                                //     label: 'publisher_id',
                                //     customCols: null,
                                //     selection: 'Publisher',
                                //     search_queries: ['a.name'],
                                //     newData: 'name',
                                //     title_key: 'name'
                                // },
                                'book.isbn',
                                'book.call_no',
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
                            list: [

                            ]
                        },
                    ]
                }
                columns={[
                    { label: 'Title', data: 'title', through: ['book'] },
                    { label: 'Category', data: 'name', through: ['book_category'] },
                    { label: 'Price', data: 'price', through: ['book'] },
                    { label: 'Barcode', data: 'code' },






                ]}


            />
        </div>
    )
}