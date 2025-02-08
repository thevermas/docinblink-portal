
import { Input } from "@/components/ui/input";

interface RegistrationFormProps {
  formData: {
    fullName: string;
    specialization: string;
    qualification: string;
    experienceYears: string;
    consultationFee: string;
    email: string;
    password: string;
  };
  onChange: (field: string, value: string) => void;
}

export const RegistrationForm = ({ formData, onChange }: RegistrationFormProps) => {
  return (
    <>
      <div>
        <label htmlFor="fullName" className="sr-only">
          Full Name
        </label>
        <Input
          id="fullName"
          type="text"
          required
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="specialization" className="sr-only">
          Specialization
        </label>
        <Input
          id="specialization"
          type="text"
          required
          placeholder="Specialization"
          value={formData.specialization}
          onChange={(e) => onChange("specialization", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="qualification" className="sr-only">
          Qualification
        </label>
        <Input
          id="qualification"
          type="text"
          required
          placeholder="Qualification"
          value={formData.qualification}
          onChange={(e) => onChange("qualification", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="experienceYears" className="sr-only">
          Years of Experience
        </label>
        <Input
          id="experienceYears"
          type="number"
          required
          min="0"
          placeholder="Years of Experience"
          value={formData.experienceYears}
          onChange={(e) => onChange("experienceYears", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="consultationFee" className="sr-only">
          Consultation Fee
        </label>
        <Input
          id="consultationFee"
          type="number"
          required
          min="0"
          step="0.01"
          placeholder="Consultation Fee"
          value={formData.consultationFee}
          onChange={(e) => onChange("consultationFee", e.target.value)}
        />
      </div>
    </>
  );
};
