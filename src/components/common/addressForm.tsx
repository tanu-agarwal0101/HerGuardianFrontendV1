"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useCallback } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
// import axios from "axios";
import { Address as AddressApi } from "@/lib/api";
import { addressSchema } from "@/helpers/schema";
import dynamic from "next/dynamic";
const LocationMap = dynamic(() => import("./LocationMap"), { ssr: false });

type AddressValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onAdded?: (address: import("@/helpers/type").Address) => void;
}

export default function AddressForm({ onAdded }: AddressFormProps) {
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(false);
  const [coordsLoading, setCoordsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
  });

  const fetchCurrentLocation = useCallback(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", parseFloat(position.coords.latitude.toFixed(6)));
          setValue(
            "longitude",
            parseFloat(position.coords.longitude.toFixed(6))
          );
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
  }, [setValue]);

  const fetchCoordinatesFromAddress = async () => {
    const { street, city, state, country, zipCode } = getValues();
    if (!(street && city && state && country && zipCode)) return;
    setCoordsLoading(true);
    try {
      const fullAddress = `${street.toLowerCase()}, ${city.toLowerCase()}, ${state.toLowerCase()}, ${country.toLowerCase()}`;
      const url = new URL("https://locationiq.com/v1/search");
      url.searchParams.append(
        "key",
        process.env.NEXT_PUBLIC_LOCATION_IQ_ACCESS_TOKEN || ""
      );
      url.searchParams.append("q", fullAddress);
      url.searchParams.append("format", "json");
      const response = await fetch(url.toString());
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        toast.error(
          "Address not found. Try simplifying or double-check the details."
        );
      } else {
        const { lat, lon } = data[0];
        setValue("latitude", parseFloat(lat));
        setValue("longitude", parseFloat(lon));
        setMap(true);
        toast.success("Coordinates fetched.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      toast.error("Failed to fetch coordinates.");
    } finally {
      setCoordsLoading(false);
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
  }, [useCurrentLocation, fetchCurrentLocation]);

  const saveAddress = async (data: AddressValues) => {
    try {
      const res = await AddressApi.create({
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude,
        radiusMeters: data.radiusMeters || undefined,
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
      });
      const created = (res as { data?: { address?: import("@/helpers/type").Address } })?.data?.address;
      toast.success("Address added successfully!");
      if (created) {
        onAdded?.(created);
        window.dispatchEvent(
          new CustomEvent("address:added", { detail: created })
        );
      }
    } catch (error) {
      console.error("Error submitting location:", error);
      toast.error("Failed to add address. Please try again.");
    }
  };
  const onSubmit = async () => {
    const updated = getValues();
    if (!updated.latitude || !updated.longitude) {
      toast.error("Fetch coordinates first.");
      return;
    }
    await saveAddress(updated);
  };

  return (
    <div className="flex justify-center my-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:w-3xl md:w-2xl w-xl"
      >
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
            {errors.type && (
              <p className="text-red-600 text-sm">{errors.type.message}</p>
            )}
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
                {errors.street && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.street.message}
                  </p>
                )}
                {errors.latitude && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.latitude.message}
                  </p>
                )}
                {errors.longitude && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.longitude.message}
                  </p>
                )}
                <Button
                  type="button"
                  onClick={fetchCoordinatesFromAddress}
                  disabled={
                    coordsLoading ||
                    !getValues().street ||
                    !getValues().city ||
                    !getValues().state ||
                    !getValues().country ||
                    !getValues().zipCode
                  }
                  className="mt-2"
                >
                  {coordsLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Fetching...
                    </span>
                  ) : (
                    "Get Coordinates"
                  )}
                </Button>
              </>
            )}
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              {...register("latitude", { valueAsNumber: true })}
              readOnly
            />
            {errors.latitude && (
              <p className="text-red-600 text-sm mt-1">
                {errors.latitude.message}
              </p>
            )}
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              {...register("longitude", { valueAsNumber: true })}
              readOnly
            />
            {errors.longitude && (
              <p className="text-red-600 text-sm mt-1">
                {errors.longitude.message}
              </p>
            )}
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
