import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AddressFieldsProps {
  onAddressChange: (addressData: {
    address1: string;
    address2: string;
    pincode: string;
    city: string;
    state: string;
  }) => void;
}

const AddressFields = ({ onAddressChange }: AddressFieldsProps) => {
  const [address, setAddress] = useState({
    address1: "",
    address2: "",
    pincode: "",
    city: "",
    state: "",
  });

  const handlePincodeChange = async (pincode: string) => {
    setAddress(prev => ({ ...prev, pincode }));
    
    if (pincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setAddress(prev => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State
          }));
          onAddressChange({
            ...address,
            pincode,
            city: postOffice.District,
            state: postOffice.State
          });
        } else {
          toast.error("Invalid pincode");
        }
      } catch (error) {
        console.error("Error fetching pincode data:", error);
        toast.error("Error fetching location details");
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);
    onAddressChange(newAddress);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
          Address Line 1
        </label>
        <Input
          id="address1"
          type="text"
          required
          value={address.address1}
          onChange={(e) => handleChange("address1", e.target.value)}
          placeholder="Street address"
        />
      </div>
      <div>
        <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
          Address Line 2
        </label>
        <Input
          id="address2"
          type="text"
          value={address.address2}
          onChange={(e) => handleChange("address2", e.target.value)}
          placeholder="Apartment, suite, etc. (optional)"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
            Pincode
          </label>
          <Input
            id="pincode"
            type="text"
            required
            maxLength={6}
            value={address.pincode}
            onChange={(e) => handlePincodeChange(e.target.value)}
            placeholder="Enter pincode"
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <Input
            id="city"
            type="text"
            required
            value={address.city}
            readOnly
            className="bg-gray-50"
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <Input
            id="state"
            type="text"
            required
            value={address.state}
            readOnly
            className="bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressFields;