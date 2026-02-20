"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhoneCall, Lock, Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Contacts as ContactsApi, SOS } from "@/lib/api";
import type { Contact } from "../../helpers/type.ts";
import { useRouter } from "next/navigation";

export function SafetyCircleCard() {
const router = useRouter()
      const [contacts, setContacts] = useState<Contact[]>([]);
      const [openContactDialog, setOpenContactDialog] = useState<string | null>(
        null
    );
    
      const getContacts = async () => {
        try {
          const data = await ContactsApi.getAll();
          setContacts(data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      };

      useEffect(() => {
        getContacts();
      }, []);
    
      const handleEdit = (contactId: string) => {
        console.log("Editing contact with ID:", contactId);
        // Navigate to /edit-contact/[id] or open modal
      };

  return (
    <Card className="flex flex-col h-full shadow-md p-4">
      <CardHeader className="">
        <div className="flex justify-between items-center">
             <CardTitle className="text-xl font-bold text-primary">
                My Safety Circle
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary gap-1" onClick={()=> router.push("/actions/calls")}>
                <Plus className="h-4 w-4" /> Add
            </Button>
        </div>
        <p className="text-sm text-muted-foreground">People notified in emergencies.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[300px] scrollbar-thin">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 h-full py-8 space-y-4">
            <p className="text-muted-foreground text-center">
              No contacts added yet
            </p>
            <Button variant="outline" onClick={()=> router.push("/actions/calls")}>
                Add Trusted Contact
            </Button>
          </div>
        ) : (
             <ul className="flex flex-col gap-2">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="border border-border/50 bg-muted/20 rounded-lg p-3 flex items-center justify-between hover:bg-muted/40 transition-colors"
            >
              <span className="font-medium">{c.name}</span>
              <div className="flex gap-2 items-center">
                <Dialog
                  open={openContactDialog === c.id}
                  onOpenChange={(open) =>
                    setOpenContactDialog(open ? c.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => setOpenContactDialog(c.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                    >
                      <PhoneCall className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Call {c.name}</DialogTitle>
                    </DialogHeader>
                    <p className="py-4">
                      Do you want to call {c.name} at <span className="font-mono bg-muted px-2 py-1 rounded">{c.phoneNumber}</span>?
                    </p>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => setOpenContactDialog(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() =>
                          (window.location.href = `tel:${c.phoneNumber}`)
                        }
                      >
                        Call Now
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost" size="icon"
                  onClick={() => handleEdit(c.id)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Lock className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        )}
       
      </CardContent>
    </Card>
  );
}



{/* <Card className="p-4 m-2  h-100 overflow-y-auto flex flex-col items-center justify-center lg:w-full w-full md:w-fit">
  <CardTitle>
    <h1 className="text-2xl text-purple-500 font-bold text-center mt-2">
      My Safety Circle
    </h1>
    <p className="text-gray-600 mt-2 text-center">
      People who will be notified in emergencies
    </p>
    {/* <Button onClick={()=>getContacts()}>Get</Button> */}
//   </CardTitle>

  {/* contacts */}
//   <CardContent className="flex flex-col gap-2">
//     {contacts.map((contact) => (
//       <Card className="w-full" key={contact.id}>
//         <CardContent className="flex flex-wrap gap-2 justify-between">
//           <p>{contact.name}</p>
//           <div className="flex gap-4">
//             <Dialog
//               open={openContactDialog === contact.id}
//               onOpenChange={(open) =>
//                 setOpenContactDialog(open ? contact.id : null)
//               }
//             >
//               <DialogTrigger asChild>
//                 <button
//                   onClick={() => setOpenContactDialog(contact.id)}
//                   aria-label="Call"
//                 >
//                   <PhoneCall className="text-green-600 cursor-pointer hover:scale-105" />
//                 </button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Call {contact.name}</DialogTitle>
//                 </DialogHeader>
//                 <p>
//                   Do you want to call {contact.name} at {contact.phoneNumber}?
//                 </p>
//                 <DialogFooter>
//                   <button
//                     className="bg-purple-600 text-white px-4 py-2 rounded"
//                     onClick={() => {
//                       window.location.href = `tel:${contact.phoneNumber}`;
//                       setOpenContactDialog(null);
//                     }}
//                   >
//                     Call
//                   </button>
//                   <button
//                     className="bg-gray-300 text-black px-4 py-2 rounded"
//                     onClick={() => setOpenContactDialog(null)}
//                   >
//                     Cancel
//                   </button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//             <button
//               onClick={() => handleEdit(contact.id)}
//               aria-label="Edit"
//               className="text-blue-500 hover:text-blue-700"
//             >
//               <Lock /> {/* Replace with Edit icon if preferred */}
//             </button>
//           </div>
//         </CardContent>
//       </Card>
//     ))}

//     {contacts.length === 0 && (
//       <p className="text-gray-500 text-center">No contacts added yet</p>
//     )}
//   </CardContent>
// </Card> */}
