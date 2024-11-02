import DataTable from "@/components/data/table"


export default function SellersPage() {

  // This is a placeholder for future implementation

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Loans</h2>
        
      </div>

      <DataTable canDelete={true}
     
        model={'Loan'}
        preloads={['organization', 'member', 'book', 'book_inventory']}
        join_statements={[{member: 'member'}, {book: 'book'}, {book_inventory: 'book_inventory'}]}
        search_queries={['b.name|c.isbn|d.code']}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id',
               
              
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
          { label: 'Timestamp', data: 'inserted_at', formatDateTime: true , offset: 8},
          { label: 'Organization', data: 'name', through: ['organization'] },
          { label: 'Return', data: 'return_date', subtitle: {label: '', data: 'loan_date'} },
         
          {
            label: 'Returned?', data: 'has_return', color: [
                {
                    key: false,
                    value: 'destructive'
                },

                {
                    key: true,
                    value: 'default'
                }
            ]
        },
   
          { label: 'Book', data: 'title', through: ['book'] },
          { label: 'Barcode', data: 'code', through: ['book_inventory'] },
          { label: 'Member', data: 'name', through: ['member'] },
        ]}


      />
    </div>
  )
}