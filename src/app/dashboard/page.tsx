"use client";
import React, { useState, useEffect } from "react";
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
import {
  Check,
  Clock,
  LocateIcon,
  MessageCircle,
  MoreHorizontal,
  PhoneCall,
  Play,
  Settings,
  Settings2,
  ShieldAlert,
  VideoIcon,
  Lock,
  Videotape,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Switch } from "@/components/ui/switch";
import FakeCall from "@/components/common/fakeCall";
import FakeCallSettings from "@/components/common/fakeCallSettings";
import { useRouter } from "next/navigation";
// import axios from "axios";
import { Contacts as ContactsApi, SOS } from "@/lib/api";
import type { Contact } from "../../helpers/type.ts";
import { useUserStore } from "@/store/userStore";
import { triggerSOS } from "@/lib/sosTrigger";

// import axiosInstance from "@/lib/axiosInstance";

// const fetchProfile = async () => {
//   const res = await axiosInstance.get("/user/profile");
//   console.log(res.data);
// };

const tools = [
  {
    id: 1,
    Component: () => <Clock />,
    title: "Quick Timer",
  },
  {
    id: 2,
    Component: () => <Check />,
    title: "Check In",
  },
  {
    id: 3,
    Component: () => <PhoneCall />,
    title: "Call Contact",
  },
  {
    id: 4,
    Component: () => <LocateIcon />,
    title: "Share Location",
  },
];
export default function Dashboard() {
  // const [duration, setDuration] = useState(30);
  // const [shareLocation, setShareLocation] = useState(false);
  const user = useUserStore((state) => state.user);
  const [fakeCall, setFakeCall] = useState(false);
  const [delay, setDelay] = useState(10);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [fakeCallPending, setFakeCallPending] = useState(false);
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [openContactDialog, setOpenContactDialog] = useState<string | null>(
    null
  );
  const [openPoliceDialog, setOpenPoliceDialog] = useState(false);
  const [openWomenDialog, setOpenWomenDialog] = useState(false);
  const scheduleFakeCall = () => {
    setFakeCallPending(true);
    setCountdown(delay);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (fakeCallPending && countdown !== null && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (fakeCallPending && countdown === 0) {
      document.documentElement.requestFullscreen();
      setFakeCall(true);
      setFakeCallPending(false);
      setCountdown(null);
    }
    return () => clearInterval(timer);
  }, [fakeCallPending, countdown]);

  const [openSettings, setOpenSettings] = useState(false);
  const [settings, setSettings] = useState({
    name: "Mom",
    photo: "/mom.jpg",
    ringtone: "/fake-ring.mp3",
    voice: "/voice1.mp3",
  });

  const handleEdit = (contactId: string) => {
    console.log("Editing contact with ID:", contactId);
    // Navigate to /edit-contact/[id] or open modal
  };

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

  return (
    <div className="mx-4 py-8 ">
      <section className="mb-2 lg:h-100 md:h-90 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg">
        <Card className="h-full text-white text-center bg-transparent">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold lg:text-5xl w-full text-center mb-2">
              Welcome to Your Safety Dashboard {user?.firstName || "User"}!
            </CardTitle>
            <p>
              Your personal safety companion is ready to help. Use the quick
              actions below to stay protected wherever you go.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center gap-4">
            <div className="flex gap-2 w-full justify-center flex-wrap ">
              <Button className="bg-purple-500 text-white flex items-center justify-center border hover:bg-purple-800">
                <Play />
                Quick Tutorial
              </Button>
              <Button
                className="bg-white text-purple-500 flex items-center justify-center hover:text-purple-800 hover:bg-white"
                onClick={() => router.push("/stealth/customize")}
              >
                <Settings />
                Customize Stealth Mode
              </Button>
            </div>
            <div className="bg-white text-purple-600 mt-6">
              <ShieldAlert
                width={100}
                height={100}
                className="bg-purple-500 text-white"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* sos, safety timer, quick actions, emergency contacts */}
      <section className="flex flex-col lg:flex-row justify-center items-center  gap-2 py-4">
        <div className="flex lg:flex-col md:flex-row flex-wrap md:w-full justify-center p-2 lg:w-1/2  gap-2 ">
          {/* sos */}
          <Card className="flex flex-col justify-center items-center gap-4 h-100 my-2 p-2 md:w-fit lg:w-full w-full ">
            <h1 className="text-2xl font-bold text-purple-500 text">
              Emergency SOS
            </h1>
            <p className="text-gray-600">
              Activate in case of emergency to alert your contacts
            </p>
            <Button
              className="bg-red-500 text-white rounded-full w-40 text-center h-40 hover:bg-red-700"
              onClick={triggerSOS}
            >
              Activate SOS
              {/* <AnimatePresence>
            
            </AnimatePresence> */}
              <motion.div
                className="absolute bg-white w-40 h-40 rounded-full border-6 border-red-00"
                initial={{ opacity: 0.5, scale: 0 }}
                animate={{
                  opacity: [0.5, 0],
                  scale: [1, 1.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              ></motion.div>
            </Button>
            <p className="text-gray-600">
              Long press to activate emergency mode and alert everyone
            </p>
          </Card>

          {/* safety timer */}
          <Card className="p-4  min-h-70 flex flex-col items-center justify-around lg:w-full md:w-fit w-full">
            <CardTitle>
              <h1 className="text-2xl text-purple-500 font-bold text-center">
                Safety Timer
              </h1>
              <p className="text-gray-600 mt-2 text-center">
                Set a timer for activities and check-ins
              </p>
            </CardTitle>
            <CardContent className="w-full flex justify-center">
              <Button
                className="bg-purple-500 rounded-full w-40 h-40 hover:bg-purple-800"
                onClick={() => router.push("/actions/timer")}
              >
                Go Set Timer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* quick actions, my safety circle */}
        <div className="flex lg:flex-col md:flex-row  flex-wrap lg:w-1/3 justify-center">
          {/* quick actions */}
          <Card className="m-2 p-4 flex flex-col items-center justify-center gap-4 relative md:w-100 w-full lg:w-full lg:h-72">
            <CardTitle className="text-center ">
              <h1 className="text-2xl text-purple-500 font-bold">
                Quick Actions
              </h1>
              <span
                className="absolute right-4 top-2"
                onClick={() => router.push("/actions")}
              >
                <MoreHorizontal />
              </span>
              <p className="text-gray-600">Frequently used safety tools</p>
            </CardTitle>
            <CardContent className="flex flex-wrap gap-4 justify-center items-center">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center gap-2 border w-40 h-15 p-2 rounded-xl"
                >
                  <tool.Component />
                  <span>{tool.title}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* safety circle */}
          <Card className="p-4 m-2  h-100 overflow-y-auto flex flex-col items-center justify-center lg:w-full w-full md:w-fit">
            <CardTitle>
              <h1 className="text-2xl text-purple-500 font-bold text-center mt-2">
                My Safety Circle
              </h1>
              <p className="text-gray-600 mt-2 text-center">
                People who will be notified in emergencies
              </p>
              {/* <Button onClick={()=>getContacts()}>Get</Button> */}
            </CardTitle>

            {/* contacts */}
            <CardContent className="flex flex-col gap-2">
              {contacts.map((contact) => (
                <Card className="w-full" key={contact.id}>
                  <CardContent className="flex flex-wrap gap-2 justify-between">
                    <p>{contact.name}</p>
                    <div className="flex gap-4">
                      <Dialog
                        open={openContactDialog === contact.id}
                        onOpenChange={(open) =>
                          setOpenContactDialog(open ? contact.id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <button
                            onClick={() => setOpenContactDialog(contact.id)}
                            aria-label="Call"
                          >
                            <PhoneCall className="text-green-600 cursor-pointer hover:scale-105" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Call {contact.name}</DialogTitle>
                          </DialogHeader>
                          <p>
                            Do you want to call {contact.name} at{" "}
                            {contact.phoneNumber}?
                          </p>
                          <DialogFooter>
                            <button
                              className="bg-purple-600 text-white px-4 py-2 rounded"
                              onClick={() => {
                                window.location.href = `tel:${contact.phoneNumber}`;
                                setOpenContactDialog(null);
                              }}
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
                        onClick={() => handleEdit(contact.id)}
                        aria-label="Edit"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Lock /> {/* Replace with Edit icon if preferred */}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {contacts.length === 0 && (
                <p className="text-gray-500 text-center">
                  No contacts added yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* fake call, emergency resource panel */}
      <section className="flex flex-wrap justify-center w-full p-2 gap-8 md:px-14">
        {/* fake call */}
        <Card className="flex flex-col justify-center items-center gap-4 lg:w-1/2  w-full h-100 my-2 p-4 relative">
          <h1 className="text-2xl font-bold text-purple-500">Fake Call</h1>
          <button
            className="absolute right-4 top-4"
            onClick={() => setOpenSettings(true)}
            aria-label="Open fake call settings"
            title="Open fake call settings"
          >
            <Settings2 />
          </button>
          <p className="text-gray-600">
            Trigger a fake incoming call to help escape uncomfortable
            situations.
          </p>
          <Button
            className="w-40 h-40 rounded-full bg-purple-500 text-white hover:bg-purple-700 flex flex-col items-center justify-center"
            onClick={() => scheduleFakeCall()}
            disabled={fakeCallPending}
          >
            <PhoneCall width={200} height={200} className="font-bold" />
            {fakeCallPending && countdown !== null && (
              <span className="mt-2 text-lg font-bold animate-pulse">
                Fake call in {countdown}s
              </span>
            )}
          </Button>

          <p className="text-gray-600">
            Trigger a Fake Call in{" "}
            <select
              className="bg-white text-black rounded px-3 py-1"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              aria-label="Fake call delay"
              title="Fake call delay"
            >
              <option value={0}>0s</option>
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={30}>30s</option>
            </select>{" "}
            seconds
          </p>

          {openSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
              <FakeCallSettings
                onSave={(newSettings) => {
                  setSettings(newSettings);
                  setOpenSettings(false);
                }}
              />
            </div>
          )}
          {fakeCall && (
            <FakeCall onClose={() => setFakeCall(false)} settings={settings} />
          )}
        </Card>

        {/* emergency resource */}
        <Card className="px-8 py-2 m-2  h-100 overflow-y-auto lg:w-1/3 w-full ">
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
                <Dialog
                  open={openPoliceDialog}
                  onOpenChange={setOpenPoliceDialog}
                >
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
                <Dialog
                  open={openWomenDialog}
                  onOpenChange={setOpenWomenDialog}
                >
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
      </section>
    </div>
  );
}

//  Tools You Could Use:
// framer-motion → For smooth slide transitions

// useRef + scrollIntoView() → For native scroll

// Tailwind utilities like overflow-x-scroll, snap-x, snap-start → For scroll snapping
