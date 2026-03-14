import axiosInstance from "../axiosInstance";

export interface ContactPayload {
  name: string;
  phoneNumber: string;
  relation?: string;
  email?: string;
}

export async function getAll() {
  const { data } = await axiosInstance.get("/contacts/get-all-contacts");
  return data.contacts;
}

export async function createBulk(payload: {
  emergencyContacts: ContactPayload[];
}) {
  return axiosInstance.post("/contacts/create-contacts", payload);
}

export async function addSingle(payload: ContactPayload) {
  return axiosInstance.post("/contacts/add-single-contact", payload);
}

export async function update(
  payload: { addressId?: string; contactId: string } & Partial<ContactPayload>
) {
  return axiosInstance.patch("/contacts/update-emergency-contact", payload);
}

export async function remove(contactId: string) {
  return axiosInstance.delete("/contacts/delete-contact", {
    data: { contactId },
  });
}
