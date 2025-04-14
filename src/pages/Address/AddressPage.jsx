import { Edit, MapPin, Star, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteAddress,
  getAddresses,
  setDefaultAddress,
} from "../../features/address/addressSlice";

const AddressPage = () => {
  const { addresses, loading, error } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const handleSetDefault = async (id, type) => {
    try {
      await dispatch(setDefaultAddress(id, type)).unwrap();
      toast.success("Default address set successfully");
    } catch (error) {
      toast.error(error.message ?? error.error);
      console.error("Failed to set default address: ", error);
    } finally {
      await dispatch(getAddresses()).unwrap();
    }
  };
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAddress(id)).unwrap();

      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error(error.message ?? error);
      console.error("Failed to delete address: ", error);
    } finally {
      await dispatch(getAddresses()).unwrap();
    }
  };
  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-2xl font-bold leading-6 text-gray-900">Address</h3>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No addresses
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new address.
          </p>
          <div className="mt-6">
            <Link
              to="/account/address/add"
              className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900"
            >
              Add New Address
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {[...addresses]
            .sort((a, b) => b.is_default - a.is_default)
            .map((address) => (
              <div
                key={address.address_id}
                className="rounded-lg border border-gray-200 p-6 hover:border-gray-400"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-gray-900">
                    Address
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/account/address/edit/${address.address_id}`}
                      className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Link>
                    <button
                                      type="button"

                      onClick={() => handleDelete(address.address_id)}
                      className="flex items-center text-sm text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    {address.full_name}
                  </p>
                  <p className="text-sm text-gray-500">{address.phone}</p>
                  <p className="text-sm text-gray-500">
                    {address.address_line1},{" "}
                    {address.address_line2 && `${address.address_line2}, `}
                    {address.city}, {address.state}, {address.country},{" "}
                    {address.postal_code}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() =>
                      handleSetDefault(address.address_id, "address")
                    }
                    className={`flex items-center text-sm ${
                      address.is_default
                        ? "text-green-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    disabled={address.is_default}
                  >
                    <Star className="mr-1 h-4 w-4" />
                    {address.is_default ? "Default Address" : "Set as default"}
                  </button>
                </div>
              </div>
            ))}
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
            <Link
              to="/account/address/add"
              className="flex flex-col items-center text-center"
            >
              <MapPin className="h-10 w-10 text-gray-400" />
              <span className="mt-2 block text-sm font-semibold text-gray-900">
                Add New Address
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPage;
