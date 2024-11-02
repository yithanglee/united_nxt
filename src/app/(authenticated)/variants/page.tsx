'use client';
import DataTable from "@/components/data/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth"
import ModelProvider from "@/lib/provider";

import { PlusIcon } from 'lucide-react'

export default function PaymentsPage() {

    // This is a placeholder for future implementation


    function approveFn(data: any) {
        console.log(data)
        return null;
    }
    function hrefFn(data: any) {
        console.log(data)
        return '/variants/' + data.id + '/prices';
    }


    return (
        <ModelProvider>
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Product Variants</h2>

            </div>
       
            <DataTable canDelete={true}
                showNew={true}
                model={'Variant'}
                preloads={['product', 'uom']}
                search_queries={['b.name']}
                buttons={[{ name: 'Prices', onclickFn: approveFn, href: hrefFn }]}
                customCols={
                    [
                        {
                            title: 'General',
                            list: [
                                'id',
                                'name',
                                'sku_barcode',
                                {label: 'img_url', upload: true},
                                {
                                    label: 'product_id',
                                    customCols: null,
                                    selection: 'Product',
                                    search_queries: ['a.name'],
                                    newData: 'name',
                                    title_key: 'name'
                                },
                                {
                                    label: 'uom_id',
                                    customCols: null,
                                    selection: 'UnitMeasurement',
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
                    { label: 'Image', data: 'img_url', showImg: true },
                    { label: 'Name', data: 'name' },
                    { label: 'Unit', data: 'name', through: ['uom'] },
                    { label: 'Barcode', data: 'sku_barcode' },
                    { label: 'Product', data: 'name', through: ['product'] },
                    { label: 'Timestamp', data: 'inserted_at', formatDateTime: true , offset: 8},



                ]}


            />
            
        </div>
        </ModelProvider>
    )
}