import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/button";
import { FolderPlus, Trash } from "lucide-react";
import Image from "next/image";

//define the props the imageupload will receive
interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);

  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap item-center gap-4">
        {/* show image before submit */}
        {value.map((url) => (
          // eslint-disable-next-line react/jsx-key
          <div className="relative w-[200px] h-[200px]">
            <div className="absolute top-0 right-0 z-10">
              <Button onClick={() => onRemove(url)} size="sm" className="bg-red-1 text-white">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          <Image
            src={url}
            alt="collection"
            className="object-cover rounded-lg"
            fill
          />
          </div>
        ))}
      </div>

      <CldUploadWidget uploadPreset="ysafiwhy" onSuccess={onUpload}>
        {({ open }) => {
          return (
            <Button
              type="button"
              onClick={() => open()}
              className="bg-grey-1 text-white"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;

