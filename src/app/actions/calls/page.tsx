"use client";
import { useState, useEffect } from "react";
// import axios from "axios";
import { Contacts as ContactsApi } from "@/lib/api";
import type { Contact } from "../../../helpers/type.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { singleContactSchema } from "../../../helpers/schema";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation.js";
import { Card, CardTitle } from "@/components/ui/card";
import CardContent from "@mui/material/CardContent";

// const mockEmergencyContacts: Contact[] = [
//   {
//     id: "1a2b3c",
//     name: "Alice Johnson",
//     phoneNumber: "+1-555-123-4567",
//     relationship: "Mother",
//     email: "alice.johnson@example.com"
//   },
//   {
//     id: "2b3c4d",
//     name: "Bob Smith",
//     phoneNumber: "+1-555-987-6543",
//     relationship: "Friend",
//     email: "bob.smith@example.com"
//   },
//   {
//     id: "3c4d5e",
//     name: "Carlos Reyes",
//     phoneNumber: "+1-555-222-3333",
//     relationship: "Brother"
//   },
//   {
//     id: "4d5e6f",
//     name: "Diana Lee",
//     phoneNumber: "+1-555-111-2222",
//     relationship: "Colleague",
//     email: "diana.lee@example.com"
//   }
// ];
type ContactValues = z.infer<typeof singleContactSchema>;

// export default function ContactsPage(){
//     const [contacts, setContacts] = useState<Contact[]>([]);
//     // const [form, setForm] = useState({
//     //     name: "", phoneNumber: "", relationship: "", email: ""
//     // })
//     const [newContact, setNewContact] = useState<Contact>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [editContactId, setEditContactId] = useState<string | null>(null);

//     const token = localStorage.getItem('token');

//   const getContacts = async()=>{
//     try {
//       const response = await axios.get("http://localhost:5001/contacts/get-all-contacts", {
//         withCredentials: true
//       })
//       const data = response.data;
//       console.log("Fetched contacts:", data);
//       setContacts(data.contacts);
//       // console.log("Contacts state updated:", contacts);
//     } catch (error) {
//       console.error("Error fetching contacts:", error);
//       return [];
//     }
//   }

//   useEffect(()=>{
//     getContacts();
//   },[])

//     const {
//       register, control, handleSubmit, formState: {
//         errors, isSubmitting
//       }} = useForm<ContactValues>({
//       resolver: zodResolver(contactSchema),
//       defaultValues: {
//         emergencyContacts: [
//           {
//             name: "",
//             phoneNumber: "",
//             email: "",
//             relationship: ""
//           }
//         ],
//       },
//       })

//     const onSubmit = async (data: ContactValues) => {
//       console.log(data);
//       try {

//         await axios.post("http://localhost:5001/contacts/add-single-contact", data, {
//           withCredentials: true,
//         });
//         console.log("Contacts submitted successfully");

//       } catch (error) {
//         console.error("Error submitting contacts:", error);

//       }
//       // api call

//     };

//     const {fields, append} = useFieldArray({
//       control,
//       name: "emergencyContacts",
//     });

//     const handeSubmit = async(e: any)=>{
//         e.preventDefault();

//     }

//     const handleCreate = async () => {
//     if (!newContact.name || !newContact.phoneNumber) return alert('Name and Phone are required');
//     try {
//       const res = await axios.post(
//         '/api/contacts',
//         { emergencyContacts: [newContact] },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNewContact({ name: '', phoneNumber: '', email: '', relationship: '' });
//       fetchContacts();
//     } catch (err) {
//       console.error('Create failed', err);
//     }
//   };

//   const handleUpdate = async (contact: Contact) => {
//     try {
//       await axios.put(
//         '/api/contacts',
//         { contactId: contact.id, ...contact },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setEditContactId(null);
//       fetchContacts();
//     } catch (err) {
//       console.error('Update failed', err);
//     }
//   };

//   const handleDelete = async (contactId?: string) => {
//     if (!contactId) return;
//     try {
//       await axios.delete('/api/contacts', {
//         data: { contactId },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchContacts();
//     } catch (err) {
//       console.error('Delete failed', err);
//     }
//   };

