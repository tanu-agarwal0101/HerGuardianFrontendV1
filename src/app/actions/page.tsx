"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocateFixedIcon, MessageCircleCode, PhoneCall, WatchIcon } from "lucide-react";
import Link from "next/dist/client/link";


const actions =  [
    {
        step: 1,
        title: "add address",
        Component: () => <LocateFixedIcon/>,
        link: "/actions/location"
    },{
        step: 2,
        title: "add contacts",
        Component: () => <PhoneCall/>,
        link: "/actions/calls"
    },{
        step: 3,
        title: "smart watch integration",
        Component: () => <WatchIcon/>,
        link: "/"
    },{
        step: 4,
        title: "support chat",
        Component: () => <MessageCircleCode/>,
        link: "/actions/support-chat"
    }
]
export default function Actions() {
  return (
    <Card className="w-full">
        <CardHeader>
            <CardTitle className="text-3xl text-purple-500 font-bold text-center">
                Actions
            </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 justify-center items-center flex-wrap">
            {actions.map((action)=>(
                <Link href={action.link} key={action.step}>
                    <Card className="w-100 h-50 p-2 m-2 flex flex-col items-center justify-center"> 
                    <CardTitle>
                        {action.Component()}
                    </CardTitle>
                    <CardContent className="capitalize text-center text-lg font-bold">
                        {action.title}
                    </CardContent>
                </Card>
                </Link>
            ))}
        </CardContent>
      </Card>
  );
}
