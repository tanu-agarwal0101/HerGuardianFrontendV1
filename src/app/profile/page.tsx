"use client";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Card, CardTitle } from "@/components/ui/card";
import { User } from "@/helpers/type";
// import axiosInstance from "@/lib/axiosInstance";
import { Users } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import CardContent from "@mui/material/CardContent";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LetterText, Mail, Pencil, PhoneCall, Plus } from "lucide-react";
import { ShieldCheck, AlertTriangle } from "lucide-react"; // example icons
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  // const user = useUserStore((state) => state.user);
  // const [userNew, setUserNew] = useState<User | null>(null);
  // console.log("User data:", user);
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await Users.getProfile();
        setProfile(user as any);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // console.log("User data after fetch:", userNew);

  const combinedTimeline = [
    ...(profile?.safetyTimers || []).map((timer) => ({
      type: "timer",
      id: timer.id,
      date: timer.createdAt,
      label: `Safety Timer (${timer.duration} min)`,
      isActive: timer.isActive,
    })),
    ...(profile?.sosTriggers || []).map((sos) => ({
      type: "sos",
      id: sos.id,
      date: sos.triggeredAt,
      label: "SOS Triggered",
      location: {
        lat: 1,
        lon: 1,
      },
      resolved: sos.resolved,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="">
      <Header />
      <div className="p-4 w-full flex flex-col justify-around items-center min-h-screen gap-10">
        <Card className="w-full p-0 ">
          <div className="w-full bg-purple-600 h-60 rounded-lg relative"></div>
          <div className="absolute bottom-40 right-8 flex flex-col gap-2 items-start p-4">
            <Image
              src={profile?.profilePicture || "/img1.avif"}
              alt="Profile Picture"
              className="size-40 object-cover rounded-full"
              width={100}
              height={100}
            />
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p>Unknown Country</p>
              <Button className="bg-white text-purple-600 border">
                <Pencil />
                Edit Profile
              </Button>
            </div>
          </div>
          <div className="w-full flex  justify-start gap-12">
            <div className="w-60 p-4">
              <h3 className="font-semibold">About Me</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero
                dolorem ipsam odit eos harum, quia blanditiis ex architecto
                rerum tenetur.
              </p>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="flex items-center gap-2">
                <Mail /> {profile?.email}
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall /> {profile?.phoneNumber}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Emergency Contacts</h3>
              <ul className="list-none pl-4">
                {profile ? (
                  profile.contacts?.map((contact, index) => (
                    <li key={index} className="flex gap-2">
                      {" "}
                      {contact?.name}: {contact?.phoneNumber}
                    </li>
                  ))
                ) : (
                  <li>No contacts available</li>
                )}
                <li
                  className="border p-1 w-fit"
                  onClick={() => router.push("/actions/calls")}
                >
                  <Plus />
                </li>
              </ul>
            </div>
          </div>
        </Card>
        <div className="w-full flex flex-col gap-4 my-12">
          <h2 className="font-bold text-2xl text-purple-800 text-center mb-12">
            Safety History
          </h2>
          <Card className="p-4">
            <div className="space-y-4 ">
              {combinedTimeline.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-white"
                >
                  <div className="text-purple-600">
                    {event.type === "sos" ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <ShieldCheck className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{event.label}</span>
                    <span className="text-gray-500 text-sm">
                      {format(new Date(event.date), "PPpp")}
                    </span>
                    {event.type === "sos" && (
                      <a
                        href={`https://www.google.com/maps?q=blank,blank`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-sm"
                      >
                        View Location
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card>Settings</Card>
      </div>
      <Footer />
    </div>
  );
}
