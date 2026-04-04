import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookA, PenIcon } from "lucide-react";

function PermissionSelect({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (val: string) => void;
}) {
  return (
    <Select onValueChange={onChange} value={value ?? ""}>
      <SelectTrigger className="w-full bg-white/4 border border-white/12 text-text/70 font-sans text-[12px]">
        <SelectValue placeholder="Permission" />
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={4}
        defaultValue={"read"}
        className="bg-background"
      >
        <SelectItem value="read" className="font-sans text-[12px]">
          <BookA className="mr-2" color="#c9a227" /> Read
        </SelectItem>
        <SelectItem value="write" className="font-sans text-[12px]">
          <PenIcon className="mr-2" color="#c9a227" /> Write
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export default PermissionSelect;
