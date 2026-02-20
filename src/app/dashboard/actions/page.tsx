"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocateFixedIcon, PhoneCall, WatchIcon } from "lucide-react";
import Link from "next/link";


const actions =  [
    {
        step: 1,
        title: "add address",
        Component: () => <LocateFixedIcon className="h-8 w-8 mb-2 text-primary"/>,
        link: "/dashboard/actions/location"
    },{
        step: 2,
        title: "add contacts",
        Component: () => <PhoneCall className="h-8 w-8 mb-2 text-primary"/>,
        link: "/dashboard/actions/calls"
    },{
        step: 3,
        title: "smart watch",
        Component: () => <WatchIcon className="h-8 w-8 mb-2 text-primary"/>,
        link: "/" 
    }
]

export default function Actions() {
  return (
    <Card className="w-full border-none shadow-none bg-transparent">
        <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
                Actions
            </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 justify-center items-center flex-wrap">
            {actions.map((action)=>(
                <Link href={action.link} key={action.step}>
                    <Card className="w-48 h-40 p-4 m-2 flex flex-col items-center justify-center hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"> 
                    <CardContent className="flex flex-col items-center justify-center p-0">
                        {action.Component()}
                        <div className="capitalize text-center text-lg font-bold">
                            {action.title}
                        </div>
                    </CardContent>
                </Card>
                </Link>
            ))}
        </CardContent>
      </Card>
  );
}
