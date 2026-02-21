// import axiosInstance from "@/lib/axiosInstance";
import { SOS } from "@/lib/api";
import { toast } from "sonner";

let isTriggering = false;

export const triggerSOS = async () => {
  if (isTriggering) return;
  isTriggering = true;
  
  let toastId: string | number | undefined;
  try {
    toastId = toast.loading("Triggering SOS...");
    const coords = await new Promise<{ latitude: number; longitude: number }>(
      (resolve, reject) => {
        if (!navigator.geolocation) {
          toast.error("Geolocation is not supported");
          return reject(new Error("Geolocation is not supported"));
        }
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }),
          (err) => {
            toast.error("Unable to retrieve location");
            reject(err);
          }
        );
      }
    );
    const payload = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      triggeredAt: new Date().toISOString(),
    };
    await SOS.trigger(payload);
    toast.success("SOS triggered successfully!");
  } catch (error: unknown) {
    console.error("Error triggering SOS:", error);
    if ((error as { response?: { status?: number } })?.response?.status === 429) {
      toast.error(
        "You are triggering SOS too quickly. Please wait and try again."
      );
    } else {
      toast.error(
        "An error occurred while triggering SOS. Please try again later."
      );
    }
  } finally {
    if (toastId !== undefined) toast.dismiss(toastId);
    // Reset flag after a delay to prevent immediate re-trigger? or just immediately?
    // Immediate is fine since pure function execution is supposedly atomic enough, 
    // but async might overlap. Let's wait a bit or just reset.
    // Resetting immediately allows next distinct trigger.
    setTimeout(() => { isTriggering = false; }, 2000); 
  }
};

//  Step 3: (Optional but cool) Show "SOS triggered" status in frontend history/log
// 🔔 Step 4: Notify emergency contacts (SMS, email, push)
