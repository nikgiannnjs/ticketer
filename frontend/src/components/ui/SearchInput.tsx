import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "./Input";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";

type SearchInputProps = {
  onClear?: () => void;
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
  placeholder?: string;
};

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, onChange, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState(value || "");

    const debouncedSearch = React.useCallback(
      debounce((query: string) => {
        onChange?.(query);
      }, 300),
      [],
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setLocalValue(value);
      }
    }, [value]);

    const handleClear = () => {
      setLocalValue("");
      onChange?.("");
      onClear?.();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      debouncedSearch(newValue);
    };

    return (
      <div className={cn("relative flex-1", className)}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          className="w-full pl-9 pr-8"
          value={localValue}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
