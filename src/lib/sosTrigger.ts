// import axiosInstance from "@/lib/axiosInstance";
import { SOS } from "@/lib/api";
import { toast } from "sonner";

export const triggerSOS = async () => {
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
  } catch (error: any) {
    console.error("Error triggering SOS:", error);
    if (error?.response?.status === 429) {
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
  }
};

//  Step 3: (Optional but cool) Show "SOS triggered" status in frontend history/log
// 🔔 Step 4: Notify emergency contacts (SMS, email, push)
