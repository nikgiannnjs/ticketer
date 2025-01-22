import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { LoaderCircle, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";
import { uploadImage } from "@/hooks/useImageUpload";
import { toast } from "react-hot-toast";

const FormField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  required = true,
  className,
  inputClassName,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  inputClassName?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    <Label htmlFor={name}>{label}</Label>
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className={inputClassName}
    />
  </div>
);

export default function CreateEvent() {
  const createEvent = useCreateEvent();
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
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      setSelectedImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Upload image first if one is selected
      let imageUrl = '';
      if (selectedImage) {
        const fullUrl = await uploadImage(selectedImage);
        // Use URL API to parse the URL and get just the pathname
        const url = new URL(fullUrl);
        imageUrl = url.pathname;
      }


      // Then create the event with the image URL
      await createEvent.mutateAsync({
        ...formData,
        image: imageUrl
      });

    } catch (error) {
      console.error('Error creating event:', error);
      toast.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-20 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
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
                  id="image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image')?.click()}
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
            <Button 
              type="submit" 
              className="w-full"
              disabled={createEvent.isLoading || isSubmitting}
            >
              {(createEvent.isLoading || isSubmitting) ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 
