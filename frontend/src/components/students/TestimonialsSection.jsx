import React, { useState } from 'react';
import { assets } from '../../assets/assets'; // ✅ Make sure you import your assets

const dummyTestimonial = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    feedback:
      "This platform helped me upskill and land my dream job. The structured courses and hands-on projects were a game changer!",
  },
  {
    name: "Ananya Gupta",
    role: "Data Analyst",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    feedback:
      "The courses are well-designed and the mentorship support really boosted my confidence. Highly recommended!",
  },
  {
    name: "Arjun Mehta",
    role: "Full Stack Developer",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    rating: 5,
    feedback:
      "I loved the real-world projects. They made me interview-ready and I could confidently showcase my skills to employers.",
  },
];

const TestimonialsSection = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  return (
    <div className="pb-14 px-8 md:px-0">
      <h2 className="text-3xl font-semibold text-gray-800">Testimonials</h2>
      <p className="md:text-base text-gray-500 mt-3">
        Hear from our learners as they share their journeys of transformation,
        success, and how our <br /> platform has made a difference in their
        lives.
      </p>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="text-sm text-left border border-gray-200 pb-6 rounded-xl bg-white 
                       shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            {/* Header with Image */}
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-100">
              <img
                className="h-12 w-12 rounded-full border border-gray-300"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-800">
                  {testimonial.name}
                </h1>
                <p className="text-gray-600">{testimonial.role}</p>
              </div>
            </div>

            {/* Feedback */}
            <div className="p-5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    className="h-5"
                    key={i}
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-gray-600 mt-4 line-clamp-3">
                {testimonial.feedback}
              </p>
            </div>

            {/* Read More */}
            <button
              onClick={() => setSelectedTestimonial(testimonial)}
              className="text-blue-600 font-medium px-5 hover:text-blue-800 transition-colors"
            >
              Read more →
            </button>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-lg w-full shadow-xl relative">
            <button
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-4">
              <img
                className="h-12 w-12 rounded-full border"
                src={selectedTestimonial.image}
                alt={selectedTestimonial.name}
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-800">
                  {selectedTestimonial.name}
                </h1>
                <p className="text-gray-600">{selectedTestimonial.role}</p>
              </div>
            </div>

            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <img
                  className="h-5"
                  key={i}
                  src={i < Math.floor(selectedTestimonial.rating) ? assets.star : assets.star_blank}
                  alt="star"
                />
              ))}
            </div>

            <p className="text-gray-700">{selectedTestimonial.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsSection;
