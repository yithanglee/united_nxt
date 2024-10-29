import DataTable from "@/components/data/table"

export default function MembersPage() {

  // This is a placeholder for future implementation

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Member</h2>

      </div>

      <DataTable canDelete={true}
        showNew={true}
        model={'Member'}
        preloads={['organization']}
        search_queries={['a.name']}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id',
                'name',
                'username',
                'email',
                'phone', 'username', 'password',
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
          { label: 'Member Code', data: 'code', subtitle: {label: 'psid', data: 'psid'} },
          { label: 'Name', data: 'name' },
          { label: 'Username', data: 'username' },
          { label: 'Email', data: 'email' },
          { label: 'Phone', data: 'phone' },
         

        ]}


      />
    </div>
  )
}