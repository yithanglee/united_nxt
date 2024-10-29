import DataTable from "@/components/data/table"

export default function SellersPage() {

  // This is a placeholder for future implementation

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Publishers</h2>

      </div>

      <DataTable canDelete={true}
        showNew={true}
        model={'Publisher'}
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