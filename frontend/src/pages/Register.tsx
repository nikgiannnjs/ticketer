import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/Modal";
import { useRegister } from "@/hooks/useRegister";
import { useRequestAccess } from "@/hooks/useRequestAccess";

const Field = ({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  type?: string;
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={label}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <Input
        id={label}
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: register, isLoading } = useRegister();
  const { mutate: requestAccess, isLoading: isRequestLoading } =
    useRequestAccess();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ email, password, firstName, lastName, passwordConfirm });
  };

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    requestAccess(
      { email: requestEmail },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setRequestEmail("");
        },
      }
    );
  };

  return (
    <>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription className="text-sm">
            Request access to the platform if you are an event planner.
          </CardDescription>
          <CardDescription className="text-sm">
            We need to verify your identity before you can access the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Field
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required={true}
              />
              <Field
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required={true}
              />
              <Field
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={true}
              />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
              />
              <Field
                label="Password Confirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required={true}
              />
              <div className="flex flex-col gap-4 pt-4">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Register
              </Button>
              <ModalTrigger asChild>
                <Button
                  type="button"
                  variant="link"
                  className="w-full font-bold"
                >
                  Request Access
                </Button>
              </ModalTrigger>
            </div>
          </form>
          <ModalContent>
            <ModalHeader>
                <ModalTitle>Request Access</ModalTitle>
                <ModalDescription>
                  Enter your email to request access to the platform
                </ModalDescription>
              </ModalHeader>
              <form onSubmit={handleRequestAccess} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label
                    htmlFor="requestEmail"
                    className="text-sm font-medium leading-none"
                  >
                    Email
                  </label>
                  <Input
                    id="requestEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isRequestLoading}
                >
                  Submit Request
                </Button>
              </form>
            </ModalContent>
          </Modal>
        </CardContent>
      </Card>
    </>
  );
}
