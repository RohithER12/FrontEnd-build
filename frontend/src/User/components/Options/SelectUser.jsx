

import {Select, SelectItem, Avatar, Chip} from "@nextui-org/react";
import { CLOUDINARY_FETCH_URL } from "../../../utils/config/config";

export default function SelectUser({users}) {
  return (
    <Select
      items={users}
      className="w-full"
      variant="bordered"
      placeholder="Select a user"
      labelPlacement="outside"
      classNames={{
        base: "max-w-xs",
        trigger: "min-h-unit-12 py-2",
      }}
      
    >
      {(user) => (
        <SelectItem key={user.id} textValue={user.userName} value={user.id} className="w-fit">
          <div className="flex gap-2 items-center">
            <Avatar alt={user.userName} className="flex-shrink-0" size="sm" src={user.avatarId ? `${CLOUDINARY_FETCH_URL}/${user.avatarId}` : undefined}/>
            <div className="flex justify-between">
              <span className="text-small">{user.userName}</span>
              <button className="">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>

              </button>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
}
