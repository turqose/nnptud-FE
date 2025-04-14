import { ArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addAddress, fetchAddressById, updateAddress } from "../../features/address/addressSlice";

const AddAddressPage = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchAddressById(id)).then((response) => {
        const address = response.payload;
        for (const [key, value] of Object.entries(address)) {
          setValue(key, value);
        }
      });
    }
  }, [id, dispatch, setValue]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(updateAddress({ id, ...data })).unwrap();
        toast.success("Address updated successfully");
      } else {
        await dispatch(addAddress(data)).unwrap();
        toast.success("Address added successfully");
      }
      navigate("/account/address");
    } catch (error) {
      toast.error(error.message ?? error.error);
      console.error("Failed to save address: ", error);
    }
  };

  return (
    <div className="">
      <div className="mb-8">
        <Link
          to="/account/address"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Addresses
        </Link>
      </div>

      <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{id ? "Edit Address" : "Add New Address"}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {id ? "Edit your address details." : "Add a new address for billing or shipping."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                {...register("full_name", { required: true })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.full_name && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone", { required: true })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="address_line1"
              className="block text-sm font-medium text-gray-700"
            >
              Address Line 1
            </label>
            <input
              type="text"
              id="address_line1"
              {...register("address_line1", { required: true })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            {errors.address_line1 && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="address_line2"
              className="block text-sm font-medium text-gray-700"
            >
              Address Line 2
            </label>
            <input
              type="text"
              id="address_line2"
              {...register("address_line2")}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                {...register("city", { required: true })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.city && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                {...register("state", { required: true })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.state && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="postal_code"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="postal_code"
                {...register("postal_code", { required: true })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.postal_code && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                {...register("country", { required: true })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.country && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_default"
              {...register("is_default")}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label
              htmlFor="is_default"
              className="ml-2 block text-sm text-gray-700"
            >
              Set as default address
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              to="/account/address"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
            >
              {id ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressPage;
