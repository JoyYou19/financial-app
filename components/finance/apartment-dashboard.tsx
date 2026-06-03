"use client";

import { useState } from "react";
import {
  createApartmentItem,
  deleteApartmentItem,
  updateApartmentItem,
} from "@/app/actions";
import { apartmentItems } from "@/db/schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ApartmentItem = typeof apartmentItems.$inferSelect;

function formatMoney(cents: number | null) {
  if (cents === null) return "—";
  return `€${(cents / 100).toFixed(2)}`;
}

function toMoneyInput(cents: number | null) {
  if (cents === null) return "";
  return (cents / 100).toFixed(2);
}

const statusLabels = {
  planned: "Planned",
  ordered: "Ordered",
  delivered: "Delivered",
  installed: "Installed",
} as const;

export function ApartmentDashboard({
  apartmentItems,
}: {
  apartmentItems: ApartmentItem[];
}) {
  const estimatedTotal = apartmentItems.reduce(
    (sum, item) => sum + item.estimatedCostCents,
    0,
  );

  const actualTotal = apartmentItems.reduce(
    (sum, item) => sum + (item.actualCostCents ?? 0),
    0,
  );

  const completedCount = apartmentItems.filter(
    (item) => item.status === "installed",
  ).length;

  const completion =
    apartmentItems.length === 0
      ? 0
      : Math.round((completedCount / apartmentItems.length) * 100);

  const byRoom = apartmentItems.reduce<Record<string, ApartmentItem[]>>(
    (acc, item) => {
      acc[item.room] ??= [];
      acc[item.room].push(item);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddApartmentItemDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-500">
              Actual spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {formatMoney(actualTotal)}
            </p>
            <p className="mt-1 text-sm text-zinc-500">Apartment setup spend</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-500">
              Estimated total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-zinc-950">
              {formatMoney(estimatedTotal)}
            </p>
            <p className="mt-1 text-sm text-zinc-500">Planned setup budget</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-500">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-700">
              {formatMoney(Math.max(0, estimatedTotal - actualTotal))}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Estimated left to spend
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardHeader>
            <CardTitle className="text-sm text-emerald-700">
              Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-700">{completion}%</p>
            <p className="mt-1 text-sm text-emerald-700/80">
              {completedCount}/{apartmentItems.length} installed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200 bg-white">
        <CardHeader>
          <CardTitle>Apartment progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={completion} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {apartmentItems.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-sm text-zinc-500">
              No apartment items yet.
            </CardContent>
          </Card>
        ) : (
          Object.entries(byRoom).map(([room, items]) => (
            <Card key={room} className="border-zinc-200 bg-white">
              <CardHeader>
                <CardTitle>{room}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.name}</p>
                        <Badge variant="secondary">
                          {statusLabels[item.status]}
                        </Badge>
                      </div>

                      <p className="text-sm text-zinc-500">
                        Estimated {formatMoney(item.estimatedCostCents)} ·
                        Actual {formatMoney(item.actualCostCents)}
                      </p>

                      {item.note ? (
                        <p className="text-sm text-zinc-500">{item.note}</p>
                      ) : null}
                    </div>

                    <EditApartmentItemDialog item={item} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function AddApartmentItemDialog() {
  const [open, setOpen] = useState(false);

  async function action(formData: FormData) {
    await createApartmentItem(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add apartment item</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add apartment item</DialogTitle>
        </DialogHeader>

        <ApartmentItemForm action={action} submitLabel="Save item" />
      </DialogContent>
    </Dialog>
  );
}

function EditApartmentItemDialog({ item }: { item: ApartmentItem }) {
  const [open, setOpen] = useState(false);

  async function updateAction(formData: FormData) {
    await updateApartmentItem(formData);
    setOpen(false);
  }

  async function deleteAction(formData: FormData) {
    await deleteApartmentItem(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit apartment item</DialogTitle>
        </DialogHeader>

        <ApartmentItemForm
          action={updateAction}
          item={item}
          submitLabel="Save changes"
        />

        <form action={deleteAction}>
          <input type="hidden" name="id" value={item.id} />
          <Button type="submit" variant="destructive" className="w-full">
            Delete item
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ApartmentItemForm({
  action,
  item,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  item?: ApartmentItem;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-4">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="grid gap-2">
        <Label>Name</Label>
        <Input
          name="name"
          defaultValue={item?.name}
          placeholder="Mattress"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Room</Label>
        <Input
          name="room"
          defaultValue={item?.room}
          placeholder="Bedroom"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Estimated cost</Label>
        <Input
          name="estimatedCost"
          type="number"
          step="0.01"
          defaultValue={toMoneyInput(item?.estimatedCostCents ?? null)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Actual cost</Label>
        <Input
          name="actualCost"
          type="number"
          step="0.01"
          defaultValue={toMoneyInput(item?.actualCostCents ?? null)}
        />
      </div>

      <div className="grid gap-2">
        <Label>Status</Label>
        <Select name="status" defaultValue={item?.status ?? "planned"}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="ordered">Ordered</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="installed">Installed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Note</Label>
        <Textarea name="note" defaultValue={item?.note ?? ""} />
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
