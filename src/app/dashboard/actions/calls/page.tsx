"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
// import axiosInstance from "@/lib/axiosInstance";
import { Contacts } from "@/lib/api";
import { Edit, MoveLeft, Plus, Save, Trash, X } from "lucide-react";
import { Contact } from "@/helpers/type";
import { useRouter } from "next/navigation";


export default function CallsPage() {
    const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState<Partial<Contact> | null>(null);
  const [newContactLoading, setNewContactLoading] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await Contacts.getAll();
      setContacts(data);
    } catch (e) {
      console.error("Error fetching contacts:", e);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchContacts();
  }, []);

  const handleEdit = (contact: Contact) => {
    setEditContact(contact);
    setNewContact(null);
  };

  const handleCreate = () => {
    setNewContact({ name: "", phoneNumber: "", relationship: "" } as any);
    setEditContact(null);
  };

  const saveContact = async (contact: Partial<Contact>) => {
    try {
      if (contact.id) {
        await Contacts.update({
          contactId: contact.id,
          name: contact.name,
          phoneNumber: contact.phoneNumber,
          relation: contact.relationship,
        });
      } else {
        setNewContactLoading(true);
        await Contacts.addSingle({
          name: contact.name!,
          phoneNumber: contact.phoneNumber!,
          relation: contact.relationship!,
        });
        setNewContactLoading(false);
      }
      setEditContact(null);
      setNewContact(null);
      fetchContacts();
    } catch (e) {
      console.error("Error saving contact:", e);
      setNewContactLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await Contacts.remove(id);
      fetchContacts();
    } catch (e) {
      console.error("Error deleting contact:", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center gap-4">
        <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/actions")}
            className="gap-2"
        >
            <MoveLeft className="h-4 w-4" />
            Back
        </Button>
        <h1 className="text-2xl font-bold">Manage Contacts</h1>
      </div>


      <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold">Your Trusted Contacts</h2>
         <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add Contact
         </Button>
      </div>

      {newContact && (
        <Card className="p-4 border-l-4 border-l-primary">
          <CardTitle className="mb-4">New Contact</CardTitle>
          <div className="grid gap-4 md:grid-cols-3">
             <div className="space-y-2">
                <Label>Name</Label>
                <Input
                value={newContact.name}
                onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                }
                />
            </div>
            <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                value={newContact.phoneNumber}
                onChange={(e) =>
                    setNewContact({ ...newContact, phoneNumber: e.target.value })
                }
                />
            </div>
             <div className="space-y-2">
                <Label>Relation</Label>
                 <Input
                value={newContact.relationship}
                onChange={(e) =>
                    setNewContact({ ...newContact, relationship: e.target.value })
                }
                />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
             <Button variant="ghost" onClick={() => setNewContact(null)}>
              Cancel
            </Button>
            <Button onClick={() => saveContact(newContact!)} disabled={newContactLoading}>
              {newContactLoading ? "Saving..." : "Save Contact"}
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <Card key={contact.id} className="relative overflow-hidden hover:shadow-md transition-shadow">
            {editContact?.id === contact.id ? (
              <div className="p-4 space-y-3">
                 <Input
                  value={editContact.name}
                  onChange={(e) =>
                    setEditContact({ ...editContact, name: e.target.value })
                  }
                  placeholder="Name"
                />
                 <Input
                  value={editContact.phoneNumber}
                  onChange={(e) =>
                    setEditContact({ ...editContact, phoneNumber: e.target.value })
                  }
                   placeholder="Phone"
                />
                 <Input
                  value={editContact.relationship}
                  onChange={(e) =>
                    setEditContact({ ...editContact, relationship: e.target.value })
                  }
                   placeholder="Relation"
                />
                <div className="flex justify-end gap-2">
                   <Button size="sm" variant="ghost" onClick={() => setEditContact(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => saveContact(editContact)}>
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
                <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-lg">{contact.name}</div>
                        <div className="flex gap-1">
                             <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={() => handleEdit(contact)}
                                >
                                <Edit className="h-4 w-4" />
                            </Button>
                             <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteContact(contact.id)}
                                >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="bg-muted/50 rounded p-2 text-sm space-y-1">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium">{contact.phoneNumber}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Relation:</span>
                            <span className="font-medium">{contact.relationship}</span>
                        </div>
                    </div>
                </CardContent>
            )}
             {/* Decorative indicator */}
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/50" />
          </Card>
        ))}
         {!loading && contacts.length === 0 && !newContact && (
            <div className="col-span-full text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                <p>No contacts added yet. Add trusted contacts to alert them in emergencies.</p>
                <Button variant="link" onClick={handleCreate}>Add your first contact</Button>
            </div>
        )}
      </div>
    </div>
  );
}
