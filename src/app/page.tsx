"use client";
import Footer from "@/components/common/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BellRing,
  Check,
  Clock,
  Clock1,
  Locate,
  Lock,
  ShieldAlert,
  ShieldHalf,
  Users,
  Sliders,
  ShieldCheck,
  Shield,
  ArrowRight,
  Smartphone,
  GlobeLock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { motion } from "motion/react";
import Link from "next/link";

const cards = [
  {
    step: "1",
    title: "Instant SOS Alerts",
    desc: "Send emergency alerts to your trusted contacts with one tap when you feel unsafe.",
    Icon: () => <BellRing className="w-6 h-6 text-indigo-500"/>,
    color: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    step: "2",
    title: "Live Location Tracking",
    desc: "Share your real-time location with selected contacts during your journeys.",
    Icon: () => <Locate className="w-6 h-6 text-blue-500"/>,
    color: "bg-blue-500/10 border-blue-500/20",
  },
  {
    step: "3",
    title: "Safety Timer",
    desc: "Set a timer for activities and automatically alert contacts if you don't check in.",
    Icon: () => <Clock1 className="w-6 h-6 text-green-500"/>,
    color: "bg-green-500/10 border-green-500/20",
  },
  {
    step: "4",
    title: "Discreet Emergency Mode",
    desc: "Activate emergency protocols silently without alerting others around you.",
    Icon: () => <ShieldHalf className="w-6 h-6 text-red-500"/> ,
    color: "bg-red-500/10 border-red-500/20",
  },
];

const work = [
  {
    step: "1",
    title: "Create Your Safety Circle",
    desc: "Add trusted friends and family members who will receive alerts in case of emergency.",
    Icon: () => <Users className="w-12 h-12 text-primary" />,
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    step: "2",
    title: "Set Up Preferences",
    desc: "Customize alert triggers, messages, and safety check-in schedules to fit your lifestyle.",
    Icon: () => <Sliders className="w-12 h-12 text-primary" />,
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    step: "3",
    title: "Feel Protected Everywhere",
    desc: "Enjoy peace of mind knowing that help is just a tap away whenever you need it.",
    Icon: () => <ShieldCheck className="w-12 h-12 text-primary" />,
    gradient: "from-pink-500/20 to-orange-500/20",
  },
];

