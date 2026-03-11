"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Address as AddressApi } from "@/lib/api";
import { Edit, Trash, MapPin, Navigation } from "lucide-react";
import AddressForm from "@/components/common/addressForm";
import { Address } from "@/helpers/type";
import { toast } from "sonner";

export default function LocationClient() {
  const [editedData, setEditedData] = useState<Partial<Address>>({});
  const [editAddressId, setEditAddressId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

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
      toast.success("Location deleted successfully");
      handleGetLocations();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete location");
    }
  };

  const editAddress = async (addressId: string) => {
    setLoading(true);
    const coords = await fetchCoordinatesFromAddress();
    try {
      await AddressApi.update({
        addressId,
        ...editedData,
        ...(coords || {}),
      } as Parameters<typeof AddressApi.update>[0]);
      setEditAddressId(null);
      setEditedData({});
      toast.success("Location updated successfully");
      handleGetLocations();
    } catch (e) {
      console.error("Error editing address:", e);
      toast.error("Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative p-4 lg:p-8 min-h-[85vh]">
      
      {/* Background Glows for Glassmorphism Context */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -z-10" />

      {/* The global TopBar provides the Back button navigation */}

      <Card className="w-full bg-card/60 backdrop-blur-2xl border-white/10 dark:border-white/5 shadow-2xl overflow-hidden relative group">
        
        {/* Animated top border line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-50 transition-opacity duration-1000" />
        
        <CardHeader className="text-center pt-8 pb-4 space-y-4">
            <div className="flex justify-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center transform -rotate-3 transition-transform hover:rotate-3 duration-500">
                    <MapPin className="w-7 h-7 text-primary transition-transform hover:scale-110 duration-500" />
                </div>
            </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Manage Locations
          </CardTitle>
          <p className="text-muted-foreground text-sm font-medium px-4">
            Add trusted safe spaces to securely share your coordinates with emergency contacts.
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-8 md:px-10 space-y-10">
            {/* Add Address Form Section */}
            <div className="bg-background/40 backdrop-blur-sm rounded-3xl p-6 border border-white/5 shadow-inner">
                <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-primary" />
                    Add New Address
                </h3>
                <AddressForm onAdded={() => {
                    handleGetLocations();
                    toast.success("New location added successfully");
                }} />
            </div>
            
            {/* Saved Locations List */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center justify-between border-b border-border/50 pb-2">
                    Saved Locations
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {addresses.length}
                    </span>
                </h3>

                {addresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-card/30 rounded-3xl border border-dashed border-border">
                        <MapPin className="h-10 w-10 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground font-medium">No saved locations yet.</p>
                        <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs">Add your home, work, or other frequent spots above to quick-share them.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address: Address) => (
                        <div 
                            key={address.id} 
                            className="group relative bg-card border border-border/40 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
                        >
                            {editAddressId === address.id ? (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-primary">Edit Location</h4>
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="type" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type (e.g. Home)</Label>
                                        <Input
                                            value={editedData.type || ""}
                                            onChange={(e) => setEditedData({ ...editedData, type: e.target.value })}
                                            className="bg-background/50"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="street" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Street Adddress</Label>
                                        <Input
                                            value={editedData.street || ""}
                                            onChange={(e) => setEditedData({ ...editedData, street: e.target.value })}
                                            className="bg-background/50"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="city" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">City</Label>
                                        <Input
                                            value={editedData.city || ""}
                                            onChange={(e) => setEditedData({ ...editedData, city: e.target.value })}
                                            className="bg-background/50"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 justify-end pt-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setEditAddressId(null);
                                            setEditedData({});
                                        }}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => editAddress(address.id)}
                                        disabled={loading}
                                        className="shadow-md shadow-primary/20 hover:shadow-primary/40"
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </div>
                            ) : (
                            <div className="flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <h4 className="text-lg font-bold capitalize text-foreground">
                                                {address.type}
                                            </h4>
                                            {address.latitude && address.longitude && (
                                                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap hidden sm:inline-block">
                                                    GPS Logged
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {[address.street, address.city, address.state, address.country, address.zipCode]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
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
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            onClick={() => deleteAddress(address.id)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                {address.latitude && address.longitude && (
                                    <div className="mt-4 pt-3 border-t border-border/40 text-[11px] font-medium text-muted-foreground/70 flex items-center justify-between">
                                        <span>Lat: {address.latitude.toFixed(4)}</span>
                                        <span>Lng: {address.longitude.toFixed(4)}</span>
                                    </div>
                                )}
                            </div>
                            )}
                        </div>
                        ))}
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
