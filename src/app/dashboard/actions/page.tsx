"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocateFixedIcon, PhoneCall, WatchIcon, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


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
        title: "safety timer",
        Component: () => <Clock className="h-8 w-8 mb-2 text-primary"/>,
        link: "/dashboard/actions/timer"
    },{
        step: 4,
        title: "smart watch",
        Component: () => <WatchIcon className="h-8 w-8 mb-2 text-primary"/>,
        link: "/dashboard/actions/watch" 
    }
]

export default function Actions() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard">
          <Button variant="ghost" className="flex items-center gap-2 text-primary hover:bg-primary/10">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card className="w-full border-none shadow-none bg-transparent">
          <CardHeader>
              <CardTitle className="text-4xl font-bold text-center text-primary mb-8">
                  Available Actions
              </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6 justify-center items-stretch flex-wrap">
              {actions.map((action)=>(
                  <Link href={action.link} key={action.step}>
                      <Card className="w-48 h-44 p-4 flex flex-col items-center justify-center hover:shadow-xl hover:border-primary/50 hover:scale-105 transition-all cursor-pointer bg-card/50 backdrop-blur-sm"> 
                        <CardContent className="flex flex-col items-center justify-center p-0">
                            {action.Component()}
                            <div className="capitalize text-center text-lg font-bold mt-2">
                                {action.title}
                            </div>
                        </CardContent>
                    </Card>
                  </Link>
              ))}
          </CardContent>
        </Card>
    </div>
  );
}
