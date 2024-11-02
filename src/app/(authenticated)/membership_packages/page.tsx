'use client'; 
import DataTable from "@/components/data/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth"
import { PlusIcon } from 'lucide-react'

export default function MembershipPackagesPage() {

    // This is a placeholder for future implementation


    function approveFn(data: any) {
        console.log(data)
        return null;
    }


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Membership Packages</h2>

            </div>

            <DataTable canDelete={true}
                showNew={true}
                model={'MembershipPackage'}
                search_queries={['a.name']}
                // buttons={[{ name: 'Approve', onclickFn: approveFn }]}
                customCols={
                    [
                        {
                            title: 'General',
                            list: [
                                'id',
                                'name',
                                'price',
                                { label: 'desc', editor2: true },
                                { label: 'img_url', upload: true }

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
                    { label: 'Description', data: 'desc' },
                    { label: 'Price (MYR)', data: 'price' },
                    { label: 'Image', data: 'img_url', showPreview: true },
               

                ]}


            />
        </div>
    )
}