"use client";

import { useState } from "react";
import { createFuelLog } from "@/app/actions";
import { fuelLogs } from "@/db/schema";

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
import { Textarea } from "@/components/ui/textarea";

type FuelLog = typeof fuelLogs.$inferSelect;

function formatMoney(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

export function MobilityDashboard({ fuelLogs }: { fuelLogs: FuelLog[] }) {
  const totalFuelSpend = fuelLogs.reduce(
    (sum, log) => sum + log.amountCents,
    0,
  );
  const totalLiters = fuelLogs.reduce((sum, log) => sum + (log.liters ?? 0), 0);

  const logsWithOdometer = fuelLogs
    .filter((log) => log.odometerKm !== null)
    .sort((a, b) => (a.odometerKm ?? 0) - (b.odometerKm ?? 0));

  const firstOdometer = logsWithOdometer[0]?.odometerKm ?? null;
  const lastOdometer =
    logsWithOdometer[logsWithOdometer.length - 1]?.odometerKm ?? null;

  const kmDriven =
    firstOdometer !== null && lastOdometer !== null
      ? Math.max(0, lastOdometer - firstOdometer)
      : 0;

  const costPerKm = kmDriven > 0 ? totalFuelSpend / kmDriven : 0;

  const pessimisticFuelPriceCents = 190;
  const consumptionLitersPer100Km = 8.5;

  const estimatedKmFromFuel =
    totalLiters > 0
      ? Math.round((totalLiters / consumptionLitersPer100Km) * 100)
      : 0;

  const estimatedCostPer100Km =
    consumptionLitersPer100Km * pessimisticFuelPriceCents;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddFuelLogDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-500">Fuel spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {formatMoney(totalFuelSpend)}
            </p>
            <p className="mt-1 text-sm text-zinc-500">This tracked period</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-500">
              Kilometers driven
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-zinc-950">
              {kmDriven.toLocaleString("en-GB")} km
            </p>
            <p className="mt-1 text-sm text-zinc-500">Based on odometer logs</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-500">Cost per km</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-zinc-950">
              {costPerKm > 0 ? formatMoney(costPerKm) : "—"}
            </p>
            <p className="mt-1 text-sm text-zinc-500">Real tracked cost</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/60">
          <CardHeader>
            <CardTitle className="text-sm text-amber-700">
              Pessimistic estimate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-700">
              {formatMoney(estimatedCostPer100Km)}
            </p>
            <p className="mt-1 text-sm text-amber-700/80">
              per 100 km at €1.90/L and 8.5L/100km
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200 bg-white">
        <CardHeader>
          <CardTitle>Driving capacity</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between">
              <p className="text-sm text-zinc-500">Estimated range bought</p>
              <p className="font-semibold">
                {estimatedKmFromFuel.toLocaleString("en-GB")} km
              </p>
            </div>
            <Progress value={Math.min(100, estimatedKmFromFuel / 10)} />
          </div>

          <div className="space-y-3">
            {fuelLogs.length === 0 ? (
              <p className="text-sm text-zinc-500">No fuel logs yet.</p>
            ) : (
              fuelLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {formatMoney(log.amountCents)}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {log.liters ? `${log.liters}L · ` : ""}
                      {log.pricePerLiterCents
                        ? `€${(log.pricePerLiterCents / 100).toFixed(2)}/L`
                        : "Fuel transaction"}
                      {log.odometerKm ? ` · ${log.odometerKm} km` : ""}
                    </p>
                  </div>

                  <p className="text-sm text-zinc-500">
                    {log.createdAt.toLocaleDateString("en-GB")}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AddFuelLogDialog() {
  const [open, setOpen] = useState(false);

  async function action(formData: FormData) {
    await createFuelLog(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add fuel log</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add fuel log</DialogTitle>
        </DialogHeader>

        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Amount paid</Label>
            <Input
              name="amount"
              type="number"
              step="0.01"
              placeholder="75.00"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Liters</Label>
            <Input
              name="liters"
              type="number"
              step="0.01"
              placeholder="42.5"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Odometer km</Label>
            <Input name="odometerKm" type="number" placeholder="184250" />
          </div>

          <div className="grid gap-2">
            <Label>Note</Label>
            <Textarea name="note" placeholder="Optional" />
          </div>

          <Button type="submit">Save fuel log</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
