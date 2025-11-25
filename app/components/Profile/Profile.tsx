"use client";

import { useState, useEffect } from "react";
import { Edit2, Save, X } from "lucide-react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import api from "@/lib/axios";
import useUserStore from "@/app/store/userStore";

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

// Move InputField component outside to prevent re-creation
const InputField = ({
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
);

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [formData, setFormData] = useState<ProfileData>(initialProfileData);
  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  const [tempImage, setTempImage] = useState(profileImage);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserStore();

  // Fetch profile data from backend
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);

      const response = await api.get("profile/profile");
       console.log(response.data,"121")
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
          image: userData.image || "/default-avatar.png",
        };
        setProfileData(formattedData);
        setFormData(formattedData);
        setProfileImage(userData.image || "/default-avatar.png");
        setTempImage(userData.image || "/default-avatar.png");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile data to backend
  const updateProfileData = async (data: ProfileData) => {
    try {
     
      setIsLoading(true);
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        country: data.country,
        city: data.city,
        address: data.address,
        postal: data.postal,
        houseNo: data.houseNo,
        suffix: data.suffix,
        image: tempImage !== profileImage ? tempImage : data.image,
      };

      const response = await api.put("profile/profile", updateData);
      
      if (response.data.success) {
        setProfileData(data);
        setProfileImage(tempImage);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating profile data:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setFormData(profileData);
    setTempImage(profileImage);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const success = await updateProfileData(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setTempImage(profileImage);
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading && !profileData.email) {
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
                  <img
                    src={isEditing ? tempImage : profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8  sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md border-2 border-white">
                    <HugeiconsIcon icon={PencilEdit02Icon} />
                    <input
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