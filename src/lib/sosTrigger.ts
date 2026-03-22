import { SOS } from "@/lib/api";
import { toast } from "sonner";

let isTriggering = false;

export const triggerSOS = async (router?: { push: (url: string) => void }) => {
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
    const response = await SOS.trigger(payload);
    const { message, warning, error: hasError, notifications, trackingSessionId } = response.data;

    if (hasError || warning) {
      const failures = [];
      if (notifications?.email?.success === false) failures.push("Email");
      if (notifications?.push?.success === false) failures.push("Push");
      
      const failureDetail = failures.length > 0 ? ` [Failed: ${failures.join(", ")}]` : "";
      
      if (hasError) {
        toast.error((message || "SOS logged, but ALL notification attempts failed!") + failureDetail);
      } else {
        toast.warning((message || "SOS logged, but some notifications failed.") + failureDetail);
      }
    } else {
      toast.success(message || "SOS triggered successfully!");
      if (router && trackingSessionId) {
        router.push(`/dashboard/sos?sessionId=${trackingSessionId}`);
      }
    }
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

    setTimeout(() => { isTriggering = false; }, 2000); 
  }
};

