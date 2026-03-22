import { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import useUser from "@/features/user/useUser";
import { ThreeDot } from "react-loading-indicators";

interface User {
  _id: string;
  email: string;
}

interface UserSearchComboboxProps {
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  excludeIds?: (string | undefined)[];
}

export function UserSearchCombobox({
  value,
  onChange,
  placeholder = "Search by email...",
  excludeIds = [],
}: UserSearchComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { searchUsersByEmailQuery } = useUser(debouncedQuery);
  const { data: users = [], isLoading } = searchUsersByEmailQuery;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => !excludeIds?.includes(user._id));
  }, [users, excludeIds]);

  useEffect(() => {
    if (users.length > 0) setOpen(true);
  }, [users]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (user: User) => {
    onChange(user._id);
    setDisplayEmail(user.email);
    setQuery(user.email);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (value && e.target.value !== displayEmail) onChange("");
        }}
        placeholder={placeholder}
        className="bg-white/4 border-white/12 text-text/80 font-sans text-[12px]"
      />

      {!isLoading && (
        <div className="absolute top-full mt-1 px-2 py-1 bg-background rounded-md">
          <div className="flex items-center gap-2">
            <p className="text-primary font-semibold text-sm">Loading</p>
            <ThreeDot size="small" color="#C9A227" />
          </div>
        </div>
      )}

      {open && filteredUsers.length > 0 && (
        <ul className="absolute z-9999 top-full mt-1 w-full rounded-md border border-white/12 bg-[#1a1a1a] shadow-lg overflow-hidden">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              onMouseDown={() => handleSelect(user)} // mousedown fires before blur
              className="px-3 py-2 text-[12px] text-text/70 hover:bg-white/8 cursor-pointer font-sans"
            >
              {user.email}
            </li>
          ))}
        </ul>
      )}

      {open && !isLoading && query && filteredUsers.length === 0 && (
        <ul className="absolute z-9999 top-full mt-1 w-full rounded-md border border-white/12 bg-[#1a1a1a] shadow-lg overflow-hidden">
          <li className="px-3 py-2 text-[12px] text-text/40 font-sans">
            No users found
          </li>
        </ul>
      )}
    </div>
  );
}
