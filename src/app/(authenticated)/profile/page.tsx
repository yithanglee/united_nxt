'use client';
import DynamicForm from "@/components/data/dynaform";
import { useAuth } from "@/lib/auth"
import { useEffect, useState } from "react";
import { genInputs, postData } from '@/lib/svt_utils'
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
export default function PaymentsPage() {
    const { user } = useAuth();
    console.log(user)
    const [colInputs, setColInputs] = useState<any[]>([])
    const url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;

    useEffect(() => {
        const fetchColInputs = async () => {
            const inputs = await genInputs(url, 'Staff');
            setColInputs(inputs);
        };
        fetchColInputs();
    }, []);

    function approveFn(data: any) {
        console.log(data)
        return null;
    }


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                    <div className="text-sm text-gray-500">Update your personal details here</div>
                </div>

            </div>
            <Separator />
            <div className="grid grid-cols-6">

                <div className="col-span-6">
                    <DynamicForm

                        style="flat"
                        data={user?.userStruct} inputs={colInputs} customCols={[

                            {
                                title: 'General', description: 'General information about the staff member',
                                list: [{ label: 'id', alt_class: 'hidden w-1/3  mx-4 my-2 ' },
                                { label: 'name', alt_class: 'w-full mx-4 my-2 ' },
                                { label: 'username', alt_class: 'w-full  mx-4 my-2 ' },
                                { label: 'password', alt_class: 'w-full  mx-4 my-2 lg:w-1/2' },
                                { label: 'phone', alt_class: 'w-full mx-4 my-2 lg:w-1/3' },
                                { label: 'email', alt_class: 'w-full  mx-4 my-2 lg:w-2/3' },
                                ]
                            },

                            {
                                title: 'Details', description: 'Details about the staff member',
                                list: [
                                    { label: 'desc', alt_class: 'w-full mx-4 my-2 lg:w-1/2' },
                                ]
                            }
                        ]} module={'Staff'}

                        postFn={function (): void {
                            console.log("postFn")

                        }}></DynamicForm>
                </div>

            </div>




        </div>
    )
}