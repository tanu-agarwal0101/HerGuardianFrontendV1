"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="p-4 flex flex-col gap-4 w-sm md:w-lg h-110">
      <CardHeader className="p-0 text-center">
        <CardTitle className="text-purple-500 text-2xl font-bold">
          My Safety Circle
        </CardTitle>
        <p className="text-gray-600 text-md font-semibold">People notified in emergencies.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-0 h-full items-center justify-center">
        {contacts.length === 0 && (
          <div className="">
            <p className="text-gray-500 text-center text-lg">
              No contacts added yet
            </p>
                      <button type="button" className="text-purple-500 hover:underline text-xl w-full font-semibold flex justify-center items-center gap-2"
                      onClick={()=> router.push("/actions/calls")}>
              Add <Plus />
            </button>
          </div>
        )}
        <ul className="flex flex-col gap-2">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="border rounded-md p-2 flex items-center justify-between"
            >
              <span>{c.name}</span>
              <div className="flex gap-4 items-center">
                <Dialog
                  open={openContactDialog === c.id}
                  onOpenChange={(open) =>
                    setOpenContactDialog(open ? c.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <button
                      onClick={() => setOpenContactDialog(c.id)}
                      aria-label={`Call ${c.name}`}
                      className="text-green-600 hover:scale-105"
                    >
                      <PhoneCall />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Call {c.name}</DialogTitle>
                    </DialogHeader>
                    <p>
                      Do you want to call {c.name} at {c.phoneNumber}?
                    </p>
                    <DialogFooter>
                      <button
                        className="bg-purple-600 text-white px-4 py-2 rounded"
                        onClick={() =>
                          (window.location.href = `tel:${c.phoneNumber}`)
                        }
                      >
                        Call
                      </button>
                      <button
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                        onClick={() => setOpenContactDialog(null)}
                      >
                        Cancel
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <button
                  onClick={() => handleEdit(c.id)}
                  aria-label="Edit contact"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Lock />
                </button>
              </div>
            </li>
          ))}
        </ul>
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
