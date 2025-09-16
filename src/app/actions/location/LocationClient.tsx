"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
// import axiosInstance from "@/lib/axiosInstance";
import { Address as AddressApi } from "@/lib/api";
import { Edit, MoveLeft, Trash } from "lucide-react";
import AddressForm from "@/components/common/addressForm";
import { Address } from "@/helpers/type";
import { useRouter } from "next/navigation";

export default function LocationClient() {
  const router = useRouter();
  const [editedData, setEditedData] = useState<Partial<Address>>({});
  const [editAddressId, setEditAddressId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const handleGetLocations = async () => {
    try {
      const list = await AddressApi.list();
      setAddresses(list || []);
    } catch (e) {
      console.error("Error fetching locations:", e);
    }
  };
  useEffect(() => {
    handleGetLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCoordinatesFromAddress = async () => {
    const { street, city, state, country, zipCode } = editedData;
    if (street && city && state && country && zipCode) {
      try {
        const fullAddress = `${street.toLowerCase()}, ${city.toLowerCase()}, ${state.toLowerCase()}, ${country.toLowerCase()}, ${zipCode}`;
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.append("q", fullAddress);
        url.searchParams.append("format", "json");
        url.searchParams.append("limit", "1");
        const response = await fetch(url.toString());
        const data = await response.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    }
    return null;
  };

  const deleteAddress = async (addressId: string) => {
    try {
      await AddressApi.remove(addressId);
      handleGetLocations();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const editAddress = async (addressId: string) => {
    const coords = await fetchCoordinatesFromAddress();
    try {
      await AddressApi.update({
        addressId,
        ...editedData,
        ...(coords || {}),
      } as any);
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
            {addresses.map((address: Address) => (
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
                            setEditedData({ ...address });
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
