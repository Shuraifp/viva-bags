import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTruck, faExchangeAlt, faPhone } from '@fortawesome/free-solid-svg-icons';

const FeatureCards = () => {
  const features = [
    { icon: faCheckCircle, text: 'Quality Product' },
    { icon: faTruck, text: 'Free Shipping' },
    { icon: faExchangeAlt, text: '14-Day Return' },
    { icon: faPhone, text: '24/7 Support' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5 bg-gray-100">
  {features.map((feature, index) => (
    <div
      key={index}
      className="flex flex-col items-center justify-center h-44 p-4 bg-white shadow-md"
    >
      <FontAwesomeIcon icon={feature.icon} className="text-yellow-500 text-2xl mb-2" />
      <span className="text-gray-700 font-medium text-center sm:text-start">{feature.text}</span>
    </div>
  ))}
</div>

  );
};

export default FeatureCards;
