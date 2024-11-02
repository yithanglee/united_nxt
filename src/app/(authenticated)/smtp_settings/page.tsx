import DataTable from "@/components/data/table"


export default function MembersPage() {

  // This is a placeholder for future implementation

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">SMTP Settings</h2>

      </div>

      <DataTable canDelete={true}
        showNew={true}
        model={'SmtpSetting'}
        preloads={['organization']}
        search_queries={['a.name']}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id', 'server', 'hostname', 'username', 'password',
                {
                  label: 'adapter_type',
                  // customCols: null,
                  selection: ['smtp', 'sendgrid', 'local'],
                  // search_queries: ['a.name'],
                  // newData: 'name',
                  // title_key: 'name'
                },
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
          { label: 'Adapter', data: 'adapter_type' },
          { label: 'Server', data: 'server' },
          { label: 'hostname', data: 'hostname' },
          { label: 'Username', data: 'username' },


        ]}


      />
    </div>
  )
}