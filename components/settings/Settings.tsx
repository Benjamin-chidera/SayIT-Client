import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSettingsStore } from "@/store/settings.store";

interface SettingsScreenProps {
  onBack: () => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onDeleteAccount: () => void;
}

const Settings = ({
  currentLanguage,
  onLanguageChange,
  onDeleteAccount,
}: SettingsScreenProps) => {
  const { open, setOpen } = useSettingsStore();

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
              <div className="space-y-8">
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
                  <div className="relative">
                    <select
                      id="language-select"
                      value={currentLanguage}
                      onChange={(e) => onLanguageChange(e.target.value)}
                      className="w-full appearance-none bg-gray-800/80 border border-gray-700 rounded-lg py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Account Deletion */}
                <div className="border-t border-gray-700/50 pt-8">
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
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Settings;
