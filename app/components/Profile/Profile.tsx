"use client";

import { useState, useEffect, useCallback, memo, useRef } from "react";
import { Edit2, Save, X } from "lucide-react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import api from "@/lib/axios";
import useUserStore from "@/app/store/userStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postal: string;
  houseNo: string;
  suffix: string;
  image?: string;
}

const initialProfileData: ProfileData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  address: "",
  postal: "",
  houseNo: "",
  suffix: "",
  image: "",
};

// Memoized InputField component to prevent unnecessary re-renders
const InputField = memo(({
  label,
  field,
  value,
  isEditing,
  onChange,
  placeholder = "",
  disabled = false,
}: {
  label: string;
  field: keyof ProfileData;
  value: string;
  isEditing: boolean;
  onChange: (field: keyof ProfileData, value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 ">
      {label} <span className="text-red-500">*</span>
    </label>
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900"
        disabled={disabled}
      />
    ) : (
      <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
        {value || placeholder || "Not provided"}
      </div>
    )}
  </div>
));

InputField.displayName = "InputField";

// Memoized ProfileImage component with proper error handling
const ProfileImage = memo(({ src, alt }: { src: string; alt: string }) => {
  const [imageSrc, setImageSrc] = useState("https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src && src.trim() !== "") {
      setImageSrc(src);
      setHasError(false);
    } else {
      setImageSrc("https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");
    }
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc("https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className="w-full h-full object-fit rounded-full"
      onError={handleError}
      loading="lazy"
    />
  );
});

ProfileImage.displayName = "ProfileImage";

// Helper function to convert base64 to Blob
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: mimeType });
};

