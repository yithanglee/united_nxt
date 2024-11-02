"use client"
import { useRef, useEffect, useState } from "react";
import jspreadsheet from "jspreadsheet-ce";
import { Button } from "./ui/button";
import { Download, Save, Upload } from "lucide-react";
import { Input } from "./ui/input";
import 'jspreadsheet-ce/dist/jspreadsheet.css'
import { postData } from "@/lib/svt_utils";
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants";
import { useAuth } from "@/lib/auth";


export default function IndexPage({ postFn: postFn }) {
    const { user, isLoading } = useAuth()
    const url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;
    const jRef = useRef(null);
    const [dataMap, setDataMap] = useState(null)
    const [spreadsheet, setSpreadsheet] = useState(null)
    const fileInputRef = useRef(null)

    let l = ["SEQ", "TITLE", "BARCODE", "ISBN", "AUTHOR",
        "PUBLISHER", "DESCRIPTION", "CALL NO", "PRICE"]
    useEffect(() => {
        if (!jRef.current!.jexcel) {
            const instance = jspreadsheet(jRef.current!, {
                allowExport: true,
                includeHeadersOnDownload: true,
                csvFileName: "book_entry" + makeid(4),
                tableOverflow: false,
                columns: [
                    { type: 'text', title: 'SEQ', width: 50 },
                    { type: 'text', title: 'TITLE', width: 300 },
                    { type: 'text', title: 'BARCODE', width: 150 },
                    { type: 'text', title: 'ISBN', width: 150 },
                    { type: 'text', title: 'AUTHOR', width: 100 },

                    { type: 'text', title: 'PUBLISHER', width: 100 },
                    { type: 'text', title: 'DESCRIPTION', width: 100 },
                    { type: 'text', title: 'CALL NO', width: 150 },
                    { type: 'text', title: 'PRICE', width: 100 },

                ], minDimensions: [9, 10]
            });

            setSpreadsheet(instance)
        }
    });

    const handleDownloadCSV = () => {

        if (spreadsheet) {
            const csv = spreadsheet.download()
        }
    }

    const handleFileUpload = (event: { target: { files: any[]; }; }) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target?.result
                let list = content!.split("\r\n")
                let header = list.splice(0, 1)
                let newDatas = [], newDatas2 = []
                list.forEach((d: String, i: any) => {
                    let newMap: Record<any, any> = {};
                    header[0].split(",").forEach((k: any, i: any) => {
                        newMap[k] = d.split(",")[i]
                    })
                    if (newMap.TITLE != "") {
                        newDatas2.push(newMap)
                        newDatas.push(d.split(","))
                    }
                })

                if (spreadsheet) {
                    setDataMap(newDatas2)
                    spreadsheet.setData(JSON.stringify(newDatas))
                }
            }
            reader.readAsText(file)
        }
    }

    async function handleSaveData(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
        if (spreadsheet) {
            let res = await postData({
                data: { books: dataMap, organization_id: user?.userStruct?.organization_id },
                endpoint: `${url}/svt_api/webhook?scope=upload_csv_books`
            })
            if (res.status == "ok") {
                postFn()
            }
        }
    }

    //   jspreadsheet(jRef.current, options);
    return (

        <div className="relative">

            <p>You can copy paste from excel onto this page's excel. Download the csv first, then upload again, then save data.</p>
            <div className="my-4 space-x-2">
                <Button onClick={handleDownloadCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                </Button>
                <Button onClick={() => fileInputRef.current.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload CSV
                </Button>
                <Button onClick={handleSaveData}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Data
                </Button>
                <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv"
                    className="hidden"
                />
            </div>
            <div ref={jRef} />
        </div>
    );
}
function makeid(arg0: number) {
    let result = "";
    let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;

}

