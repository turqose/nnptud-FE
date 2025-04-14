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
const BookingPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-red-600 text-center mb-12">
        Hỏi đáp với bác sĩ
      </h1>

      {/* Q&A List */}
      <div className="space-y-12">
        {/* First Q&A */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Tôi làm việc trong nhà, tại sao vẫn bị sạm da do nắng?
            </h2>
            <div className="flex items-center text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
              </svg>
              <span>14/12/2016</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              "Tôi làm việc trong nhà, tại sao vẫn bị sạm da do nắng?" - là câu
              hỏi quen thuộc của hầu hết các chị em phụ nữ. Nguyên nhân cho tình
              trạng này sẽ được Bác sĩ Sakura giải đáp trong bài viết dưới
              đây...
            </p>
          </div>
          <div className="md:w-1/3">
            <img
              src="https://sakurabeauty.vn/media/tintuc/1481648400/toi-lam-viec-trong-nha-tai-sao-van-bi-sam-da-do-nang1.jpg"
              alt="Woman working indoors"
              className="w-full rounded-lg shadow-md object-cover"
            />
          </div>
        </div>

        {/* Second Q&A */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-1/3">
            <img
              src="https://sakurabeauty.vn/media/tintuc/1481562000/q-a-cay-phan-co-gay-bit-tac-cho-da-hay-khong1.jpg"
              alt="Facial treatment"
              className="w-full rounded-lg shadow-md object-cover"
            />
          </div>
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Q&A: Cấy phấn có gây bít tắc cho da hay không?
            </h2>
            <div className="flex items-center text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
              </svg>
              <span>09/12/2016</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Phương pháp cấy phấn đang là chủ đề được nhiều phái đẹp Việt quan
              tâm. Và Sakura Việt Nam sẽ giúp các bạn giải đáp những thắc mắc
              thông qua đội ngũ chuyên gia của nhãn hàng. Cùng lắng nghe chia
              sẻ...
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

      {/* Floating Contact Button */}
      <div className="fixed bottom-8 left-8 z-50">
        <div className="bg-teal-600 text-white rounded-full p-4 shadow-lg flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span className="font-medium">Hotline: 1900 7218</span>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
