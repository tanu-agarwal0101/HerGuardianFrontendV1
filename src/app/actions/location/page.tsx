"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import * as z from "zod";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowBigLeft,
  Delete,
  DeleteIcon,
  Edit,
  Loader2,
  MoveLeft,
  Trash,
} from "lucide-react";
import axios from "axios";
import LocationMap from "@/components/common/LocationMap";
import { addressSchema } from "@/helpers/schema";
import AddressForm from "@/components/common/addressForm";
import { Address } from "@/helpers/type";
import { useRouter } from "next/navigation";

type AddressValues = z.infer<typeof addressSchema>;

export default function LocPage() {
  const router = useRouter();
  const [editedData, setEditedData] = useState<Partial<Address>>({});
  const [editAddressId, setEditAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // if(useCurrentLocation){
  //     fetchCurrentLocation()
  //     form.setValue("latitude", parseFloat(location.latitude))
  //     form.setValue("longitude", parseFloat(location.longitude))
  // }

  //   const fetchCoordinatesFromAddress = async () => {
  //     const { street, city, state, country, zipCode } = form.getValues();
  //     console.log("Fetching coordinates with the following address:", {
  //       street,
  //       city,
  //       state,
  //       country,
  //       zipCode,
  //     });

  //     if (street && city && state && country && zipCode) {
  //       try {
  //         setLoading(true);
  //         const url = `https://nominatim.openstreetmap.org/search?street=${street}&city=${city}&state=${state}&country=${country}&format=json&addressDetails=1&limit=1`;
  //         console.log("Request URL:", url);
  //         const response = await axios.get(
  //           `https://nominatim.openstreetmap.org/search`,
  //           {
  //             params: {
  //               city,
  //               country,
  //               format: "json",
  //               addressDetails: 1,
  //               limit: 1,
  //             },
  //             //         const fullAddress = `${form.getValues("street")}, ${form.getValues("zipCode")}, ${form.getValues("city")}, ${form.getValues("state")}, ${form.getValues("country")}`;

  //             // const response = await axios.get(
  //             //   "https://nominatim.openstreetmap.org/search",
  //             //   {
  //             //     params: {
  //             //       q: fullAddress,
  //             //       format: "json",
  //             //       addressDetails: 1,
  //             //       limit: 1,
  //             //     },
  //           },
  //         );
  //         console.log(response.data);
  //         if (response.data.length === 0) {
  //           alert(
  //             "Could not find the address. Try removing street info or double-checking it.",
  //           );
  //         } else if (response.data.length > 0) {
  //           console.log("data", response.data);
  //           const { lat, lon } = response.data[0];
  //           form.setValue("latitude", parseFloat(lat));
  //           form.setValue("longitude", parseFloat(lon));
  //         } else {
  //           console.error("No results found for the given address");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching coordinates:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     } else {
  //       alert("Please fill in all address fields before fetching coordinates.");
  //     }
  //   };

  const [addresses, setAddresses] = useState([]);

  const [coords, setCoords] = useState({ lat: 0, lon: 0 });

  // const handleNewLocation = () => {
  //   setCoords({
  //     lat: getValues().latitude,
  //     lon: getValues().longitude,
  //   });
  //   setMap(true);
  // };

  const handleGetLocations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/address/get-all-addresses",
        {
          withCredentials: true,
        }
      );
      console.log("Response from get-all-addresses:", res.data);
      setAddresses(res.data.addresses);
      console.log("Locations fetched:", addresses);
    } catch (e) {
      console.error("Error fetching locations:", e);
    }
  };
  useEffect(() => {
    handleGetLocations();
  }, []);

  const fetchCoordinatesFromAddress = async () => {
    const { street, city, state, country, zipCode } = editedData;

    if (street && city && state && country && zipCode) {
      try {
        const fullAddress = `${street.toLowerCase()}, ${city.toLowerCase()}, ${state.toLowerCase()}, ${country.toLowerCase()}, ${zipCode}`;
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: fullAddress,
              format: "json",
              limit: 1,
            },
          }
        );
        console.log("Response from geocoding API:", response.data);
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        } else {
          alert("Could not find coordinates for the given address.");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    }
    return null;
  };

  const deleteAddress = async (addressId: string) => {
    try {
      const res = await axios.delete(
        `http://localhost:5001/address/delete-address`,
        {
          data: {
            addressId: addressId,
          },
          withCredentials: true,
        }
      );
      console.log("Response from delete-address:", res.data);
      handleGetLocations();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const editAddress = async (addressId: string) => {
    const coords = await fetchCoordinatesFromAddress();
    try {
      const res = await axios.patch(
        "http://localhost:5001/address/update-address",
        {
          addressId: addressId,
          ...editedData,
          ...(coords || {}),
        },
        {
          withCredentials: true,
        }
      );
      console.log("Response from edit-address:", res.data);
      setEditAddressId(null);
      setEditedData({});
      handleGetLocations();
    } catch (e) {
      console.error("Error editing address:", e);
    }
  };

  return (
    <div className=" ">
      <Button
        className="bg-purple-500 hover:bg-purple-700"
        onClick={() => router.push("/actions")}
      >
        <MoveLeft />
        Back
      </Button>
      <AddressForm />
      <div className="w-full flex justify-center items-center">
        <Card className="m-4 p-4 my-10 lg:w-3xl md:w-2xl w-xl">
          <CardTitle>Saved Locations</CardTitle>
          <CardContent>
            {addresses.map((address: Address, idx) => (
              <div key={address.id} className="my-2 border-4 rounded-lg p-2 ">
                {editAddressId === address.id ? (
                  <div className="flex flex-wrap gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Input
                      className="border p-2 rounded "
                      value={editedData.type || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, type: e.target.value })
                      }
                    />
                    <Label htmlFor="street">Street</Label>
                    <Input
                      className="border p-2 rounded"
                      value={editedData.street || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, street: e.target.value })
                      }
                    />
                    <Label htmlFor="city">City</Label>
                    <Input
                      className="border p-2 rounded"
                      value={editedData.city || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, city: e.target.value })
                      }
                    />
                    <Label htmlFor="state">State</Label>
                    <Input
                      className="border p-2 rounded"
                      value={editedData.state || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, state: e.target.value })
                      }
                    />
                    <Label htmlFor="country">Country</Label>
                    <Input
                      className="border p-2 rounded"
                      value={editedData.country || ""}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          country: e.target.value,
                        })
                      }
                    />
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      className="border p-2 rounded"
                      value={editedData.zipCode || ""}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          zipCode: e.target.value,
                        })
                      }
                    />
                    <Button
                      onClick={() => editAddress(address.id)}
                      className="bg-green-500 text-white my-2 px-4 py-2 rounded"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">{address.type}</h4>
                      <div className="flex gap-2">
                        <Button
                          className="bg-yellow-400 hover:bg-yellow-600"
                          onClick={() => {
                            setEditAddressId(address.id);
                            setEditedData({ ...address }); // this line is essential
                          }}
                        >
                          <Edit />
                        </Button>
                        <Button
                          onClick={() => deleteAddress(address.id)}
                          className="bg-red-600 hover:bg-red-800 "
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                    <p>
                      {[
                        address.street,
                        address.city,
                        address.state,
                        address.country,
                        address.zipCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>

                    <p className="text-sm text-gray-500">
                      Coordinates: {address.latitude}, {address.longitude}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
