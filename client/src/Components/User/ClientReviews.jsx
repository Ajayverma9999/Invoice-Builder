import React from 'react';
import Slider from 'react-slick';

// Slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const reviews = [
  {
    name: "Ravi Sharma",
    title: "Founder, TechNova",
    feedback: "This invoice builder saved us hours each week! Easy to use and beautifully designed templates.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Priya Mehta",
    title: "Freelance Designer",
    feedback: "Love how simple it is! Creating and sending invoices to clients is now effortless.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Aman Kapoor",
    title: "Owner, PrintWorks",
    feedback: "Highly recommend this tool for small businesses. Super efficient and looks professional.",
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  }
];

const backgroundImageURL = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80';

const ClientReviews = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,   // mobile default
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 }
      }
    ]
  };

  return (
    <section
      className="py-20 px-6"
      style={{
        backgroundImage: `url(${backgroundImageURL})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        color: 'white',
      }}
    >
      <div className="bg-black bg-opacity-60 max-w-7xl mx-auto rounded-xl p-10 text-white">
        <h2 className="text-4xl font-bold mb-6 text-center">What Our Clients Say</h2>
        <p className="mb-10 max-w-2xl mx-auto text-gray-300 text-center">
          Trusted by thousands of users across industries, our invoice generator helps you get paid faster.
        </p>

        <div className="flex flex-col md:flex-row gap-10">

          {/* Slider - 60% width on md+ */}
          <div className="md:w-3/5">
            <Slider {...settings}>
              {reviews.map((review, idx) => (
                <div key={idx} className="p-4">
                  <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 text-left text-gray-900">
                    <div className="flex items-center mb-4">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-lg">{review.name}</h4>
                        <p className="text-sm text-gray-600">{review.title}</p>
                      </div>
                    </div>
                    <p className="italic">"{review.feedback}"</p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Text block - 40% width on md+ */}
          <div className="hidden md:flex md:w-2/5 items-center border-l-4 border-indigo-500 pl-6">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Why Choose Us?</h3>
              <p className="text-gray-300">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptas
                quaerat eos nihil beatae officia, magnam dolor. Consequatur, doloribus earum
                voluptas aperiam autem, modi et cumque fuga minima itaque soluta.
              </p>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
};

export default ClientReviews;


