import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState, useRef, useEffect } from "react";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";
import { uploadImage } from "@/hooks/useImageUpload";
import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/TextArea";
import { useParams, useNavigate } from "react-router";
import { useGetEvent } from "@/hooks/useGetEvent";
import { useUpdateEvent } from "@/hooks/useUpdateEvent";

type BaseFormFieldProps = {
  label: string;
  name: string;
  value: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
};

type TextInputFormFieldProps = BaseFormFieldProps & {
  withTextArea?: false;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type TextAreaFormFieldProps = BaseFormFieldProps & {
  withTextArea: true;
  type?: never;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

type FormFieldProps = TextInputFormFieldProps | TextAreaFormFieldProps;

const FormField = (props: FormFieldProps) => {
  const {
    label,
    name,
    value,
    required,
    className,
    inputClassName,
    withTextArea,
    type,
    onChange,
  } = props;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      {withTextArea ? (
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClassName}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClassName}
        />
      )}
    </div>
  );
};

export default function CreateEvent() {
  const { id } = useParams();
  const { data: eventData} = useGetEvent(id);
  const isEditMode = !!id;

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    country: "",
    city: "",
    address: "",
    date: "",
    time: "",
    price: "",
    capacity: "",
    image: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageUpload = async (image?: File | null) => {
    if (!image) return "";
    const fullUrl = await uploadImage(image);
    const url = new URL(fullUrl);
    return url.pathname;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const imageUrl = await handleImageUpload(selectedImage);

      await createEvent.mutateAsync({
        ...formData,
        image: imageUrl,
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const imageUrl = selectedImage
        ? await handleImageUpload(selectedImage)
        : formData.image;

      await updateEvent.mutateAsync({
        id: id as string,
        ...formData,
        image: imageUrl,
      });
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isEditMode && eventData) {
      const dateOnly = new Date(eventData.datetime).toLocaleDateString("en-CA"); // we need it to be in the format of YYYY-MM-DD and this locale does that
      const timeOnly = new Date(eventData.datetime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const imageUrl = eventData.image
        ? `${import.meta.env.VITE_R2_DEV_SUBDOMAIN}${eventData.image}`
        : "";
      setImagePreview(imageUrl);

      setFormData({
        title: eventData.title,
        description: eventData.description,
        country: eventData.country,
        city: eventData.city,
        address: eventData.address,
        date: dateOnly,
        time: timeOnly,
        price: eventData.price.toString(),
        capacity: eventData.capacity.toString(),
        image: eventData.image,
      });
    }
  }, [isEditMode, eventData]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-20 p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Edit Event" : "Create New Event"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={isEditMode ? handleUpdate : handleSubmit}>
          <CardContent className="space-y-4">
            <FormField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

            <FormField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              withTextArea
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
              <FormField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <FormField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                inputClassName="justify-end"
              />
              <FormField
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                inputClassName="justify-end"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
              />
              <FormField
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Event Image</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  {imagePreview && (
                    <div className="mt-4 w-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {!isEditMode ? (
              <Button
                type="submit"
                className="w-full"
                disabled={createEvent.isLoading || isSubmitting}
                isLoading={createEvent.isLoading || isSubmitting}
              >
                Create Event
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={updateEvent.isLoading || isSubmitting}
                isLoading={updateEvent.isLoading || isSubmitting}
              >
                Update Event
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
