
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface LottoTypeFormProps {
  onSubmit: (e: FormEvent) => Promise<void>;
  typeName: string;
  setTypeName: (value: string) => void;
  typeDescription: string;
  setTypeDescription: (value: string) => void;
  hasMultipleSets: boolean;
  setHasMultipleSets: (value: boolean) => void;
  mainNumbersCount: string;
  setMainNumbersCount: (value: string) => void;
  mainNumbersMin: string;
  setMainNumbersMin: (value: string) => void;
  mainNumbersMax: string;
  setMainNumbersMax: (value: string) => void;
  extraNumbersCount: string;
  setExtraNumbersCount: (value: string) => void;
  extraNumbersMin: string;
  setExtraNumbersMin: (value: string) => void;
  extraNumbersMax: string;
  setExtraNumbersMax: (value: string) => void;
}

export function LottoTypeForm({
  onSubmit,
  typeName,
  setTypeName,
  typeDescription,
  setTypeDescription,
  hasMultipleSets,
  setHasMultipleSets,
  mainNumbersCount,
  setMainNumbersCount,
  mainNumbersMin,
  setMainNumbersMin,
  mainNumbersMax,
  setMainNumbersMax,
  extraNumbersCount,
  setExtraNumbersCount,
  extraNumbersMin,
  setExtraNumbersMin,
  extraNumbersMax,
  setExtraNumbersMax,
}: LottoTypeFormProps) {
  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Add New Lottery Type</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Type Name
            </Label>
            <Input
              id="name"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={typeDescription}
              onChange={(e) => setTypeDescription(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="multiple-sets" className="text-right">
              Multiple Number Sets
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="multiple-sets"
                checked={hasMultipleSets}
                onCheckedChange={setHasMultipleSets}
              />
              <Label htmlFor="multiple-sets" className="cursor-pointer">
                {hasMultipleSets ? "Yes (e.g. EuroMillions)" : "No (e.g. 5/90)"}
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-2">
            <h3 className="font-medium text-sm">Main Numbers Configuration</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="main-count">Count</Label>
                <Input
                  id="main-count"
                  type="number"
                  value={mainNumbersCount}
                  onChange={(e) => setMainNumbersCount(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="main-min">Min Number</Label>
                <Input
                  id="main-min"
                  type="number"
                  value={mainNumbersMin}
                  onChange={(e) => setMainNumbersMin(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="main-max">Max Number</Label>
                <Input
                  id="main-max"
                  type="number"
                  value={mainNumbersMax}
                  onChange={(e) => setMainNumbersMax(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {hasMultipleSets && (
            <div className="grid grid-cols-1 gap-4 mt-2">
              <h3 className="font-medium text-sm">Extra Numbers Configuration</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="extra-count">Count</Label>
                  <Input
                    id="extra-count"
                    type="number"
                    value={extraNumbersCount}
                    onChange={(e) => setExtraNumbersCount(e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="extra-min">Min Number</Label>
                  <Input
                    id="extra-min"
                    type="number"
                    value={extraNumbersMin}
                    onChange={(e) => setExtraNumbersMin(e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="extra-max">Max Number</Label>
                  <Input
                    id="extra-max"
                    type="number"
                    value={extraNumbersMax}
                    onChange={(e) => setExtraNumbersMax(e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="submit">Add Type</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
