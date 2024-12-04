'use client';
import DataTable from "@/components/data/table"
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants";
import { api_get } from "@/lib/svt_utils";
import { RefreshCw } from "lucide-react";
export default function CategoriesPage() {

  // This is a placeholder for future implementation
  function approveFn(data: any) {
    console.log(data)
    return null;
  }
  function hrefFn(data: any) {
    console.log(data)
    return '/categories/' + data.id + '/book_inventories';
  }

 async  function repopulateCategories()  {
    console.log('repopulateCategories')
    const cac_url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT
   let res = await api_get(cac_url, { scope: 'reassign_categories' })
   console.log(res)

    if (res.status == 'ok') {
      console.log('success')
      toast({
        title: `${name} Completed`,
        description: `Repopulate was successful!`,
      })
    } else {
      console.log('failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Book Categories</h2>
        <Button variant="secondary"  onClick={repopulateCategories}>

          <RefreshCw className="w-4 h-4 mr-2"></RefreshCw>
          Repopulate Categories</Button>
      </div>

      <DataTable
        canDelete={true}
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