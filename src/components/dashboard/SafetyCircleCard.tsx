"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhoneCall, Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Contacts as ContactsApi } from "@/lib/api";
import type { Contact } from "../../helpers/type.ts";
import { useRouter } from "next/navigation";

export function SafetyCircleCard() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [openContactDialog, setOpenContactDialog] = useState<string | null>(null);

  const getContacts = async () => {
    try {
      const data = await ContactsApi.getAll();
      setContacts(data);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <Card className="flex flex-col h-full shadow-md p-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-primary">
            My Safety Circle
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary gap-1" onClick={() => router.push("/dashboard/actions/calls")}>
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
            <Button variant="outline" onClick={() => router.push("/dashboard/actions/calls")}>
              Add Trusted Contact
            </Button>
          </div>
        ) : (
          <>
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
                          <Button variant="ghost" onClick={() => setOpenContactDialog(null)}>Cancel</Button>
                          <Button onClick={() => (window.location.href = `tel:${c.phoneNumber}`)}>Call Now</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 gap-2 self-center"
              onClick={() => router.push("/dashboard/actions/calls")}
            >
              <Users className="h-4 w-4" /> Manage Contacts
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
