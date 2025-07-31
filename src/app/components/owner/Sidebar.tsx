'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { assets, ownerMenuLinks } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, axios, fetchUser } = useAppContext();
  const [image, setImage] = useState<File | string | null>(null);

  const updateImage = async () => {
    try {
      if (!image) return;

      const formData = new FormData();
      formData.append('image', image);

      const { data } = await axios.post('/api/owner/update-image', formData);

      if (data.success) {
        fetchUser();
        toast.success(data.message);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image. Please try again later.');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-8 w-full max-w-[15rem] border-r border-borderColor text-sm">
      {/* Avatar */}
      <div className="group relative">
        <label htmlFor="image" className="cursor-pointer">
          <Image
            width={56}
            height={56}
            className="h-14 w-14 rounded-full mx-auto object-cover"
            src={
              image
                ? typeof image === 'string'
                  ? image
                  : URL.createObjectURL(image)
                : user?.image || assets.car_image1
            }
            alt="Profile"
          />
          <input
            type="file"
            accept="image/*"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          <div className="absolute hidden top-0 right-0 bottom-0 left-0 bg-black/10 rounded-full group-hover:flex items-center justify-center">
            <Image src={assets.edit_icon} alt="Edit" width={20} height={20} />
          </div>
        </label>
      </div>

      {/* Save button */}
      {image && (
        <button
          onClick={updateImage}
          className="absolute top-2 right-2 p-2 flex items-center gap-1 bg-primary text-white text-xs rounded shadow-sm"
        >
          Save
          <Image src={assets.check_icon} width={13} height={13} alt="Check" />
        </button>
      )}

      {/* User name */}
      <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

      {/* Navigation */}
      <div className="w-full mt-6">
        {ownerMenuLinks.map((link, index) => (
          <Link
            key={index}
            href={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 ${
              pathname === link.path
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600'
            }`}
          >
            <Image
              src={pathname === link.path ? link.coloredIcon : link.icon}
              alt={link.name}
              width={20}
              height={20}
            />
            <span className="max-md:hidden">{link.name}</span>
            {pathname === link.path && (
              <div className="bg-primary h-8 w-1 rounded-l right-0 absolute" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
