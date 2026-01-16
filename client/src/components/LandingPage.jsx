import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'lucide-react';
import { CircleX } from 'lucide-react';

function LandingPage() {
  const [trips, setTrips] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  async function searchTrips(keyword = "") {
    try {
      const response = await axios.get(`http://localhost:4001/trips?keywords=${keyword}`);
      setTrips(response.data.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  }

 const handleCategoryClick = (categoryName) => {
  if (!searchText.includes(categoryName)) {
    setSearchText((prev) => `${prev} ${categoryName}`.trim());
  }
};

  useEffect(() => {
    searchTrips(searchText);
  }, [searchText]);

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto p-8 font-sans">
      <h1 className="text-5xl font-bold text-[#2c7cd1] mb-12">เที่ยวไหนดี</h1>
      
      <div className="w-full max-w-4xl mb-12 relative">
        <p className="mb-2 flex text-center font-medium">ค้นหาที่เที่ยว</p>
        <input
          type="text"
          className="w-full text-center border-b-2 border-gray-100 focus:border-blue-400 outline-none text-xl transition-all placeholder:text-gray-300"
          placeholder="หาที่เที่ยวแล้วไปกัน..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ padding: "0.5rem" }}     
        />
        {searchText && (
          <button 
            className="absolute right-4 bottom-2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setSearchText("")}
          >
            <CircleX size={24} />
          </button>
        )}
      </div>
      
      <div className="flex flex-col gap-16 w-full">
        {trips.map((trip) => (
          <div key={trip.eid || trip.id} className="flex flex-col lg:flex-row gap-8 relative">
            {/* รูปใหญ่ */}
            <div className="w-full lg:w-1/3 shrink-0">
              <img
                src={trip.photos[0]}
                alt={trip.title}
                className="aspect-[4/3] object-cover rounded-[2rem] shadow-sm"
                
              />
            </div>

            {/* เนื้อหา */}
            <div className="flex flex-col flex-grow">
              <h2 className="text-2xl font-bold mb-3 text-black leading-tight">
                <a href={trip.url} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                  {trip.title}
                </a>
              </h2>
              
              <p className="text-gray-500 text-lg mb-2">
                {trip.description.length > 100 ? trip.description.substring(0, 100) + "..." : trip.description}
              </p>
              
              <a href={trip.url} target="_blank" rel="noreferrer" className="text-blue-400 underline mb-4 text-lg">
                อ่านต่อ
              </a>

              <div className="flex flex-wrap items-center gap-2 text-gray-400 mb-6 text-lg">
                <span>หมวด</span>
                {trip.tags.map((tag, index) => (
                  <span key={index} className="flex items-center">
                    <button 
                      className="underline hover:text-blue-500"
                      onClick={() => handleCategoryClick(tag)}
                    >
                      {tag}
                    </button>
                    {index === trip.tags.length - 2 ? <span className="mx-2">และ</span> : index < trip.tags.length - 2 ? <span className="hidden"></span> : null}
                  </span>
                ))}
              </div>

              {/* รูปประกอบเล็ก */}
              <div className="flex gap-6">
                {trip.photos.slice(1, 4).map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${trip.title} thumbnail ${index}`}
                    className="w-24 h-24 object-cover rounded-2xl cursor-pointer hover:opacity-80 transition-opacity"
                    width="350"
                    height="350"
                  />
                ))}
              </div> 

              {/* ปุ่ม share/link */}
              <div className="absolute bottom-4 right-0">
                <button 
                  className="w-14 h-14 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-400 hover:bg-blue-50 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(trip.url);
                    alert("link copied!");
                  }}
                >
                  <Link size={32} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;