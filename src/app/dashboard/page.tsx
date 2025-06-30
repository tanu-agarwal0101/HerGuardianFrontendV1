"use client";
import React, { useState, useEffect } from "react";
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
  VideoIcon, Lock,
  Videotape,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Switch } from "@/components/ui/switch";
import FakeCall from "@/components/common/fakeCall";
import FakeCallSettings from "@/components/common/fakeCallSettings";
import { useRouter } from "next/navigation";
import axios from "axios";
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
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([])
  const scheduleFakeCall = ()=>{
    setTimeout(()=>{
      document.documentElement.requestFullscreen();
      setFakeCall(true);
    }, delay * 1000);
  };

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

  const getContacts = async()=>{
    try {
      const response = await axios.get("http://localhost:5001/contacts/get-all-contacts", {
        withCredentials: true
      })
      const data = response.data;
      console.log("Fetched contacts:", data);
      setContacts(data.contacts);
      // console.log("Contacts state updated:", contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    } 
  }
  
  useEffect(()=>{
    getContacts();
    console.log("user is",user)
  },[])

  return (
    <div className="p-6">
      <section className="mb-8 lg:h-100 md:h-80 ">
        <Card className="rounded-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold">
              Welcome to Your Safety Dashboard {user?.firstName || "User"}!
            </CardTitle>
            <p>
              Your personal safety companion is ready to help. Use the quick
              actions below to stay protected wherever you go.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center ">
            <div className="flex gap-2 w-full justify-start flex-wrap">
              <Button className="bg-purple-500 text-white flex items-center justify-center hover:bg-purple-800">
                <Play />
                Quick Tutorial
              </Button>
              <Button className="bg-white text-purple-500 flex items-center justify-center hover:text-purple-800 hover:bg-white" onClick={()=>router.push('/stealth/customize')}>
                <Settings />
                Customize Stealth Mode
              </Button>
            </div>
            <div className="bg-white text-purple-600 mt-6">
              <ShieldAlert width={100} height={100} className="bg-purple-500 text-white" />
            </div>
          </CardContent>
        </Card>
      </section>


{/* sos, safety timer, quick actions, emergency contacts */}
      <section className="flex flex-col lg:flex-row justify-center">
        <div className="flex flex-col">

          {/* sos */}
          <Card className="flex flex-col justify-center items-center gap-4 lg:w-200 h-100 m-2 p-4">
            <h1 className="text-2xl font-bold text-purple-500 text">Emergency SOS</h1>
            <p className="text-gray-600">
              Activate in case of emergency to alert your contacts
            </p>
            <Button
              className="bg-red-500 text-white rounded-full w-40 text-center h-40"
              onClick={triggerSOS}
            >
              Activate SOS
              {/* <AnimatePresence>
            
            </AnimatePresence> */}
              <motion.div
                className="absolute bg-white w-40 h-40 rounded-full border-6 border-red-500"
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
          <Card className="m-2 p-4 lg:w-200 min-h-70">
            <CardTitle>
              <h1 className="text-2xl text-purple-500 font-bold text-center">
                Safety Timer
              </h1>
              <p className="text-gray-600 mt-2 text-center">
                Set a timer for activities and check-ins
              </p>
            </CardTitle>
            <CardContent className="w-full flex justify-center">
              <Button className="bg-purple-500 rounded-full w-40 h-40" onClick={()=>router.push('/actions/timer')}>
                Go Set Timer
              </Button>
            </CardContent>

          </Card>
        </div>

        {/* quick actions, my safety circle */}
        <div className="flex lg:flex-col">

          {/* quick actions */}
          <Card className="w-150 lg:h-80 h-100 m-2 p-4 flex flex-col items-center justify-center gap-4 relative">
            <CardTitle className="text-center ">
              <h1 className="text-2xl text-purple-500 font-bold">
                Quick Actions
              </h1>
              <span className="absolute right-4 top-2" onClick={()=>router.push("/actions")}><MoreHorizontal/></span>
              <p className="text-gray-600">Frequently used safety tools</p>
            </CardTitle>
            <CardContent className="flex flex-wrap col-span-2 gap-4 justify-center items-center">
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
          <Card className="p-4 m-2 w-150 lg:h-90 h-100 overflow-y-auto flex flex-col items-center justify-center">
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
              {contacts.map((contact)=>(
                <Card className="w-full" key={contact.id}>
                <CardContent className="flex flex-wrap gap-2 justify-between">
                  <p>{contact.name}</p>
                  <div className="flex gap-4">
                    <a href={`tel:${contact.phoneNumber}`} aria-label="Call">
            <PhoneCall className="text-green-600 cursor-pointer hover:scale-105" />
          </a>
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
                <p className="text-gray-500 text-center">No contacts added yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>



      {/* fake call, emergency resource panel */}
      <section className="flex flex-wrap justify-center">

        {/* fake call */}
        <Card className="flex flex-col justify-center items-center gap-4 lg:w-200 h-100 m-2 p-4 relative">
          <h1 className="text-2xl font-bold text-purple-500">Fake Call</h1>
          <button className="absolute right-4 top-4" onClick={()=>setOpenSettings(true)}>
            <Settings2/>
          </button>
          <p className="text-gray-600">
            Trigger a fake incoming call to help escape uncomfortable
            situations.
          </p>
          <Button className="w-40 h-40 rounded-full bg-purple-500 text-white" onClick={()=> scheduleFakeCall()}>
            <PhoneCall width={200} height={200} className="font-bold" />
          </Button>
          
          <p className="text-gray-600">Trigger a Fake Call in <select
  className="bg-white text-black rounded px-3 py-1"
  value={delay}
  onChange={(e) => setDelay(Number(e.target.value))}
>
  <option value={0}>0s</option>
  <option value={5}>5s</option>
  <option value={10}>10s</option>
  <option value={30}>30s</option>
</select> seconds</p>


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
          {fakeCall && <FakeCall onClose={() => setFakeCall(false)} settings={settings} />}
        </Card>

        {/* emergency resource */}
        <Card className="p-4 m-2 w-150 h-100 overflow-y-auto">
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
                <button onClick={() => {if (confirm("Do you want to call the police station?")) { window.location.href = "tel:100";}  }}>  
                  <PhoneCall />
                </button>
                  
                
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardContent className="flex flex-wrap gap-2 justify-between">
                <p>Women&apos;s helpline</p>
                  <button onClick={() => {if (confirm("Do you want to call the Women Helpline?")) { window.location.href = "tel:1090";}  }}>  
                    <PhoneCall />
                  </button>
                
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardContent className="flex flex-wrap gap-2 justify-between">
                <p>Support chat </p>
                <button onClick={() => router.push("/actions/support-chat")}>  
                  <MessageCircle/>
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
