"use client";

import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postal: string;
  houseNumber: string;
  suffix: string;
}

const initialProfileData: ProfileData = {
  firstName: "John",
  lastName: "Doe",
  email: "Mokhail@email.com",
  phone: "Mokhail",
  country: "Dhaka",
  city: "Dhaka",
  address: "Mokhail",
  postal: "1212",
  houseNumber: "45",
  suffix: "A",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] =
    useState<ProfileData>(initialProfileData);
  const [formData, setFormData] = useState<ProfileData>(initialProfileData);
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
  );
  const [tempImage, setTempImage] = useState(profileImage);

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

  const handleSave = () => {
    setProfileData(formData);
    setProfileImage(tempImage);
    setIsEditing(false);
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

  const InputField = ({
    label,
    field,
    value,
    placeholder = "",
  }: {
    label: string;
    field: keyof ProfileData;
    value: string;
    placeholder?: string;
  }) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900"
        />
      ) : (
        <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
          {value || placeholder}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen  py-[32px] mx-[16px] lg:mx-[32px]">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="">
          <h1 className="font-montserrat font-semibold text-2xl sm:text-3xl md:text-[40px] leading-8 sm:leading-10 md:leading-[48px] tracking-normal mb-4 md:mb-8 bg-white text-center rounded-lg py-2 sm:py-3 md:py-4">
            Profile
          </h1>
        </div>
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-6">
          <div className="flex flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={isEditing ? tempImage : profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8  sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md border-2 border-white">
                    {/* <Edit2 size={16} className="text-white" /> */}
                    <HugeiconsIcon icon={PencilEdit02Icon} />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-[#C9A040] hover:bg-[#a38337] text-gray-800 rounded-lg font-medium transition-colors self-start sm:self-center"
              >
                {/* <Edit2 size={18} /> */}
                <HugeiconsIcon icon={PencilEdit02Icon} />
                Edit
              </button>
            ) : (
              <div className="flex gap-2 self-start sm:self-center">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Save size={18} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Personal Info Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Personal Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <InputField
              label="First Name"
              field="firstName"
              value={isEditing ? formData.firstName : profileData.firstName}
              placeholder="john"
            />
            <InputField
              label="Last Name"
              field="lastName"
              value={isEditing ? formData.lastName : profileData.lastName}
              placeholder="Doe"
            />
            <div className="md:col-span-2">
              <InputField
                label="Email"
                field="email"
                value={isEditing ? formData.email : profileData.email}
                placeholder="Mokhail@email.com"
              />
            </div>
            <div className="md:col-span-2">
              <InputField
                label="Phone"
                field="phone"
                value={isEditing ? formData.phone : profileData.phone}
                placeholder="Mokhail"
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
                placeholder="Dhaka"
              />
            </div>

            <div className="md:col-span-2">
              <InputField
                label="City"
                field="city"
                value={isEditing ? formData.city : profileData.city}
                placeholder="Dhaka"
              />
            </div>
            <div className="md:col-span-2">
              <InputField
                label="Address"
                field="address"
                value={isEditing ? formData.address : profileData.address}
                placeholder="Mokhail"
              />
            </div>
            <InputField
              label="Postal"
              field="postal"
              value={isEditing ? formData.postal : profileData.postal}
              placeholder="1212"
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="House Number"
                field="houseNumber"
                value={
                  isEditing ? formData.houseNumber : profileData.houseNumber
                }
                placeholder="45"
              />
              <InputField
                label="Suffix"
                field="suffix"
                value={isEditing ? formData.suffix : profileData.suffix}
                placeholder="A"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
