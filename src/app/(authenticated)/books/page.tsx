import DataTable from "@/components/data/table"


export default function SellersPage() {

  // This is a placeholder for future implementation

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Books</h2>
        
      </div>

      <DataTable canDelete={true}
        showNew={true}
        model={'Book'}
        preloads={['organization', 'author', 'publisher']}
        join_statements={[{author: 'author'}]}
        search_queries={['a.title|b.name']}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id',
                'title',
              
                {
                  label: 'author_id',
                  customCols: null,
                  selection: 'Author',
                  search_queries: ['a.name'],
                  newData: 'name',
                  title_key: 'name'
                },
              
                {
                  label: 'publisher_id',
                  customCols: null,
                  selection: 'Publisher',
                  search_queries: ['a.name'],
                  newData: 'name',
                  title_key: 'name'
                },
              
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
        
          { label: 'Title', data: 'title' },
          { label: 'Publisher', data: 'name', through: ['publisher'] },
          { label: 'Author', data: 'name', through: ['author'] },
 
          { label: 'ISBN', data: 'isbn' },
          { label: 'Call No', data: 'call_no' },

          { label: 'Price', data: 'price' },
        ]}


      />
    </div>
  )
}