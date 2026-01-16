import { Button } from "@/components/ui/button";
import {
  Select,
  SelectValue,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectLabel,
  SelectContent,
} from "@/components/ui/select";

const App = () => {
  return (
    <div className="flex min-h-svh gap-4 items-center justify-center">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button>Click me</Button>
    </div>
  );
};

export default App;
