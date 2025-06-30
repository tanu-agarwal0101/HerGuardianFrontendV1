import axios from "axios"

export const triggerSOS = async ()=>{
    try{
        const coords = await new Promise<{ latitude: number; longitude: number }>((resolve, reject)=> {
             if (!navigator.geolocation) {
        return reject(new Error("Geolocation is not supported"));
      }

            navigator.geolocation.getCurrentPosition(
                (pos)=> resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }),
                (err)=> reject(err)
            )
        })

        const payload = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            triggeredAt: new Date().toISOString(),
            // sentBy: user
        }

        await axios.post("http://localhost:5001/users/sos-trigger", payload, {
            withCredentials: true, 
            headers: {
        "Content-Type": "application/json",
      }, 
        })
        alert("SOS triggered successfully! ");
    }catch(error){
        console.error("Error triggering SOS:", error);
        alert("An error occurred while triggering SOS. Please try again later.");
    }
}



//  Step 3: (Optional but cool) Show "SOS triggered" status in frontend history/log
// 🔔 Step 4: Notify emergency contacts (SMS, email, push)