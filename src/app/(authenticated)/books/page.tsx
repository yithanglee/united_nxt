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
                // appendQueries={{ book_category_id: book_category_id }}
                model={'BookInventory'}
                preloads={['book', 'book_category', 'author', 'publisher', 'organization', 'book_images']}
                search_queries={['d.name|c.name|b.title|a.code']}
                join_statements={[{book: 'book'}, {author: 'author'}, {publisher: 'publisher'}]}
                // buttons={[{ name: 'Approve', onclickFn: approveFn }]}
                customCols={
                    [
                        {
                            title: 'General',
                            list: [
                                'id',
                   
                                'code',
                                'book.title',
                                'book.price',
                             
                                'book.isbn',
                                'book.call_no',
                                {label: 'update_assoc.book', hidden: true , value: "true"},
                                {label: 'book_image.img_url', upload: true},
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
                    { label: 'Cover', data: 'img_url', through: ['book_images'], showImg: true },
                    { label: 'Barcode', data: 'code' },
                    { label: 'Title', data: 'title', through: ['book'] },
                    { label: 'Category', data: 'name', through: ['book_category'] },
                    { label: 'Price', data: 'price', through: ['book'] },
                    { label: 'Author', data: 'name', through: ['author'] ,altClass: 'text-xs'},

                    { label: 'Publisher', data: 'name', through: ['publisher'] ,altClass: 'text-xs' },




                ]}


            />
        </div>
    )
}