'use client';
import DynamicForm from "@/components/data/dynaform";
import { useAuth } from "@/lib/auth"
import { useEffect, useState } from "react";
import { Socket } from "phoenix"
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants";
import { JSONTree } from "react-json-tree";
import { useToast } from "@/hooks/use-toast";
import { genInputs } from "@/lib/svt_utils";



export default function SocketComponent() {
    let { toast } = useToast()
    const { user } = useAuth();
    console.log(user)
    const [colInputs, setColInputs] = useState<any[]>([])
    const web_url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;
    const [socket, setSocket] = useState<Socket | null>(null)
    const [channel, setChannel] = useState<any>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const [imageData, setImageData] = useState<string | null>(null)
    const [jsonData, setJsonData] = useState<any>(null)
    const url = PHX_ENDPOINT
    useEffect(() => {
        const fetchColInputs = async () => {
            const inputs = await genInputs(web_url, 'BookInventory');
            console.log(inputs)
        
            inputs.push({key: 'update_assoc', value: 'string'})
            setColInputs(inputs);
        };
        fetchColInputs();
    }, []);


    useEffect(() => {
        // Initialize socket connection
        const newSocket = new Socket(`ws://${url}/socket`)
        newSocket.connect()
        setSocket(newSocket)

        return () => {
            if (newSocket) {
                newSocket.disconnect()
            }
        }
    }, [])

    useEffect(() => {
        if (socket) {
            const topic = "user:lobby"
            const newChannel = socket.channel(topic, {})

            newChannel.join()
                .receive("ok", (data) => {
                    console.log("Joined topic", topic)
                    setLoading(false)
                })
                .receive("error", (resp) => {
                    console.error("Unable to join topic", topic)
                })

            newChannel.on("decoded_image", (payload) => {
                console.log(payload)
                setJsonData(payload.data)
                setImageData(`data:image/png;base64,${payload.b64_image}`)
            })

            setChannel(newChannel)

            return () => {
                if (newChannel) {
                    newChannel.leave()
                }
            }
        }
    }, [socket])

    const handleReconnect = () => {
        if (socket) {
            socket.disconnect()
            socket.connect()
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Scan Book Image</h2>

            </div>

            <Button onClick={handleReconnect} className="mb-4">Reconnect Socket</Button>

            <div className="grid grid-cols-8 gap-4">
                <div className="col-span-3">
                    {/* Properly structure the conditional rendering */}
                    {!isLoading ? (
                        <DynamicForm
                            data={{ scope: "scan_image" }}
                            inputs={[
                                { image: "string", scope: "string" }
                            ]}
                            customCols={[
                                {
                                    title: 'Upload image to scan',
                                    list: [
                                        { label: 'id', alt_class: 'w-1/3 mx-4 my-2 hidden' },
                                        { label: 'scope', hidden: true, value: "scan_image" },
                                        { label: 'image', alt_class: 'w-full mx-4 my-2 lg:w-2/3', upload: true },
                                    ]
                                }
                            ]}
                            module={'webhook'}
                            postFn={() => {


                                toast({
                                    title: "Action Completed",
                                    description: "Your action was successful!",
                                })

                            }}
                        />
                    ) : (
                        <p>Loading...</p> // Optionally, you can show a loading message or spinner
                    )}


                    <DynamicForm
                        data={{ id: "0" }}
                        inputs={colInputs }
                    
                        customCols={[
                            {
                                title: 'New Book',
                                list: [
                                    'id',
                   
                                    'code',
                                    'book.title',
                                    'book.price',
                                 
                                    'book.isbn',
                                    'book.call_no',
                                    'author.name',
                                    'publisher.name',
                                    {label: 'update_assoc.book', data: 'update_assoc.book', hidden: true , value: "true"},
                                    {label: 'update_assoc.book_category', data: 'update_assoc.book_category', hidden: true , value: "true"},
                                    // {label: 'update_assoc', data: 'update_assoc.author', hidden: true , value: "true"},
                                    // {label: 'update_assoc', data: 'update_assoc.publisher', hidden: true , value: "true"}
                                   

                                ]

                            }
                        ]}
                        module={'BookInventory'}
                        postFn={() => {


                            toast({
                                title: "Action Completed",
                                description: "Your action was successful!",
                            })

                        }}
                    />
                </div>

                <div className="col-span-1"></div>

                <div className="col-span-4">
                    <Card>
                        <CardContent>
                            <h2 className="text-xl font-semibold mb-2 mt-4">Received Image</h2>
                            {imageData ? (
                                <Image src={imageData} alt="Decoded Image" width={300} height={300} />
                            ) : (
                                <p>No image received yet</p>
                            )}
                        </CardContent>
                    </Card>

                    <div className="m-4"></div>

                    <Card>
                        <CardContent>
                            <h2 className="text-xl font-semibold mb-2 mt-4">Received JSON Data</h2>
                            <ScrollArea className="h-[300px]">
                                {jsonData ? (
                                    <div className="hasJson">
                                        <JSONTree
                                            data={jsonData}
                                            theme={{
                                                valueLabel: {
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <p>No data received yet</p>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

}

