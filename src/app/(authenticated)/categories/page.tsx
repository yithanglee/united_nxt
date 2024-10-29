'use client';
import DataTable from "@/components/data/table"
export default function SellersPage() {

  // This is a placeholder for future implementation
  function approveFn(data: any) {
    console.log(data)
    return null;
}
function hrefFn(data: any) {
    console.log(data)
    return '/categories/' + data.id + '/book_inventories';
}

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Book Categories</h2>
        
      </div>

      <DataTable 
        showNew={true}
        model={'BookCategory'}
        preloads={['organization']}
        buttons={[{ name: 'Books', onclickFn: approveFn, href: hrefFn }]}
        search_queries={['a.name']}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id',
                'name',
                'chinese_name',
                'code',
                'description',
                'book_count',
              
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
          { label: 'Organization', data: 'name', through: ['organization'] },
        
          { label: 'Name', data: 'name' },
          { label: '', data: 'chinese' },
          { label: 'Code', data: 'code' },
          { label: 'Book Count', data: 'book_count' },
      

        ]}


      />
    </div>
  )
}