import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";


export const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  try {
    const review = new Review({ user: req.user.Id, product : productId, rating, comment });
    await review.save();

    const product = await Product.findById(productId);
    const totalRating = product.rating * product.reviewCount + rating;
    product.reviewCount += 1;
    product.rating = totalRating / product.reviewCount; 

    await product.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add review', error });
  }
}

export const fetchReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id }).populate('user').sort({ createdAt: -1 });
    console.log(reviews)
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch reviews', error });
  }
}