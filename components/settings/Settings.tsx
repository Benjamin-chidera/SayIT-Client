import React from "react";
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

const Settings = () => {
  const { open, setOpen, 
    // currentLanguage, 
    // onLanguageChange, 
    // onDeleteAccount
   } =
    useSettingsStore();

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      //   onDeleteAccount();
    }
  };

  const languages = [
    { code: "en-US", name: "English (United States)" },
    { code: "es-ES", name: "Español (España)" },
    { code: "fr-FR", name: "Français (France)" },
    { code: "de-DE", name: "Deutsch (Deutschland)" },
    { code: "ja-JP", name: "日本語 (日本)" },
    { code: "ko-KR", name: "한국어 (대한민국)" },
  ];

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

                  <div>
                    <Select>
                      <SelectTrigger className="w-full bg-gray-800/80 border border-gray-700 rounded-lg py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select Language Output" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem
                            key={lang.code}
                            value={lang.code}
                            // onClick={() => onLanguageChange(lang.code)}
                          >
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                </div>

                {/* Account Deletion */}
                <div className="border-t border-gray-700/50 pt-5">
                  <h2 className="text-lg font-medium text-red-400">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDelete}
                    className="w-full px-6 py-3 bg-red-600/20 border border-red-500/50 rounded-lg font-medium text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-red-500/50"
                  >
                    Delete Account
                  </button>
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
