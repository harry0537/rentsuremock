import { FaStar, FaUser, FaCheck } from 'react-icons/fa'

// Mock data for reviews
const reviews = [
  {
    id: 1,
    user: 'John Smith',
    rating: 5,
    date: '2024-02-15',
    content: 'Great experience! The property was exactly as described and the landlord was very responsive.',
    verified: true,
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    rating: 4,
    date: '2024-02-10',
    content: 'Nice place, good location. The only issue was with the heating system, but it was fixed quickly.',
    verified: true,
  },
]

export default function ReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Write a Review */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-2xl text-gray-300 hover:text-yellow-400"
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Review
              </label>
              <textarea
                id="review"
                rows={4}
                className="input"
                placeholder="Share your experience..."
              />
            </div>

            <button type="submit" className="btn-primary">
              Submit Review
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Recent Reviews</h2>
          {reviews.map((review) => (
            <div key={review.id} className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaUser className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{review.user}</h3>
                    {review.verified && (
                      <span className="badge badge-verified">Verified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{review.date}</span>
                  </div>
                  <p className="text-gray-600">{review.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 