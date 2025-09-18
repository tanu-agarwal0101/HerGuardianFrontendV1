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

    <Card className="px-8 py-4 w-sm md:w-lg h-110">
      <CardTitle>
        <h1 className="text-2xl text-purple-500 font-bold text-center">
          Emergency Resources Panel
        </h1>
        <p className="text-gray-600 mt-2 text-center">
          People who will be notified in emergencies
        </p>
      </CardTitle>

      {/* contacts */}
      <div className="flex flex-col gap-4 capitalize h-full justify-center">
        <Card className="w-full">
          <CardContent className="flex flex-wrap gap-2 justify-between">
            <p>nearest police station</p>
            {/* add location and phone number */}
            <Dialog open={openPoliceDialog} onOpenChange={setOpenPoliceDialog}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setOpenPoliceDialog(true)}
                  aria-label="Call police station"
                  title="Call police station"
                >
                  <PhoneCall />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Call Police Station</DialogTitle>
                </DialogHeader>
                <p>Do you want to call the police station?</p>
                <DialogFooter>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                      window.location.href = "tel:100";
                      setOpenPoliceDialog(false);
                    }}
                  >
                    Call
                  </button>
                  <button
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                    onClick={() => setOpenPoliceDialog(false)}
                  >
                    Cancel
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="flex flex-wrap gap-2 justify-between">
            <p>Women&apos;s helpline</p>
            <Dialog open={openWomenDialog} onOpenChange={setOpenWomenDialog}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setOpenWomenDialog(true)}
                  aria-label="Call women helpline"
                  title="Call women helpline"
                >
                  <PhoneCall />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Call Women Helpline</DialogTitle>
                </DialogHeader>
                <p>Do you want to call the Women Helpline?</p>
                <DialogFooter>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                      window.location.href = "tel:1090";
                      setOpenWomenDialog(false);
                    }}
                  >
                    Call
                  </button>
                  <button
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                    onClick={() => setOpenWomenDialog(false)}
                  >
                    Cancel
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="flex flex-wrap gap-2 justify-between">
            <p>Support chat </p>
            <button
              onClick={() => router.push("/actions/support-chat")}
              aria-label="Open support chat"
              title="Open support chat"
            >
              <MessageCircle />
            </button>
          </CardContent>
        </Card>
        {/* <Card className="w-full">
              <CardContent className="flex flex-wrap gap-2 justify-between">
                <p>John Doe</p>
                
                  <PhoneCall />
                
              </CardContent>
            </Card> */}
      </div>
    </Card>
  );
}
