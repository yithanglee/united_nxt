import DataTable from "@/components/data/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth"
import { PlusIcon } from 'lucide-react'

export default function SellersPage() {

  // This is a placeholder for future implementation

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Authors</h2>

      </div>

      <DataTable canDelete={true}
        showNew={true}
        model={'Author'}
        search_queries={['a.name']}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id',
                'name',
    


              ]
            },
            {
              title: 'Detail',
              list: [ 'id',
           
              ]
            },
          ]
        }
        columns={[

          { label: 'Name', data: 'name' },
    


        ]}


      />
    </div>
  )
}