"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import axiosInstance from "../../api/axiosConfig"
import GlobalLoading from "../GlobalLoading/GlobalLoading"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        // Handle form submission here
        console.log("Form submitted:", formData)
        await axiosInstance.post("/contacts", formData)
        toast.success("Message sent successfully")
        // Reset form after successful submission
        setFormData({ name: "", email: "", message: "" })
      } catch (error) {
        console.error("Error submitting form:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <>
      {isLoading && <GlobalLoading />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            NAME
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
            ${errors.name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Your Name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
            ${errors.email ? "border-red-500" : "border-gray-300"}`}
            placeholder="Your Email"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            MESSAGE
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10
            ${errors.message ? "border-red-500" : "border-gray-300"}`}
            placeholder="Your message"
          />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900"
        >
          Send Message
        </button>
      </form>
    </>
  )
}

