"use client";
import Footer from "@/components/common/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Check, Clock, Lock, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const cards = [
  {
    step: "1",
    title: "Instant SOS Alerts",
    desc: "Send emergency alerts to your trusted contacts with one tap when you feel unsafe.",
  },
  {
    step: "2",
    title: "Live Location Tracking",
    desc: "Share your real-time location with selected contacts during your journeys.",
  },
  {
    step: "3",
    title: "Safety Timer",
    desc: "Set a timer for activities and automatically alert contacts if you don't check in.",
  },
  {
    step: "4",
    title: "Discreet Emergency Mode",
    desc: "Activate emergency protocols silently without alerting others around you.",
  },
];

const work = [
  {
    step: "1",
    color: "blue-500",
    title: "Create Your Safety Circle",
    desc: "Add trusted friends and family members who will receive alerts in case of emergency.",
    image: "/image.png",
  },
  {
    step: "2",
    color: "pink-500",
    title: "Set Up Emergency Preferences",
    desc: "Customize alert triggers, messages, and safety check-in schedules to fit your lifestyle.",
    image: "/image.png",
  },
  {
    step: "3",
    color: "green-500",
    title: "Feel Protected, Wherever You Go",
    desc: "Enjoy peace of mind knowing that help is just a tap away whenever you need it",
    image: "/image.png",
  },
];

const features = [
  {
    step: "1",
    icon: "lock",
    title: "256-bit Encryption",
    Component: () => <Lock />,
  },
  {
    step: "2",
    icon: "shield",
    title: "Privacy Protected",
    Component: () => <ShieldAlert />,
  },
  {
    step: "3",
    icon: "tick",
    title: "Verified Security",
    Component: () => <Check />,
  },
  {
    step: "4",
    icon: "robot",
    title: "24/7 Support",
    Component: () => <Clock />,
  },
];

export default function Home() {

    useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then(() => {
            console.log('Service Worker unregistered:', registration);
          });
        });
      });
    }
  }, []);
  
  const router = useRouter();
  return (
    <div>
      <section className="flex flex-col justify-between items-start gap-4 px-12 py-40 bg-purple-500 text-white">
        <h1 className="capitalize text-3xl font-extrabold w-1/3">
          Your silent shield, your digital guardian.
        </h1>
        <h2 className="text-xl w-1/3">
          A smart, reliable safety companion for women—built with care, powered
          by technology.
        </h2>
        <div className="flex gap-4">
          <Button className="bg-white text-purple-600" onClick={()=> router.push("/registration")}>Get Started</Button>
          <Button className="bg-white text-purple-600">How it works</Button>
        </div>
      </section>

      {/* designed for your safety */}
      <section className="flex flex-col justify-between items-center gap-4 px-12 py-20">
        <h1 className="text-3xl font-extrabold">Designed for Your Safety</h1>
        <p className="">
          Essential features that provide peace of mind wherever you go.{" "}
        </p>
        <div className="flex gap-4 justify-center py-4 flex-wrap">
          {cards.map((card) => (
            <Card key={card.step} className="w-100 h-80">
              <CardHeader>
                <div className="rounded-full bg-blue-400 text-center place-content-center text-white w-10 h-10 mb-4">
                  {card.step}
                </div>
                <CardTitle>
                  <h1 className="text-xl">{card.title}</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>{card.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="flex flex-col justify-between items-center gap-4 px-8 py-20 bg-slate-100 ">
        <h1 className="text-3xl font-extrabold">How It Works</h1>
        <p className="text-xl">
          Three simple steps to enhance your personal safety
        </p>
        <div className="flex flex-wrap gap-8  p-4 items-center justify-center">
          {work.map((card) => (
            <Card key={card.step} className="w-100 h-80">
              <CardHeader>
                <div
                  className={`rounded-full  w-10 h-10 p-2 flex justify-center items-center text-white bg-${card.color}`}
                >
                  {card.step}
                </div>
                <CardTitle>
                  <h1>{card.title}</h1>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center">
                {card.desc}
                <Image
                  src={card.image}
                  alt="image description"
                  width={200}
                  height={100}
                  className="border mt-4 rounded-2xl"
                />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 lg:px-36 py-4 items-center justify-center">
          {features.map((feature) => (
            <Card
              key={feature.step}
              className="w-50 p-2 flex justify-center items-center gap-2"
            >
              <CardContent className="flex justify-center items-center gap-2 text-[14px]">
                <span>{feature.Component()}</span>
                <span>{feature.title}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>


          {/* our mission */}
      <section className="mission flex px-10 pt-16 pb-24 gap-4 justify-between items-center lg:flex-nowrap md:flex-wrap flex-wrap">
        <div className="left lg:w-1/2 flex flex-col justify-center gap-4">
          <h1 className="text-3xl font-extrabold text-center">Our Mission</h1>
          <h4 className="text-xl text-center">
            At HerGuardian, we believe that
            <span className="text-purple-600">
              {" "}
              every woman deserves to move through the world with confidence,
            </span>{" "}
            free from fear and anxiety.
          </h4>
          <p className="text-center ">
            Our platform was born from a simple yet powerful idea: to harness
            technology in service of women&apos;s safety and peace of mind.
            We&apos;ve built a digital guardian that&apos;s always there when
            you need it, empowering you to live life on your own terms.
          </p>
          <p className="text-center">
            We&apos;re committed to continuous innovation, working closely with
            safety experts and our user community to create the most effective,
            intuitive safety companion possible.
          </p>
        </div>
        <div className="right flex justify-center items-center md:w-full sm:w-full lg:w-1/2">
          <img
            src="/img1.avif"
            alt="image description"            
            className="border rounded-2xl lg:h-100 md:w-150 h-100 w-full"
          />
        </div>
      </section>

      {/* safe space */}
      <section className="flex flex-col justify-between items-center gap-4 px-12 py-20 bg-gradient-to-r from-blue-800 via-pink-500 to-green-600 text-white">
        <h1 className="text-3xl font-extrabold">
          Create Your Safe Space Today
        </h1>
        <h3 className="text-xl">
          Join thousands of women who have found peace of mind with HerGuardian.
          Your safety is our priority.
        </h3>
        <Button className="bg-white text-purple-600">Join Now</Button>
        <p>Available on iOS and Android</p>
        <div className="flex gap-2">
          <Button className="bg-white text-purple-600">App store</Button>
          <Button className="bg-white text-purple-600">Google Play</Button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
