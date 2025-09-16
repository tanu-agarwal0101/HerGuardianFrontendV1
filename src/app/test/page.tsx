"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import { Trash2 } from "lucide-react";

const statuses = ["To Do", "In Progress", "Paused", "Done", "Phase 2"] as const;
type Status = (typeof statuses)[number];

const statusColors: Record<Status, string> = {
  Done: "bg-green-500",
  "In Progress": "bg-yellow-500",
  "To Do": "bg-gray-400",
  Paused: "bg-orange-400",
  "Phase 2": "bg-purple-500",
};

interface Feature {
  id: string;
  name: string;
  status: Status;
}

const initialFeatures: Feature[] = [
  { id: "1", name: "Fake Call Trigger", status: "Done" },
  { id: "2", name: "Emergency Contacts Management", status: "Done" },
  { id: "3", name: "Real-Time Chatbot", status: "In Progress" },
  { id: "4", name: "User Settings Page", status: "Done" },
  { id: "5", name: "Stealth Mode Activation", status: "Paused" },
  { id: "6", name: "Push Notifications", status: "In Progress" },
  { id: "7", name: "Location Access + Sharing", status: "To Do" },
  { id: "8", name: "Admin Dashboard", status: "To Do" },
  { id: "9", name: "MongoDB + Prisma Setup", status: "Done" },
  { id: "10", name: "Protected Routes", status: "To Do" },
  { id: "11", name: "Silent Session Refresh", status: "Paused" },
  { id: "12", name: "ChatbotController API", status: "Done" },
  { id: "13", name: "Heart Rate API Route", status: "To Do" },
  { id: "14", name: "Logs & Alert History", status: "To Do" },
  { id: "15", name: "Mobile Responsiveness", status: "Done" },
  { id: "16", name: "Dark/Light Mode", status: "Done" },
  { id: "17", name: "Error Handling UX", status: "To Do" },
  { id: "18", name: "Chatbot UI Styling", status: "To Do" },
  { id: "19", name: "Timer-based Stealth", status: "To Do" },
  { id: "20", name: "Silent SOS Trigger", status: "To Do" },
  { id: "21", name: "Smartwatch Integration", status: "Phase 2" },
  { id: "22", name: "Logs Viewer", status: "To Do" },
  { id: "23", name: "Location Timeline", status: "To Do" },
];

function SortableFeature({
  feature,
  onDelete,
}: {
  feature: Feature;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: feature.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex justify-between items-center border rounded-lg p-3 bg-white"
    >
      <span>{feature.name}</span>
      <div className="flex items-center gap-2">
        <Badge className={`${statusColors[feature.status]} text-white`}>
          {feature.status}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(feature.id)}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </li>
  );
}

function DroppableColumn({
  status,
  children,
}: {
  status: Status;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className="min-h-[100px]">
      {children}
    </div>
  );
}

export default function KanbanBoard() {
  const [features, setFeatures] = useState<Feature[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("kanban-features");
        return stored ? JSON.parse(stored) : initialFeatures;
      } catch {
        return initialFeatures;
      }
    }
    return initialFeatures;
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const updateStatus = (id: string, newStatus: Status) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
  };

  const handleDeleteFeature = (id: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
  };

  //   const handleDragEnd = (event: DragEndEvent) => {
  //     const { active, over } = event;
  //     if (!over || active.id === over.id) return;
  //     const activeFeature = features.find(f => f.id === active.id);
  //     const overFeature = features.find(f => f.id === over.id);
  //     if (activeFeature && overFeature && activeFeature.status === overFeature.status) {
  //       const filtered = features.filter(f => f.status === activeFeature.status);
  //       const oldIndex = filtered.findIndex(f => f.id === active.id);
  //       const newIndex = filtered.findIndex(f => f.id === over.id);
  //       const reordered = arrayMove(filtered, oldIndex, newIndex);
  //       const others = features.filter(f => f.status !== activeFeature.status);
  //       setFeatures([...others, ...reordered]);
  //     }
  //   };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeFeature = features.find((f) => f.id === active.id);
    const overFeature = features.find((f) => f.id === over.id);
    //   const overStatus = statuses.find(status =>
    //     features.filter(f => f.status === status).some(f => f.id === over.id)
    //   );

    const overStatus = statuses.includes(over.id as Status)
      ? (over.id as Status)
      : statuses.find((status) =>
          features
            .filter((f) => f.status === status)
            .some((f) => f.id === over.id)
        );

    if (!activeFeature || !overStatus) return;

    setFeatures((prev) =>
      prev.map((f) => (f.id === active.id ? { ...f, status: overStatus } : f))
    );
  };

  const handleAddFeature = () => {
    const name = prompt("Enter the name of the new feature:");
    if (!name) return;
    setFeatures((prev) => [...prev, { id: uuidv4(), name, status: "To Do" }]);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("kanban-features", JSON.stringify(features));
      } catch {}
    }
  }, [features]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6 flex flex-wrap justify-center items-center gap-6">
        {statuses.map((status) => (
          <Card key={status} className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
                {status}
                <Badge className={`${statusColors[status]} text-white`}>
                  {features.filter((f) => f.status === status).length}
                </Badge>
              </h2>
              <ScrollArea className="h-[400px] pr-2">
                <DroppableColumn status={status}>
                  <SortableContext
                    items={features
                      .filter((f) => f.status === status)
                      .map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className="space-y-3">
                      {features
                        .filter((f) => f.status === status)
                        .map((feature) => (
                          <SortableFeature
                            key={feature.id}
                            feature={feature}
                            onDelete={handleDeleteFeature}
                          />
                        ))}
                    </ul>
                  </SortableContext>
                </DroppableColumn>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
        <div className="flex justify-end px-6">
          <Button className="mb-4" onClick={handleAddFeature}>
            + Add Feature
          </Button>
        </div>
      </div>
    </DndContext>
  );
}
