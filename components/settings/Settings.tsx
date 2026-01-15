import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSettingsStore } from "@/store/settings.store";
import { Gender } from "./gender";
import { DeleteAccount } from "./delete-account";
import { Button } from "../ui/button";
import { useSession } from "../session-provider";

const Settings = () => {
  const session = useSession();
  const {
    open,
    setOpen,
    updateUserSettings,
    loading,
    language,
    setLanguage,
    getUserSettings,
  } = useSettingsStore();

  const languages = [
    { code: "en-US", name: "English (United States)" },
    { code: "es-ES", name: "Español (España)" },
    { code: "fr-FR", name: "Français (France)" },
    { code: "de-DE", name: "Deutsch (Deutschland)" },
    { code: "ja-JP", name: "日本語 (日本)" },
    { code: "ko-KR", name: "한국어 (대한민국)" },
  ];

  // console.log(language);

  useEffect(() => {
    if (session?.user?.id) {
      getUserSettings(session.user.id);
    }
  }, [session?.user?.id, getUserSettings]);

  return (
    <main>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent className=" bg-transparent">
          <DialogHeader>
            <DialogTitle className=" text-white">Settings</DialogTitle>
            <DialogDescription>
              <section className="space-y-8">
                {/* Language Selection */}
                <div>
                  <label
                    htmlFor="language-select"
                    className="block text-lg font-medium text-gray-300 mb-2"
                  >
                    Speech Language
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Choose the language for speech recognition.
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    Note: this will be the output to the user{" "}
                  </p>

                  <div>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger
                        id="language-select"
                        className="w-full bg-gray-800/80 border border-gray-700 rounded-lg py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Language Selection */}

                {/* Gender Selection */}
                <div>
                  <Gender />
                </div>
                {/* Gender Selection */}

                {/* save */}
                <Button
                  onClick={() => updateUserSettings(session?.user?.id)}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
                {/* save */}

                {/* Account Deletion */}
                <div>
                  <DeleteAccount />
                </div>
              </section>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Settings;