const features = [
  {
    step: "1",
    title: "256-bit Encryption",
    Component: () => <Lock className="w-4 h-4 text-primary"/>,
  },
  {
    step: "2",
    title: "Privacy Protected",
    Component: () => <ShieldAlert className="w-4 h-4 text-primary"/>,
  },
  {
    step: "3",
    title: "Verified Security",
    Component: () => <Check className="w-4 h-4 text-primary"/>,
  },
  {
    step: "4",
    title: "24/7 Availability",
    Component: () => <Clock className="w-4 h-4 text-primary"/>,
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const _hasHydrated = useUserStore((state) => state._hasHydrated);

  useEffect(() => {
    if (_hasHydrated && user) {
      router.replace("/dashboard");
    }
  }, [user, _hasHydrated, router]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then(() => {
            console.log("Service Worker unregistered (dev):", registration);
          });
        });
      });
    }
  }, []);

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-primary/30 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] rounded-full bg-accent/20 blur-[100px] pointer-events-none -z-10" />

      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-background/50 backdrop-blur-xl border-b border-border/40">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="rounded-xl group-hover:bg-primary/20 transition-colors">
            <img src="/image.png" alt="HerGuardian Logo" className="w-8 h-8 rounded-lg" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">HerGuardian</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.push("/login")} className="hidden sm:inline-flex font-medium">Log In</Button>
          <Button onClick={() => router.push("/registration")} className="hidden md:block bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 rounded-full px-6">
            Get Started
          </Button>
        </div>
      </header>

      <section className="relative pt-38 md:pt-44 pb-16 px-6 lg:px-12 flex flex-col items-center justify-center text-center min-h-[90vh]">
        <motion.div 
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="flex flex-col items-center max-w-4xl mx-auto z-10 pb-6"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8">
            <GlobeLock className="w-4 h-4" />
            <span>Next-Generation Personal Safety</span>
          </motion.div>
          <motion.div variants={fadeUp}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                Your silent shield, <br className="hidden md:block" />
                <span className="text-primary drop-shadow-sm">your digital guardian.</span>
              </h1>
          </motion.div>
          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl font-light">
            A smart, reliable safety companion built with care and powered by state-of-the-art technology.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground hover:text-white h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105"
              onClick={() => router.push("/registration")}
            >
              Start for free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg rounded-full border-primary/30 hover:text-black text-primary hover:bg-primary/5 bg-background/50 backdrop-blur-sm"
                onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
              How it works
            </Button>
          </motion.div>
        </motion.div>

        {/* App Mockup*/}
        <motion.div 
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            className="mt-24 relative w-full max-w-6xl aspect-[16/10] sm:aspect-video rounded-xl sm:rounded-3xl bg-background/95 backdrop-blur-3xl border border-border shadow-2xl overflow-hidden flex flex-col group max-h-144"
        >
            {/* OSX-style Desktop Header */}
            <div className="h-10 border-b border-border/40 flex items-center px-4 bg-muted/20">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex-1 text-center flex justify-center">
                   <div className="h-4 w-48 bg-muted/50 rounded-full" />
                </div>
            </div>
            
            <img src="/dashboard.png" className=""/>
        </motion.div>
      </section>

      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Protecting What Matters</h2>
            <p className="text-lg text-muted-foreground">Essential features that provide peace of mind wherever you go.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.div 
                key={card.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
                <Card className="h-full bg-card/60 backdrop-blur-lg border-white/10 hover:shadow-xl transition-all hover:-translate-y-1 p-6 md:p-8 flex flex-col justify-between">
                <CardHeader className="p-0 pb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${card.color}`}>
                        {card.Icon()}
                    </div>
                    <CardTitle className="text-xl font-bold">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{card.desc}</p>
                </CardContent>
                </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works (Visual Steps) */}
      <section id="how-it-works" className="py-24 px-6 lg:px-12 relative z-10 bg-muted/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
                <p className="text-lg text-muted-foreground">Three simple steps to enhance your personal safety</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />

                {work.map((item, idx) => (
                    <motion.div 
                        key={item.step}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.2 }}
                        className="flex flex-col items-center text-center relative z-10"
                    >
                        {/* Visual Asset Replacement for old raster images */}
                        <div className={`w-full aspect-square max-w-[280px] rounded-3xl bg-gradient-to-br ${item.gradient} p-1 mb-8 shadow-xl`}>
                            <div className="w-full h-full bg-card rounded-[22px] flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-5xl font-black text-primary/10">{item.step}</span>
                                </div>
                                {item.Icon()}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 md:gap-8 pt-20 items-center justify-center">
                {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border/50 text-sm font-medium shadow-sm">
                        {feature.Component()}
                        <span>{feature.title}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">Our Mission</h2>
            <h4 className="text-xl leading-relaxed font-medium">
              At HerGuardian, we believe that
              <span className="text-primary font-bold">
                {" "}every woman deserves to move through the world with confidence,
              </span>{" "}
              free from fear and anxiety.
            </h4>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our platform was born from a simple yet powerful idea: to harness
              technology in service of women&apos;s safety and peace of mind.
              We&apos;ve built a digital guardian that&apos;s always there when
              you need it, empowering you to live life on your own terms.
            </p>
          </div>
          <div className="lg:w-1/2 w-full">
            {/* Visual Replacement for /img1.avif */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-card">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                        <ShieldAlert className="w-32 h-32 text-primary relative z-10 opacity-80" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA / Safe Space */}
      <section className="py-24 px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary via-[#4f46e5] to-[#312e81] rounded-[3rem] p-10 md:p-16 text-center text-white shadow-[0_20px_50px_-12px_rgba(99,102,241,0.6)] relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl mix-blend-overlay" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl mix-blend-overlay" />
            
            <div className="relative z-10 space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                Create Your Safe Space Today
                </h2>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                Join thousands of women who have found peace of mind with HerGuardian. Your safety is our priority.
                </p>
                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button 
                        size="lg" 
                        className="bg-white text-primary hover:bg-gray-100 h-14 px-10 text-lg rounded-full shadow-xl transition-all hover:scale-105 w-full sm:w-auto font-bold"
                        onClick={() => router.push("/registration")}
                    >
                        Join Now
                    </Button>
                </div>
                <div className="pt-8 flex justify-center gap-4">
                    <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white rounded-full">
                        <Smartphone className="w-5 h-5" /> Install to your home screen for faster access
                    </Button>
                </div>
            </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-border/30 bg-background/80 backdrop-blur-sm">
        <Footer />
      </div>
    </div>
  );
}
