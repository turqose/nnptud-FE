import React from "react";
import { Link } from "react-router-dom";

const ConsultantMenu = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Experts Section */}
      <Link to="/consultants/consultants" className="block">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between p-6">
            <div className="md:w-1/2 space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">
                SAKURA EXPERTS AND CONSULTANTS IN VIETNAM
              </h2>
              <p className="text-gray-600">
                Sakura experts with years of experience are ready to provide
                consultation, treatment protocols, and skin care knowledge.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-end mt-4 md:mt-0">
              <img
                src="https://sakurabeauty.vn/templates4/front/images/chuyen_gia_bac_si.png"
                alt="Sakura Experts"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </Link>
      {/* Articles Section */}
      <Link to="/consultants/booking" className="block">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between p-6">
            <div className="md:w-1/2 space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">
                Hỏi đáp với bác sĩ
              </h2>
              <p className="text-gray-600">
              Đặt câu hỏi với bác sĩ. Hãy gửi đến những câu hỏi của bạn để được tư vấn và giải đáp bởi bác sĩ, chuyên gia cố vấn Sakura.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-end mt-4 md:mt-0">
              <img
                src="https://sakurabeauty.vn/templates4/front/images/bai_viet_chuyen_mon.png"
                alt="Doctor Writing"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>{" "}
      </Link>

      {/* Decorative Elements */}
      <div className="absolute right-4 top-4">
        <div className="w-8 h-8 text-red-500">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ConsultantMenu;
