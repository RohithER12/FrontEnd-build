import {Select,SelectItem} from "@nextui-org/react" 

export default function Options({label,placeholder,data,handlechange}) {
  return (
    <Select
      isRequired
      label={label}
      placeholder={placeholder}
      className="w-full"
      onChange={handlechange}
      name={label}
      
    >
      {data.map((value) => (
        <SelectItem key={value.type ? value.type :value}  value={value.type ? value.type :value} className="w-fit">
          {value.type ? value.type :value}
        </SelectItem>
      ))}
    </Select>
    
  );
}
