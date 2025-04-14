import { Dialog, Transition } from "@headlessui/react";
import {
  ChevronRight,
  ChevronsUpDown,
  Filter,
  Search,
  Trash2
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteContact,
  getContacts,
} from "../../../features/contact/contactSlice";

const ContactList = () => {
   const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector((state) => state.contact);
  const totalPages = Math.ceil(contacts.length / 10);

  useEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((c) => c.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter((c) => c !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredContacts = sortedContacts.filter((contact) => {
    return (
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const openDeleteDialog = (contact) => {
    setContactToDelete(contact);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteContact(contactToDelete.id)).unwrap();
      closeDeleteDialog();
    } catch (error) {
      console.error("Failed to delete contact: ", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' , hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 dark:bg-[#081028] dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-700 bg-white dark:bg-[#081028]">
          {/* Top section */}
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold">Contacts</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Link to="/admin">Dashboard</Link>
                <ChevronRight className="h-4 w-4" />
                <span>Contact List</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 border-t border-gray-300 p-4 md:flex-row md:items-center md:justify-between dark:border-gray-700">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
              <input
                type="search"
                placeholder="Search contacts..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#081028] dark:text-white dark:border-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-200 dark:bg-[#081028] dark:border-gray-600 dark:hover:bg-gray-700">
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-gray-300 rounded-xl overflow-hidden dark:bg-[#081028] dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 bg-gray-300 checked:bg-purple-600 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedContacts.length === contacts.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("message")}
                  >
                    <div className="flex items-center gap-2">
                      Message
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts
                  .slice((currentPage - 1) * 10, currentPage * 10)
                  .map((contact,index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-300 dark:border-gray-700"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 bg-gray-300 checked:bg-purple-600 dark:bg-gray-700 dark:border-gray-600"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => toggleSelect(contact.id)}
                        />
                      </td>
                      <td className="px-6 py-4">{contact.name}</td>
                      <td className="px-6 py-4">{contact.email}</td>
                      <td className="px-6 py-4">{contact.message}</td>
                      <td className="px-6 py-4">{formatDate(contact.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 hover:bg-gray-300 rounded-lg dark:hover:bg-gray-700"
                            onClick={() => openDeleteDialog(contact)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-300 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentPage * 10 - 9}-
              {Math.min(currentPage * 10, contacts.length)} of {contacts.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 ${
                    currentPage === index + 1
                      ? "bg-gray-300 dark:bg-gray-700"
                      : ""
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Transition appear show={isDeleteDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDeleteDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-[#081028]">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Delete Contact
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete the contact from "
                      {contactToDelete?.name}"? This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      onClick={closeDeleteDialog}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
export default ContactList;
