"use client";
import React, {useState}from "react";
import { PhoneCall, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function ResourcesPanel() {
  const router = useRouter();
  const [openPoliceDialog, setOpenPoliceDialog] = useState(false);
  const [openWomenDialog, setOpenWomenDialog] = useState(false);
  return (
    // <Card className="p-6 flex flex-col gap-4">
    //   <h2 className="text-xl font-semibold text-purple-600 text-center">
    //     Emergency Resources
    //   </h2>
    //   <p className="text-gray-600 text-sm text-center">
    //     Helpful emergency contacts & tools.
    //   </p>
    //   <div className="grid md:grid-cols-3 gap-4">
    //     <div className="border rounded-md p-3 flex items-center justify-between">
    //       <span className="capitalize text-sm">Nearest Police Station</span>
    //       <Dialog open={openPolice} onOpenChange={setOpenPolice}>
    //         <DialogTrigger asChild>
    //           <button
    //             aria-label="Call police station"
    //             onClick={() => setOpenPolice(true)}
    //             className="text-purple-600 hover:text-purple-800"
    //           >
    //             <PhoneCall />
    //           </button>
    //         </DialogTrigger>
    //         <DialogContent>
    //           <DialogHeader>
    //             <DialogTitle>Call Police Station</DialogTitle>
    //           </DialogHeader>
    //           <p>Do you want to call the police station?</p>
    //           <DialogFooter>
    //             <button
    //               className="bg-purple-600 text-white px-4 py-2 rounded"
    //               onClick={() => {
    //                 window.location.href = "tel:100";
    //                 setOpenPolice(false);
    //               }}
    //             >
    //               Call
    //             </button>
    //             <button
    //               className="bg-gray-300 text-black px-4 py-2 rounded"
    //               onClick={() => setOpenPolice(false)}
    //             >
    //               Cancel
    //             </button>
    //           </DialogFooter>
    //         </DialogContent>
    //       </Dialog>
    //     </div>
    //     <div className="border rounded-md p-3 flex items-center justify-between">
    //       <span className="capitalize text-sm">Women's Helpline</span>
    //       <Dialog open={openWomen} onOpenChange={setOpenWomen}>
    //         <DialogTrigger asChild>
    //           <button
    //             aria-label="Call women's helpline"
    //             onClick={() => setOpenWomen(true)}
    //             className="text-purple-600 hover:text-purple-800"
    //           >
    //             <PhoneCall />
    //           </button>
    //         </DialogTrigger>
    //         <DialogContent>
    //           <DialogHeader>
    //             <DialogTitle>Call Women's Helpline</DialogTitle>
    //           </DialogHeader>
    //           <p>Do you want to call the Women's Helpline?</p>
    //           <DialogFooter>
    //             <button
    //               className="bg-purple-600 text-white px-4 py-2 rounded"
    //               onClick={() => {
    //                 window.location.href = "tel:1090";
    //                 setOpenWomen(false);
    //               }}
    //             >
    //               Call
    //             </button>
    //             <button
    //               className="bg-gray-300 text-black px-4 py-2 rounded"
    //               onClick={() => setOpenWomen(false)}
    //             >
    //               Cancel
    //             </button>
    //           </DialogFooter>
    //         </DialogContent>
    //       </Dialog>
    //     </div>
    //     <div className="border rounded-md p-3 flex items-center justify-between">
    //       <span className="capitalize text-sm">Support Chat</span>
    //       <button
    //         aria-label="Open support chat"
    //         onClick={() => router.push("/actions/support-chat")}
    //         className="text-purple-600 hover:text-purple-800"
    //       >
    //         <MessageCircle />
    //       </button>
    //     </div>
    //   </div>
    // </Card>

    <Card className="flex flex-col h-full shadow-md p-4">
       <CardHeader className="">
        <CardTitle className="text-xl font-bold text-primary">
          Emergency Resources
        </CardTitle>
        <p className="text-sm text-muted-foreground">Quick access to official help.</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[300px]">
        {/* Police */}
         <div className="flex items-center justify-between p-3 border border-border/50 bg-muted/10 rounded-lg">
             <span className="font-medium text-sm">Police Station (100)</span>
             <Dialog open={openPoliceDialog} onOpenChange={setOpenPoliceDialog}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-primary bg-primary/10 hover:bg-primary hover:text-white" onClick={() => setOpenPoliceDialog(true)}>
                        <PhoneCall className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Call Police Station</DialogTitle>
                    </DialogHeader>
                     <p className="py-4">Do you want to call the Police Station?</p>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpenPoliceDialog(false)}>Cancel</Button>
                        <Button onClick={() => { window.location.href = "tel:100"; setOpenPoliceDialog(false); }}>Call</Button>
                    </DialogFooter>
                </DialogContent>
             </Dialog>
         </div>

         {/* Women's Helpline */}
         <div className="flex items-center justify-between p-3 border border-border/50 bg-muted/10 rounded-lg">
             <span className="font-medium text-sm">Women's Helpline (1090)</span>
            <Dialog open={openWomenDialog} onOpenChange={setOpenWomenDialog}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-primary bg-primary/10 hover:bg-primary hover:text-white" onClick={() => setOpenWomenDialog(true)}>
                        <PhoneCall className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Call Women's Helpline</DialogTitle>
                    </DialogHeader>
                     <p className="py-4">Do you want to call the Women's Helpline?</p>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpenWomenDialog(false)}>Cancel</Button>
                        <Button onClick={() => { window.location.href = "tel:1090"; setOpenWomenDialog(false); }}>Call</Button>
                    </DialogFooter>
                </DialogContent>
             </Dialog>
         </div>

         {/* Support Chat */}
         {/* <div className="flex items-center justify-between p-3 border border-border/50 bg-muted/10 rounded-lg">
             <span className="font-medium text-sm">Anonymous Support Chat</span>
             <Button variant="ghost" size="icon" className="text-primary bg-primary/10 hover:bg-primary hover:text-white" onClick={() => router.push("/actions/support-chat")}>
                <MessageCircle className="h-4 w-4" />
             </Button>
         </div> */}
      </CardContent>
    </Card>
  );
}
