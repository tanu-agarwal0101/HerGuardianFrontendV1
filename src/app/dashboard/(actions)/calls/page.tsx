"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Contacts } from "@/lib/api";
import { Edit, Plus, Save, Trash, X, Phone, Users, UserPlus } from "lucide-react";
import { Contact } from "@/helpers/type";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CallsPage() {
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
      toast.error("Failed to load contacts");
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
    setNewContact({ name: "", phoneNumber: "", relationship: "" });
    setEditContact(null);
  };

  const saveContact = async (contact: Partial<Contact>) => {
    try {
      if (contact.id) {
        await Contacts.update({
          contactId: contact.id,
          name: contact.name,
          email: contact.email,
          phoneNumber: contact.phoneNumber,
          relation: contact.relationship,
        });
        toast.success("Contact updated successfully");
      } else {
        setNewContactLoading(true);
        await Contacts.addSingle({
          name: contact.name!,
          email: contact.email!,
          phoneNumber: contact.phoneNumber!,
          relation: contact.relationship!,
        });
        toast.success("New contact added");
        setNewContactLoading(false);
      }
      setEditContact(null);
      setNewContact(null);
      fetchContacts();
    } catch (e) {
      console.error("Error saving contact:", e);
      toast.error("Error saving contact");
      setNewContactLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await Contacts.remove(id);
      toast.success("Contact removed");
      fetchContacts();
    } catch (e) {
      console.error("Error deleting contact:", e);
      toast.error("Failed to remove contact");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative p-4 lg:p-8 min-h-[85vh]">
      
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -z-10" />

      

      <Card className="w-full bg-card/60 backdrop-blur-2xl border-white/10 dark:border-white/5 shadow-2xl overflow-hidden relative group">
        
        
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-50" />
        
        <CardHeader className="text-center pt-8 pb-4 space-y-4">
            <div className="flex justify-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center transform -rotate-3 transition-transform hover:rotate-3 duration-500">
                    <Users className="w-7 h-7 text-primary transition-transform hover:scale-110 duration-500" />
                </div>
            </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Trusted Contacts
          </CardTitle>
          <p className="text-muted-foreground text-sm font-medium px-4">
            Manage your safe circle. In case of emergency, these contacts will receive your location alerts.
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-8 md:px-10 space-y-10">
            
            <div className="flex justify-between items-center bg-background/40 backdrop-blur-sm p-4 rounded-3xl border border-white/5 shadow-inner">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 px-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Safe Circle
                </h2>
                <Button 
                    onClick={handleCreate} 
                    className="gap-2 rounded-2xl shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                >
                    <Plus className="h-4 w-4" /> Add Member
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {newContact && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-8"
                    >
                        <Card className="p-6 bg-primary/5 border-primary/20 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2">
                                <Button variant="ghost" size="icon" onClick={() => setNewContact(null)} className="rounded-full">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                                <UserPlus className="w-5 h-5" />
                                Add New Contact
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Name</Label>
                                    <Input
                                        value={newContact.name}
                                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                        className="bg-background/50 border-white/10 rounded-xl"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</Label>
                                    <Input
                                        type="email"
                                        value={newContact.email}
                                        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                        className="bg-background/50 border-white/10 rounded-xl"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Phone Number</Label>
                                    <Input
                                        value={newContact.phoneNumber}
                                        onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
                                        className="bg-background/50 border-white/10 rounded-xl"
                                        placeholder="+1..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Relationship</Label>
                                    <Input
                                        value={newContact.relationship}
                                        onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                                        className="bg-background/50 border-white/10 rounded-xl"
                                        placeholder="Family/Friend"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button 
                                    onClick={() => saveContact(newContact!)} 
                                    disabled={newContactLoading || !newContact.name || !newContact.phoneNumber}
                                    className="px-8 rounded-xl"
                                >
                                    {newContactLoading ? "Adding..." : "Confirm Addition"}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center justify-between border-b border-border/50 pb-2">
                    Your Trusted Inner Circle
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {contacts.length} Members
                    </span>
                </h3>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-card/30 rounded-3xl border border-dashed border-border/50">
                        <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground font-semibold">No contacts found</p>
                        <p className="text-sm text-muted-foreground/70 mt-2 max-w-xs">
                          Add your most trusted people so we know who to reach out to if you ever need help.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {contacts.map((contact) => (
                        <div 
                            key={contact.id} 
                            className="group relative bg-card border border-border/40 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {editContact?.id === contact.id ? (
                            <div className="space-y-4">
                                <h4 className="font-bold text-primary flex items-center gap-2">
                                    <Edit className="w-4 h-4" /> Update Info
                                </h4>
                                <div className="space-y-3">
                                    <Input
                                        size={1}
                                        value={editContact.name}
                                        onChange={(e) => setEditContact({ ...editContact, name: e.target.value })}
                                        className="bg-background/40 border-primary/20"
                                        placeholder="Name"
                                    />
                                    <Input
                                        size={1}
                                        type="email"
                                        value={editContact.email}
                                        onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
                                        className="bg-background/40 border-primary/20"
                                        placeholder="Email"
                                    />
                                    <Input
                                        size={1}
                                        value={editContact.phoneNumber}
                                        onChange={(e) => setEditContact({ ...editContact, phoneNumber: e.target.value })}
                                        className="bg-background/40 border-primary/20"
                                        placeholder="Phone"
                                    />
                                    <Input
                                        size={1}
                                        value={editContact.relationship}
                                        onChange={(e) => setEditContact({ ...editContact, relationship: e.target.value })}
                                        className="bg-background/40 border-primary/20"
                                        placeholder="Relationship"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                <Button size="sm" variant="ghost" onClick={() => setEditContact(null)} className="rounded-lg">
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={() => saveContact(editContact)} className="rounded-lg">
                                    <Save className="h-4 w-4 mr-2" /> Save
                                </Button>
                                </div>
                            </div>
                            ) : (
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                                                onClick={() => handleEdit(contact)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                                onClick={() => deleteContact(contact.id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="font-bold text-xl text-foreground truncate">{contact.name}</div>
                                        <p className="text-xs font-bold text-primary/80 uppercase tracking-widest">{contact.relationship}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                                    <div className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5 text-primary/60" />
                                            {contact.phoneNumber}
                                        </div>
                                        {contact.email && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-primary/60 text-xs">@</span>
                                                <span className="text-xs truncate max-w-[150px]">{contact.email}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                </div>
                            </div>
                            )}
                        </div>
                        ))}
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
      
      {/* Decorative indicator line at the bottom */}
      <div className="flex justify-center pt-4">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full" />
      </div>
    </div>
  );
}
