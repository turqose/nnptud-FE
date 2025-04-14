import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Home, LogOut, MapPin, Settings, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearCartState } from "../../features/cart/cartSlice";
import { logout, userLogout } from "../../features/user/userSlice";

export default function AccountSidebar() {
  let [isOpen, setIsOpen] = useState(false);
  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }
  const navigation = [
    { name: "Account", href: "/account", icon: Home },
    { name: "Address", href: "/account/address", icon: MapPin },
    { name: "Orders", href: "/account/orders", icon: ShoppingBag },
    { name: "Cài đặt", href: "/account/setting", icon: Settings },
  ];
  const {userInfo} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const onLogout = async () => {
    try {
      await dispatch(userLogout()).unwrap();
        dispatch(clearCartState());
      dispatch(logout());
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Failed to logout: ", error);
    }
  };
  console.log(userInfo)

  return (
    <aside className="rounded-lg bg-white p-6 shadow-sm md:col-span-3">
      <div className="mb-6 flex flex-col items-center">
        <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full">
          <img src={"/user.jpg"} alt="" className="object-cover" />
        </div>
        <h2 className="text-lg font-semibold">{userInfo.full_name}</h2>
      </div>

      <nav>
        <ul className="space-y-1">
 
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 hover:text-gray-900 ${
                    isActive ? "bg-gray-100 text-gray-900" : "text-gray-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
          {/*  nếu là admin thì có thêm đường dẫn đi qua admin */}
          {userInfo.role === "admin" && (
            <li>
              <Link
                to="/admin"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <Home className="h-5 w-5" />
                Admin
              </Link>
            </li>
          )}
          <li>
            <button
              onClick={open}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </button>
          </li>
        </ul>
      </nav>
      <Dialog open={isOpen} as="div" className="relative z-10" onClose={close}>
        <div
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
          aria-hidden="true"
        ></div>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Confirm Logout
              </DialogTitle>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to log out? You will need to log in
                  again to access your account.
                </p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  onClick={close}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  onClick={onLogout}
                >
                  Log Out
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </aside>
  );
}