// Helper function to extract MIME type from base64
const getMimeTypeFromBase64 = (base64: string): string => {
  const match = base64.match(/^data:(.*?);base64,/);
  return match ? match[1] : 'image/jpeg';
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [formData, setFormData] = useState<ProfileData>(initialProfileData);
  const [profileImage, setProfileImage] = useState("https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");
  const [tempImage, setTempImage] = useState<string | File>("https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    Cookies.get("token") ? "" : router.push("/pages")
  }, [Cookies.get("token")]);

  // Fetch profile data from backend
  const fetchProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("profile/profile");
      
      if (response.data.success && response.data.data) {
        const userData = response.data.data;
        const formattedData: ProfileData = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          country: userData.country || "",
          city: userData.city || "",
          address: userData.address || "",
          postal: userData.postal || "",
          houseNo: userData.houseNo || "",
          suffix: userData.suffix || "",
          image: userData.image || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
        };
        
        setProfileData(formattedData);
        setFormData(formattedData);
        setProfileImage(userData.image || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");
        setTempImage(userData.image || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");
        setSelectedFile(null);
        setHasFetched(true);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile data to backend with file upload
  const updateProfileData = useCallback(async (data: ProfileData) => {
    try {
      setIsLoading(true);
      
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('firstName', data.firstName);
      formDataToSend.append('lastName', data.lastName);
      formDataToSend.append('phone', data.phone);
      formDataToSend.append('country', data.country);
      formDataToSend.append('city', data.city);
      formDataToSend.append('address', data.address);
      formDataToSend.append('postal', data.postal);
      formDataToSend.append('houseNo', data.houseNo);
      formDataToSend.append('suffix', data.suffix);
      
      // Handle image upload
      if (selectedFile) {
        // If a new file was selected
        formDataToSend.append('image', selectedFile);
      } else if (typeof tempImage === 'string' && tempImage !== profileImage && tempImage.startsWith('data:image')) {
        // If base64 image was modified (from edit mode)
        try {
          const mimeType = getMimeTypeFromBase64(tempImage);
          const blob = base64ToBlob(tempImage, mimeType);
          const file = new File([blob], 'profile-image.jpg', { type: mimeType });
          formDataToSend.append('image', file);
        } catch (error) {
          console.error('Error converting base64 to file:', error);
        }
      } else if (tempImage instanceof File) {
        // If tempImage is already a File object
        formDataToSend.append('image', tempImage);
      }
      
      console.log('Sending FormData with image:', selectedFile || tempImage);
      
      // Send request with FormData
      const response = await api.put("profile/profile", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        // Update local state with new data
        const updatedProfileData = {
          ...data,
          image: response.data.data?.image || profileImage,
        };
        
        setProfileData(updatedProfileData);
        setProfileImage(response.data.data?.image || profileImage);
        setSelectedFile(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating profile data:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, tempImage, profileImage]);

  // Fetch data when user changes and hasn't been fetched yet
  useEffect(() => {
    if (user && !hasFetched && !isLoading) {
      fetchProfileData();
    }
  }, [user, hasFetched, isLoading, fetchProfileData]);

  // Reset hasFetched when user changes
  useEffect(() => {
    if (user) {
      setHasFetched(false);
    }
  }, [user]);

  const handleInputChange = useCallback((field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleEdit = useCallback(() => {
    setFormData(profileData);
    setTempImage(profileImage);
    setSelectedFile(null);
    setIsEditing(true);
  }, [profileData, profileImage]);

  const handleSave = useCallback(async () => {
    const success = await updateProfileData(formData);
    if (success) {
      setIsEditing(false);
    }
  }, [formData, updateProfileData]);

  const handleCancel = useCallback(() => {
    setFormData(profileData);
    setTempImage(profileImage);
    setSelectedFile(null);
    setIsEditing(false);
  }, [profileData, profileImage]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      if (file.size > maxSize) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setTempImage(reader.result as string);
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
      };
      reader.readAsDataURL(file);
      
      // Store the actual file for upload
      setSelectedFile(file);
    }
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  if (isLoading && !profileData.email && !hasFetched) {
    return (
      <div className="min-h-screen p-[16px] md:p-[32px] flex items-center justify-center">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen  p-[16px] md:p-[32px]">
      <div className=" ">
        <div className="pb-[16px] md:pb-[32px]">
          <h1 className="font-montserrat font-semibold text-[28px] leading-8 sm:leading-10 md:leading-[48px] tracking-normal bg-white text-center rounded-lg p-[16px] md:p-[32px]">
            Profile
          </h1>
        </div>
        
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-[16px] md:p-[32px]  mb-[16px] md:mb-[32px]">
          <div className="flex flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                  <ProfileImage 
                    src={isEditing ? (typeof tempImage === 'string' ? tempImage : URL.createObjectURL(tempImage)) : profileImage} 
                    alt="Profile"
                  />
                </div>
                {isEditing && (
                  <label 
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md border-2 border-white hover:bg-gray-100"
                  >
                    <HugeiconsIcon icon={PencilEdit02Icon} />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                )}
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={handleEdit}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-[#C9A040] hover:bg-[#a38337] text-gray-800 rounded-lg font-medium transition-colors self-start sm:self-center disabled:opacity-50"
              >
                <HugeiconsIcon icon={PencilEdit02Icon} />
                Edit
              </button>
            ) : (
              <div className="flex gap-2 self-start sm:self-center">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-2 md:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <Save />
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <X />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Personal Info Section */}
        <div className="bg-white rounded-lg shadow-sm p-[16px] md:p-[32px] mb-[16px] md:mb-[32px]">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Personal Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <InputField
              label="First Name"
              field="firstName"
              value={isEditing ? formData.firstName : profileData.firstName}
              isEditing={isEditing}
              onChange={handleInputChange}
              placeholder="Enter first name"
              disabled={isLoading}
            />
            <InputField
              label="Last Name"
              field="lastName"
              value={isEditing ? formData.lastName : profileData.lastName}
              isEditing={isEditing}
              onChange={handleInputChange}
              placeholder="Enter last name"
              disabled={isLoading}
            />
            <div className="md:col-span-2">
              <InputField
                label="Email"
                field="email"
                value={isEditing ? formData.email : profileData.email}
                isEditing={isEditing}
                onChange={handleInputChange}
                placeholder="Enter email"
                disabled={true} // Email should not be editable
              />
            </div>
            <div className="md:col-span-2">
              <InputField
                label="Phone"
                field="phone"
                value={isEditing ? formData.phone : profileData.phone}
                isEditing={isEditing}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="md:col-span-2">
              <InputField
                label="Country"
                field="country"
                value={isEditing ? formData.country : profileData.country}
                isEditing={isEditing}
                onChange={handleInputChange}
                placeholder="Enter country"
                disabled={isLoading}
              />
            </div>

            <div className="md:col-span-2">
              <InputField
                label="City"
                field="city"
                value={isEditing ? formData.city : profileData.city}
                isEditing={isEditing}
                onChange={handleInputChange}
                placeholder="Enter city"
                disabled={isLoading}
              />
            </div>
            <div className="md:col-span-2">
              <InputField
                label="Address"
                field="address"
                value={isEditing ? formData.address : profileData.address}
                isEditing={isEditing}
                onChange={handleInputChange}
                placeholder="Enter address"
                disabled={isLoading}
              />
            </div>
            <InputField
              label="Postal"
              field="postal"
              value={isEditing ? formData.postal : profileData.postal}
              isEditing={isEditing}
              onChange={handleInputChange}
              placeholder="Enter postal code"
              disabled={isLoading}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="House Number"
                field="houseNo"
                value={isEditing ? formData.houseNo : profileData.houseNo}
                isEditing={isEditing}
                onChange={handleInputChange}
                placeholder="Enter house number"
                disabled={isLoading}
              />
              <InputField
                label="Suffix"
                field="suffix"
                value={isEditing ? formData.suffix : profileData.suffix}
                isEditing={isEditing}
                onChange={handleInputChange}
                placeholder="Enter suffix"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}