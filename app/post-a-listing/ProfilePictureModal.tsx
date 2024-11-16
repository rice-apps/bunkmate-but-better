import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FiUpload } from "react-icons/fi";

// Profile Picture Modal

export default function ProfilePictureModal({ children }: { children: React.ReactNode }) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-md bg-white p-6 rounded-lg shadow-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold">Profile Picture</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Upload your profile picture. Please make sure your face is recognizable!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 border border-gray-300 rounded-full text-gray-500 hover:bg-gray-200">
              <FiUpload className="text-4xl mb-2" />
              <span className="text-sm font-medium">Upload File</span>
            </div>
          </div>
          <DialogFooter className="flex justify-center gap-4">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100">
              Change
            </button>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
              Done
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }