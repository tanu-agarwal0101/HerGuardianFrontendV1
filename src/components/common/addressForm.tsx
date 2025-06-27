"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import * as z from "zod";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { addressSchema } from "@/helpers/schema";
import LocationMap from "./LocationMap";

type AddressValues = z.infer<typeof addressSchema>;

export default function AddressForm() {
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
  });

  const fetchCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", parseFloat(position.coords.latitude.toFixed(6)));
          setValue("longitude", parseFloat(position.coords.longitude.toFixed(6)));
        },
        (error) => {
          alert("Unable to retrieve location");
          console.error(error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
    setLoading(false);
  };

   const fetchCoordinatesFromAddress = async () => {
    console.log("Fetching coordinates with the following address:", getValues());
    const { street, city, state, country, zipCode } = getValues();
    if (street && city && state && country && zipCode) {
      try {
        const fullAddress = `${street.toLowerCase()}, ${city.toLowerCase()}, ${state.toLowerCase()}, ${country.toLowerCase()}`;
        const response = await axios.get("https://locationiq.com/v1/search", {
          params: {
            key: process.env.NEXT_PUBLIC_LOCATION_IQ_ACCESS_TOKEN,
            q: fullAddress,
            format: "json",
          },
        });
        console.log(response.data);
        if (response.data.length === 0) {
          alert(
            "Could not find the address. Try removing street info or double-checking it."
          );
        } else if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setValue("latitude", parseFloat(lat));
          setValue("longitude", parseFloat(lon));
          setMap(true);
        } else {
          console.error("No results found for the given address");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    }
  };

//    function getDistanceInMeters(
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
//   ): number {
//     // Haversine formula to calculate the distance between two points on the Earth
//     // lat1, lon1: coordinates of the first point (in degrees)
//     // lat2, lon2: coordinates of the second point (in degrees)
//     // Returns the distance in meters
//     const R = 6371e3; // Earth radius in meters
//     const φ1 = (lat1 * Math.PI) / 180;
//     const φ2 = (lat2 * Math.PI) / 180;
//     const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//     const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in meters
//   } 

//     const [savedLocation, setSavedLocation] = useState({
//     latitude: 0,
//     longitude: 0,
//     label: "Home",
//     radiusMeters: 1000, // Example: 1 km
//   });

//   const checkIfWithinRadius = () => {
//     const currentLat = getValues().latitude;
//     const currentLon = getValues().longitude;

//     // Check if the conversion was successful
//     if (isNaN(currentLat) || isNaN(currentLon)) {
//       console.error("Invalid latitude or longitude");
//       return;
//     }

//     const distance = getDistanceInMeters(
//       savedLocation.latitude,
//       savedLocation.longitude,
//       currentLat,
//       currentLon
//     );
//     console.log(`Distance: ${distance} meters`);

//     if (distance <= savedLocation.radiusMeters) {
//       console.log("Within the specified radius");
//     } else {
//       console.log("Outside the specified radius");
//     }
//   };

//     useEffect(() => {
//     if (getValues().latitude && getValues().longitude) {
//       checkIfWithinRadius();
//     }
//   }, [getValues().latitude, getValues().longitude]);

  useEffect(() => {
    if (useCurrentLocation) {
      fetchCurrentLocation();
    } 
    // else {
    //   fetchCoordinatesFromAddress();
    // }
  }, [useCurrentLocation]);

  const saveAddress = async(data: AddressValues)=>{
    
    try {
        console.log("Form data:", data);
      const res = await axios.post("http://localhost:5001/address/create-address", {
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude,
        radiusMeters: data.radiusMeters,
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,

      },{
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error submitting location:", error);
    }
  }
  const onSubmit = async () => {
    console.log("Submitting form with values:", getValues());
    if (!useCurrentLocation) {
    await fetchCoordinatesFromAddress();
  }

  const updated = getValues();

  if (!updated.latitude || !updated.longitude) {
    alert("Please fetch coordinates before submitting.");
    return;
  }

  await saveAddress(updated);
    
  };

  

  return (
    <div className="flex justify-center my-4">
      <form onSubmit={handleSubmit(onSubmit)} className="lg:w-3xl md:w-2xl w-xl">
        <Card className=" h-full p-4 m-4">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold">
              Add Location
            </CardTitle>
            <p>Enter the details of the location you want to add.</p>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <Label htmlFor="label">Label</Label>
            <Input
              id="type"
              {...register("type")}
              placeholder="Eg. Home, college, work, school etc"
            />
            {errors.type && <p>{errors.type.message}</p>}
            <Button
              variant="outline"
              onClick={() => setUseCurrentLocation(!useCurrentLocation)}
              disabled={loading}
              className="w-full"
            >
              {useCurrentLocation
                ? "Switch to Manual Entry"
                : "Use Current Location"}
            </Button>
            {loading && (
              <p>
                <Loader2 />
                Loading your current location...
              </p>
            )}

            {!useCurrentLocation && (
              <>
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  {...register("street")}
                  placeholder="Enter street"
                />
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="Enter city"
                />
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  {...register("state")}
                  placeholder="Enter state"
                />
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register("country")}
                  placeholder="Enter country"
                />
                <Label htmlFor="zipCode">Postal Code</Label>
                <Input
                  id="zipCode"
                  {...register("zipCode")}
                  placeholder="Enter postal code"
                />
                {errors.street && <p>{errors.street.message}</p>}
              </>
            )}
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              {...register("latitude", { valueAsNumber: true })}
              readOnly
            />
            {errors.latitude && <p>{errors.latitude.message}</p>}
            <Button onClick={() => fetchCoordinatesFromAddress()}>Get coordinates</Button>

            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              {...register("longitude", { valueAsNumber: true })}
              readOnly
            />
            {errors.longitude && <p>{errors.longitude.message}</p>}
            {/* <Label htmlFor="radiusMeters">
              Radius (in meters) that can be considered in safe zone
            </Label>
            <Input
              id="radiusMeters"
              type="number"
              {...register("radiusMeters")}
              placeholder="Enter radius in meters"
            />
            {errors.radiusMeters && <p>{errors.radiusMeters.message}</p>} */}
            <Button type="submit">Add Location</Button>
          </CardContent>
          {map && (
          <LocationMap
            lat={getValues().latitude}
            lon={getValues().longitude}
            label={getValues().type}
          />
        )}
        </Card>

        {/* <Button
          type="button"
          onClick={() => handleNewLocation()}
          className="m-4"
        >
          Update Location
        </Button> */}
        
      </form>
    </div>
  );
}
