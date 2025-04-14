import React from "react";
const videos = [
    {
      title: "NHỮNG KHOẢNH KHẮC TẠI SỰ KIỆN SAKURA HAI BÀ TRƯNG TRÒN 6 TUỔI",
      thumbnail: "https://sakurabeauty.vn/media/video/1685034000/checkin.jpg", // Thay bằng link hình thật
      tags: ["#sakurabeautyjp", "#SAKURA", "We love Sakura", "#sakurabeauty"],
    },
    {
      title: "SAKURA BEAUTY VIỆT NAM LIVESTREAM DOCTORDAY",
      thumbnail: "https://sakurabeauty.vn/media/video/1650474000/0.jpg", // Thay bằng link hình thật
    },
    {
      title:
        "GIẢM NÁM HIỆU QUẢ 81% NHỜ CÔNG THỨC ĐỘT PHÁ TRIPLE EFFECTS 3 TÁC ĐỘNG SÂU",
      thumbnail: "https://sakurabeauty.vn/media/video/1611162000/image_2021_01_14T06_52_52_305Z.png", // Thay bằng link hình thật
    },
    {
      title:
        "100% KHÁCH HÀNG ĐÃ CHỌN LỰA THẠCH COLLAGEN DƯỠNG NHAN SAKURA VÀ ĐÂY CHÍNH LÀ LÝ...",
      thumbnail: "https://sakurabeauty.vn/media/video/1597078800/Banner_Ads_-_Facebook.jpg", // Thay bằng link hình thật
    },
    {
      title:
        "SAKURA PREMIUM COLLAGEN JELLY - GIẢI PHÁP CHUYÊN GIA GIÚP THANH HẰNG ĐẸP KHÔNG...",
      thumbnail: "https://sakurabeauty.vn/media/video/1596387600/Capture.PNG", // Thay bằng link hình thật
    },
  ];
  
const ConsultantPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-red-600 text-center mb-12">
        Chuyên gia, cố vấn Sakura tại Việt Nam
      </h1>

      {/* Expert Profiles Grid */}
      <div className="space-y-12">
        {/* First Expert Profile */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Bác sĩ Lê Vi Anh - Hot Doctor của Sakura
            </h2>
            <div className="flex items-center text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
              </svg>
              <span>09/11/2016</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Không chỉ tài năng, giỏi nghề, thân thiện với bệnh nhân, Bác sĩ Lê
              Vi Anh - Chuyên gia cố vấn của Sakura còn được biết đến với biệt
              danh "Hot Doctor", nữ bác sĩ vừa giỏi về tay nghề, ngoài hình
              xinh...
            </p>
          </div>
          <div className="md:w-1/3">
            <img
              src="https://sakurabeauty.vn/media/tintuc/1478797200/bac-si-le-vi-anh-hot-doctor-cua-sakura1.jpg"
              alt="Dr. Le Vi Anh at Sakura Clinic"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Second Expert Profile */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-1/3">
            <img
              src="https://sakurabeauty.vn/media/tintuc/1477846800/bac-si-phan-thi-loan-co-van-chuyen-gia-cua-sakura-tai-thanh-hoa.jpg"
              alt="Dr. Phan Thi Loan"
              className="w-full rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Bác sĩ Phan Thị Loan – cố vấn chuyên môn của Sakura tại Thanh Hóa
            </h2>
            <div className="flex items-center text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
              </svg>
              <span>31/10/2016</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Bác sĩ Phan Thị Loan là nữ Bác sĩ có hơn 30 năm làm việc tại Bệnh
              viện Da liễu tỉnh Thanh Hóa, là người luôn nhận được sự yêu mến,
              tin cậy của đồng nghiệp, bệnh nhân.
            </p>
             
          </div>
        </div>
        <h2 className="text-center text-2xl font-semibold mb-6">VIDEO</h2>
        <div className="border-t-2 w-1/4 mx-auto mb-4"></div>

        {/* Video chính */}
        <div className="mb-6">
          <img
            src={videos[0].thumbnail}
            alt={videos[0].title}
            className="w-full rounded-lg"
          />
          <h3 className="mt-2 text-center font-semibold">{videos[0].title}</h3>
          <div className="flex justify-center space-x-2 mt-2">
            {videos[0].tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-200 rounded-md text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Danh sách video nhỏ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.slice(1).map((video, index) => (
            <div key={index} className="flex space-x-4 items-center">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-24 h-16 rounded-lg"
              />
              <p className="text-sm font-semibold">{video.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsultantPage;
