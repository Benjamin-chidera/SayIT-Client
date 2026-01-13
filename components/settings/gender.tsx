"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSession } from "../session-provider";
import { useSettingsStore } from "@/store/settings.store";
import { useEffect } from "react";

export const Gender = () => {
  const session = useSession();
  const { getUserSettings, gender, setGender } = useSettingsStore();

  useEffect(() => {
    if (session?.user?.id) {
      getUserSettings(session.user.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  return (
    <div>
      <h3 className=" text-lg font-medium text-gray-300">Gender: </h3>
      <p>Note, the gender you select will affect the voice output.</p>
      <RadioGroup
        defaultValue="male"
        className="mt-2"
        value={gender}
        onValueChange={(value) => {
          setGender(value);
        }}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="male" id="male" />
          <Label htmlFor="male">Male</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="female" id="female" />
          <Label htmlFor="female">Female</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
