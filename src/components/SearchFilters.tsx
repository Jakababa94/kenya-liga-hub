import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SearchFilters = () => {
  return (
    <div className="w-full space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tournaments..."
          className="pl-10"
        />
      </div>
      <Select>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          <SelectItem value="nairobi">Nairobi</SelectItem>
          <SelectItem value="mombasa">Mombasa</SelectItem>
          <SelectItem value="kisumu">Kisumu</SelectItem>
          <SelectItem value="nakuru">Nakuru</SelectItem>
          <SelectItem value="eldoret">Eldoret</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="u15">Under 15</SelectItem>
          <SelectItem value="u18">Under 18</SelectItem>
          <SelectItem value="u21">Under 21</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="veterans">Veterans</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="ongoing">Ongoing</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchFilters;
