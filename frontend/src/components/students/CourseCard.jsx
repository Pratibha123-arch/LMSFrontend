import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  const ratings = course.courseRatings || [];

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-300 pb-6 overflow-hidden rounded-xl hover:shadow-lg transition transform hover:-translate-y-1"
    >
      {/* 📌 Bigger Image */}
      <img
        className="w-full h-52 object-cover"
        src={course.thumbnail || assets.placeholder}
        alt="course thumbnail"
      />

      <div className="p-4 text-left">
        {/* 📌 Bigger Title */}
        <h3 className="text-lg font-semibold text-gray-800">
          {course.title || "Untitled Course"}
        </h3>

        {/* 📌 Ratings */}
        <div className="flex items-center space-x-2 mt-2">
          <p className="text-sm">{calculateRating(course)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(course))
                    ? assets.star
                    : assets.star_blank
                }
                alt="star"
                className="w-4 h-4"
              />
            ))}
          </div>
          <p className="text-gray-500 text-sm">{ratings.length}</p>
        </div>

        {/* 📌 Price */}
        <p className="text-lg font-bold text-gray-900 mt-3">
          {currency}
          {(
            (course.price || 0) -
            ((course.discount || 0) * (course.price || 0)) / 100
          ).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
