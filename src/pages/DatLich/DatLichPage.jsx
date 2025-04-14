import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const DatLichPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    doctor: "",
    livingArea: "",
    skinCondition: "",
    appointmentDate: "",
    serviceType: "free-consultation",
  });

  const onSubmit = (data) => {
     toast.success("Đặt lịch hẹn thành công");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center tracking-wide">
          ĐẶT HẸN TƯ VẤN VỚI BÁC SĨ SAKURA
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            name="fullName"
            placeholder="Họ tên"
            className="w-full p-3 border  "
            {...register("fullName", { required: "Họ tên là bắt buộc" })}
          />
          {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
        </div>

        <div>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Số điện thoại"
            className="w-full p-3 border  "
            {...register("phoneNumber", { required: "Số điện thoại là bắt buộc" })}
          />
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border  "
            {...register("email", { required: "Email là bắt buộc" })}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <select
            name="doctor"
            className="w-full p-3 border   appearance-none bg-white"
            {...register("doctor", { required: "Vui lòng chọn bác sĩ" })}
          >
            <option value="">--Chọn Bác Sĩ---</option>
            <option value="dr-sakura">Bác sĩ Sakura</option>
            <option value="dr-other">Bác sĩ khác</option>
          </select>
          {errors.doctor && <p className="text-red-500">{errors.doctor.message}</p>}
        </div>

        <div>
          <input
            type="text"
            name="livingArea"
            placeholder="Khu vực sinh sống"
            className="w-full p-3 border  "
            {...register("livingArea")}
          />
        </div>

        <div>
          <input
            type="text"
            name="skinCondition"
            placeholder="Tình trạng da"
            className="w-full p-3 border  "
            {...register("skinCondition")}
          />
        </div>

        <div>
          <input
            type="date"
            name="appointmentDate"
            placeholder="Ngày hẹn khám"
            className="w-full p-3 border  "
            {...register("appointmentDate", { required: "Ngày hẹn khám là bắt buộc" })}
          />
          {errors.appointmentDate && <p className="text-red-500">{errors.appointmentDate.message}</p>}
        </div>

        <div className="mt-6">
          <p className="font-medium mb-2">Yêu cầu:</p>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="free-consultation"
                name="serviceType"
                value="free-consultation"
                className="mr-2 h-4 w-4 text-red-500"
                {...register("serviceType")}
              />
              <label htmlFor="free-consultation">
                Soi da và tư vấn miễn phí
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="treatment"
                name="serviceType"
                value="treatment"
                className="mr-2 h-4 w-4 text-red-500"
                {...register("serviceType")}
              />
              <label htmlFor="treatment">
                Khám da và điều trị da với bác sĩ Sakura
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-gray-400 text-white font-bold tracking-wide hover:bg-gray-500 transition-colors duration-200 mt-6"
        >
          ĐẶT LỊCH HẸN
        </button>
      </form>
    </div>
  );
};

export default DatLichPage;
