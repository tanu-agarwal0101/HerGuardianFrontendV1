import axiosInstance from "../axiosInstance";

export interface AddressPayload {
  type?: string;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  addressId?: string;
}

export async function list() {
  const { data } = await axiosInstance.get("/address/get-all-addresses");
  return data.addresses;
}

export async function create(payload: AddressPayload) {
  return axiosInstance.post("/address/create-address", payload);
}

export async function update(payload: AddressPayload & { addressId: string }) {
  return axiosInstance.patch("/address/update-address", payload);
}

export async function remove(addressId: string) {
  return axiosInstance.delete("/address/delete-address", {
    data: { addressId },
  });
}