//     return(
//         <div className="min-h-screen w-full p-4 flex flex-col items-center justify-center gap-4">
//             <h1 className="text-4xl font-bold text-center w-full p-4">Emergency Contacts</h1>

//             <div className="border p-4 w-full m-4">
//         <h3 className="text-xl mb-2">Add New Contact</h3>
//         <div className="flex flex-col md:flex-row gap-4">
//           <input
//             className="border p-2 rounded"
//             placeholder="Name"
//             value={newContact.name}
//             onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
//           />
//           <input
//             className="border p-2 rounded"
//             placeholder="Phone Number"
//             value={newContact.phoneNumber}
//             onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
//           />
//           <input
//             className="border p-2 rounded"
//             placeholder="Email (optional)"
//             value={newContact.email || ''}
//             onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
//           />
//           <input
//             className="border p-2 rounded"
//             placeholder="Relationship (optional)"
//             value={newContact.relationship || ''}
//             onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
//           />
//           <button
//             onClick={handleCreate}
//             className="bg-purple-600 text-white px-4 py-2 rounded"
//           >
//             Add
//           </button>
//         </div>
//       </div>

//             {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="w-full">
//             <h1 className="text-2xl font-semibold m-2">Existing Contacts</h1>
//         <ul className="space-y-4 mb-6 grid md:grid-cols-2  lg:grid-cols-3 justify-center items-center gap-4">

//           {contacts.map((contact: Contact) => (
//             <li
//               key={contact.id}
//               className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 h-44"
//             >
//               {editContactId === contact.id ? (
//                 <div className="flex flex-wrap gap-2">
//                   <Input
//                     className="border p-2 rounded "
//                     value={contact.name}
//                     onChange={(e) =>
//                       setContacts((prev: Contact[]) =>
//                         prev.map((c) => (c.id === contact.id ? { ...c, name: e.target.value } : c))
//                       )
//                     }
//                   />
//                   <Input
//                     className="border p-2 rounded"
//                     value={contact.phoneNumber}
//                     onChange={(e) =>
//                       setContacts((prev: Contact[]) =>
//                         prev.map((c: Contact) =>
//                           c.id === contact.id ? { ...c, phoneNumber: e.target.value } : c
//                         )
//                       )
//                     }
//                   />
//                   <input
//                     className="border p-2 rounded"
//                     placeholder="Email (optional)"
//                     value={contact.email || ''}
//                     onChange={(e) =>
//                       setContacts((prev) =>
//                         prev.map((c) => (c.id === contact.id ? { ...c, email: e.target.value } : c))
//                       )
//                     }
//                   />
//                   <input
//                     className="border p-2 rounded"
//                     placeholder="Relationship (optional)"
//                     value={contact.relationship || ''}
//                     onChange={(e) =>
//                       setContacts((prev) =>
//                         prev.map((c) =>
//                           c.id === contact.id ? { ...c, relationship: e.target.value } : c
//                         )
//                       )
//                     }
//                   />
//                   <button
//                     onClick={() => handleUpdate(contact)}
//                     className="bg-green-500 text-white my-2 px-4 py-2 rounded"
//                   >
//                     Save
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <div>
//                     <p><strong>{contact.name}</strong> ({contact.relationship || 'N/A'})</p>
//                     <p>{contact.phoneNumber}</p>
//                     {contact.email && <p>{contact.email}</p>}
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => setEditContactId(contact.id!)}
//                       className="bg-purple-400 px-3 py-1 rounded text-white"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(contact.id)}
//                       className="bg-red-600 px-3 py-1 rounded text-white"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//         </div>
//       )}

