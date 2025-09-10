import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext)

  // Safe defaults
  const ratings = course.courseRatings || []

  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => scrollTo(0, 0)}
      className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg'
    >
      <img className='w-full' src={course.thumbnail || assets.placeholder} alt='' />

      <div className='p-3 text-left'>
        <h3 className='text-base font-semibold'>{course.title || 'Untitled Course'}</h3>
        <div className='flex items-center space-x-2'>
          <p>{calculateRating(course)}</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                alt='star'
                className='w-3.5 h-3.5'
              />
            ))}
          </div>
          <p className='text-gray-500'>{ratings.length}</p>
        </div>

        <p className='text-base font-semibold text-gray-800'>
          {currency}
          {((course.price || 0) - ((course.discount || 0) * (course.price || 0)) / 100).toFixed(2)}
        </p>
      </div>
    </Link>
  )
}

export default CourseCard
