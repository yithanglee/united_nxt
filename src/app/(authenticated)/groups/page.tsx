import DataTable from "@/components/data/table"


export default function SellersPage() {

  // This is a placeholder for future implementation

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Member Groups</h2>
        
      </div>

      <DataTable 
        showNew={true}
        model={'Group'}
        preloads={['organization']}
     
        search_queries={['a.name']}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id',
                'name',
                'extension_period',
                'fine_amount',
                'fine_days',
                'loan_limit',
                'loan_period',
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
          { label: 'Limit', data: 'loan_limit' },
          { label: 'Loan Period', data: 'loan_period' },
          { label: 'Extension Days', data: 'extension_period' },
      

        ]}


      />
    </div>
  )
}