"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { contactSchema } from "../../helpers/schema";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
import { Contacts as ContactsApi } from "@/lib/api";
import * as z from "zod";

type ContactValues = z.infer<typeof contactSchema>;

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}
const Contacts = ({ nextStep, prevStep }: Props) => {
  // const [contacts, setContacts] = useState<ContactValues>([
  //     { id: 1, name: "", relationship: "", phone: "" },
  // ])

  // const [contacts, setContacts] = useState([
  //   { name: "", relationship: "", phone: "" },
  // ]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      emergencyContacts: [
        {
          name: "",
          phoneNumber: "",
          email: "",
          relationship: "",
        },
      ],
    },
  });

  const onSubmit = async (data: ContactValues) => {
    console.log(data);
    try {
      await ContactsApi.createBulk({
        emergencyContacts: data.emergencyContacts,
      });
      toast.success("Contacts added successfully!");
      nextStep();
    } catch (error) {
      console.error("Error submitting contacts:", error);
      toast.error("Failed to add contacts. Please try again.");
    }
    // api call
  };

  const { fields, append } = useFieldArray({
    control,
    name: "emergencyContacts",
  });

  // const addContact = () => {
  //   setContacts([
  //     ...contacts,
  //     {
  //       name: "",
  //       relationship: "",
  //       phone: "",
  //     },
  //   ]);
  // };
  // function handleInputChange(index: any, field: string, value: string): void {
  //   setContacts(
  //     contacts.map((contact, i) =>
  //       i === index ? { ...contact, [field]: value } : contact,
  //     ),
  //   );
  // }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <motion.div
        key="step2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-purple-600 ">
              <h1 className="text-xl">Emergency Contacts</h1>
              <h2 className="text-gray-500 mt-2">
                Add trusted friends or family members who will be notified in
                case of an emergency.
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <AnimatePresence>
              {fields.map((field, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>Contact {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          placeholder="Enter your full name"
                          className="mb-4 mt-2"
                          {...register(`emergencyContacts.${index}.name`)}
                        />
                        {errors.emergencyContacts?.[index]?.name && (
                          <p className="text-sm text-red-500">
                            {errors.emergencyContacts[index].name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Relationship</Label>
                        <Input
                          placeholder="Eg. Friend, Roommate, Father, Mother"
                          className="mb-4 mt-2"
                          {...register(
                            `emergencyContacts.${index}.relationship`
                          )}
                        />
                        {errors.emergencyContacts?.[index]?.relationship && (
                          <p className="text-sm text-red-500">
                            {
                              errors.emergencyContacts[index].relationship
                                .message
                            }
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          placeholder="Enter your email"
                          className="mb-4 mt-2"
                          {...register(`emergencyContacts.${index}.email`)}
                        />
                        {errors.emergencyContacts?.[index]?.email && (
                          <p className="text-sm text-red-500">
                            {errors.emergencyContacts[index].email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input
                          placeholder="Enter your phone number"
                          className="mb-4 mt-2"
                          {...register(
                            `emergencyContacts.${index}.phoneNumber`
                          )}
                        />
                        {errors.emergencyContacts?.[index]?.phoneNumber && (
                          <p className="text-sm text-red-500">
                            {
                              errors.emergencyContacts[index].phoneNumber
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            <Button
              type="button"
              className="text-purple-500 w-full mt-8 bg-white border-2"
              onClick={() =>
                append({
                  name: "",
                  relationship: "",
                  phoneNumber: "",
                  email: "",
                })
              }
            >
              <Plus /> Add Another Contact
            </Button>
            <div className="flex gap-4 justify-between items-center mt-8">
              <Button
                type="button"
                className="bg-purple-500 text-white"
                onClick={() => prevStep()}
              >
                <ArrowLeft />
                Back
              </Button>
              <Button
                type="submit"
                className="bg-purple-500 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Next: App Permission"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </form>
  );
};

export default Contacts;
