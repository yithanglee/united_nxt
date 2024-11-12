'use client';
import DataTable from "@/components/data/table"
import { useEffect, useState } from "react";

export default function PaymentsPage({ params }: { params: { variant_id: string } }) {
    const [data, setData] = useState<any[]>([]);
    console.log(data)
    const variantId = params.variant_id
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
                <h2 className="text-3xl font-bold tracking-tight">Product Variant Prices</h2>

            </div>


            <DataTable canDelete={true}
                showNew={true}
                appendQueries={{ variant_id: variantId }}
                model={'Price'}
                preloads={['variant', 'price_group']}
                search_queries={['b.name']}
                // buttons={[{ name: 'Approve', onclickFn: approveFn }]}
                customCols={
                    [
                        {
                            title: 'General',
                            list: [
                                'id',
                                'variant_id',
                                'amount',
                                {
                                    label: 'price_group_id',
                                    customCols: null,
                                    selection: 'PriceGroup',
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
                    { label: 'Variant', data: 'name', through: ['variant'] },
                    { label: 'Group', data: 'name', through: ['price_group'] },
                    { label: 'Amount', data: 'amount' },






                ]}


            />
        </div>
    )
}