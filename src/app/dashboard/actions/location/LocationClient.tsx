"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
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
      } as Parameters<typeof AddressApi.update>[0]);
      setEditAddressId(null);
      setEditedData({});
      handleGetLocations();
    } catch (e) {
      console.error("Error editing address:", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/actions")}
            className="gap-2"
        >
            <MoveLeft className="h-4 w-4" />
            Back
        </Button>
        <h1 className="text-2xl font-bold">Manage Locations</h1>
      </div>

      <AddressForm onAdded={handleGetLocations} />
      
      <div className="w-full mt-8">
        <Card className="p-6">
          <CardTitle className="mb-4">Saved Locations</CardTitle>
          <CardContent className="p-0 space-y-4">
            {addresses.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No saved locations yet.</p>
            )}
            {addresses.map((address: Address) => (
              <div key={address.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                {editAddressId === address.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Input
                        value={editedData.type || ""}
                        onChange={(e) =>
                            setEditedData({ ...editedData, type: e.target.value })
                        }
                        />
                    </div>
                    {/* Add other inputs similarly or refactor edit form to reuse AddressForm logic if complex */}
                    {/* For brevity, keeping simple inputs */}
                     <div className="space-y-2">
                        <Label htmlFor="street">Street</Label>
                        <Input
                        value={editedData.street || ""}
                        onChange={(e) =>
                            setEditedData({ ...editedData, street: e.target.value })
                        }
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                        value={editedData.city || ""}
                        onChange={(e) =>
                            setEditedData({ ...editedData, city: e.target.value })
                        }
                        />
                    </div>
                    
                    <div className="col-span-full flex gap-2 justify-end mt-2">
                         <Button
                            variant="ghost"
                            onClick={() => {
                                setEditAddressId(null);
                                setEditedData({});
                            }}
                            >
                            Cancel
                        </Button>
                        <Button
                        onClick={() => editAddress(address.id)}
                        >
                        Save Changes
                        </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold capitalize flex items-center gap-2">
                            {address.type}
                            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {address.latitude?.toFixed(4)}, {address.longitude?.toFixed(4)}
                            </span>
                        </h4>
                        <p className="text-muted-foreground mt-1">
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
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-primary"
                          onClick={() => {
                            setEditAddressId(address.id);
                            setEditedData({ ...address });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteAddress(address.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
