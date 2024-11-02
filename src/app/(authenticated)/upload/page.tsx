"use client"
import DataTable from "@/components/data/table"
import ExcelGrid from "@/components/gridCells"
import { useRouter} from "next/navigation";
export default function MembersPage() {
  const router = useRouter()
  // This is a placeholder for future implementation

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Book Uploads</h2>

      </div>
      <ExcelGrid postFn={() => {
         router.push('/upload');
         location.reload()
      }}>

      </ExcelGrid>

      <DataTable 
        canDelete={true}
        showNew={true}
        model={'BookUpload'}
        preloads={[{ 'book_inventories': 'book' }]}
        search_queries={['a.name']}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id',

                // {
                //   label: 'organization_id',
                //   customCols: null,
                //   selection: 'Organization',
                //   search_queries: ['a.name'],
                //   newData: 'name',
                //   title_key: 'name'
                // }

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
          // { label: 'Organization', data: 'name', through: ['organization'] },
          // { label: 'Member Code', data: 'code', subtitle: {label: 'psid', data: 'psid'} },
          { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 },
          { label: 'Lines', data: 'book_inventories', showJson: true },
          { label: 'Uploaded', data: 'uploaded_qty' }, 
          { label: 'Failed', data: 'failed_qty' },
          { label: 'Failed', data: 'failed_lines', showJson: true },
       
        ]}


      />
    </div>
  )
}