//         </div>
//     )
// }

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editContactId, setEditContactId] = useState<string | null>(null);
  const getContacts = async () => {
    try {
      const data = await ContactsApi.getAll();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(singleContactSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      relationship: "",
    },
  });

  const onSubmit = async (data: ContactValues) => {
    console.log(data);
    try {
      const res = await ContactsApi.addSingle(data);
      setContacts((prev) => [...prev, res.data.contact]);
    } catch (error) {
      console.error("Error submitting contacts:", error);
    }
    // api call
  };

  useEffect(() => {
    getContacts();
  }, []);

  const handleUpdate = async (contact: Contact) => {
    try {
      const updatedContact = {
        ...contact,
        contactId: contact.id,
        name: contact.name.trim(),
        phoneNumber: contact.phoneNumber.trim(),
        email: contact.email?.trim(),
        relationship: contact.relationship?.trim(),
      };
      const response = await ContactsApi.update(updatedContact as any);
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? response.data.contact : c))
      );
      setEditContactId(null);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };
  const handleDelete = async (contactId?: string) => {
    try {
      await ContactsApi.remove(contactId!);
      setContacts((prev) => prev.filter((c) => c.id !== contactId));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div className="min-h-screen w-full p-4 flex flex-col items-center justify-center gap-4 ">
      <div className="w-full">
        <Button
          className="bg-purple-500 text-white hover:bg-purple-800 mb-4"
          onClick={() => router.push("/actions")}
        >
          <MoveLeft />
          Back
        </Button>
      </div>
      <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold text-center w-full p-4">
        Emergency Contacts
      </h1>

      <Card className="border p-4 m-2 w-full lg:w-xl md:w-xl">
        <CardTitle className="text-xl mb-2 font-semibold">
          Add New Contact
        </CardTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
            <Label htmlFor="name" className="">
              Name
            </Label>
            <Input
              className="border p-2 rounded"
              placeholder="Name"
              {...register("name")}
            />
            <Label htmlFor="phone-number" className="">
              Phone Number
            </Label>
            <Input
              className="border p-2 rounded"
              placeholder="Phone Number"
              {...register("phoneNumber")}
            />
            <Label htmlFor="email" className="">
              Email
            </Label>
            <Input
              className="border p-2 rounded"
              placeholder="Email (optional)"
              {...register("email")}
            />
            <Label htmlFor="relationship" className="">
              Relationship
            </Label>
            <Input
              className="border p-2 rounded"
              placeholder="Relationship (optional)"
              {...register("relationship")}
            />
            <Button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </CardContent>
        </form>
      </Card>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full text-center">
          <h1 className="text-2xl font-semibold m-2">Existing Contacts</h1>
          <ul className="mb-6 flex flex-wrap justify-center mt-8 items-center gap-4">
            {contacts.map((contact: Contact) => (
              <li
                key={contact.id}
                className="p-4 border rounded-lg flex flex-wrap items-center justify-between gap-4"
              >
                {editContactId === contact.id ? (
                  <div className="flex flex-wrap gap-2">
                    <Input
                      className="border p-2 rounded "
                      value={contact.name}
                      onChange={(e) =>
                        setContacts((prev: Contact[]) =>
                          prev.map((c) =>
                            c.id === contact.id
                              ? { ...c, name: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                    <Input
                      className="border p-2 rounded"
                      value={contact.phoneNumber}
                      onChange={(e) =>
                        setContacts((prev: Contact[]) =>
                          prev.map((c: Contact) =>
                            c.id === contact.id
                              ? { ...c, phoneNumber: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                    <Input
                      className="border p-2 rounded"
                      placeholder="Email (optional)"
                      value={contact.email || ""}
                      onChange={(e) =>
                        setContacts((prev) =>
                          prev.map((c) =>
                            c.id === contact.id
                              ? { ...c, email: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                    <Input
                      className="border p-2 rounded"
                      placeholder="Relationship (optional)"
                      value={contact.relationship || ""}
                      onChange={(e) =>
                        setContacts((prev) =>
                          prev.map((c) =>
                            c.id === contact.id
                              ? { ...c, relationship: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                    <Button
                      onClick={() => handleUpdate(contact)}
                      className="bg-green-500 text-white my-2 px-4 py-2 rounded"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <p>
                        <strong>{contact.name}</strong> (
                        {contact.relationship || "N/A"})
                      </p>
                      <p>{contact.phoneNumber}</p>
                      {contact.email && <p>{contact.email}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditContactId(contact.id!)}
                        className="bg-purple-400 px-3 py-1 rounded text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="bg-red-600 px-3 py-1 rounded text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
