import React, { useRef, useEffect, useState } from 'react';
import CarouselCard from '../Card/CarouselCard';
import image from '../../img';

import Style from './Carousel.module.css';

const cards = [
  { id: 1, title: 'Bat Mobile', description: 'The Bat Mobile is a car driven by the superhero Batman.', price: '0.0003', img: image.batMobile},
  { id: 2, title: 'Joker Mask', description: 'The Joker Mask is a mask worn by the villain Joker.', price: '0.0002', img: image.jokerMask},
  { id: 3, title: 'Bat cape', description: 'The Bat cape is a cape worn by the superhero Batman.', price: '0.0001', img: image.batcape},
  { id: 4, title: "Gordon's gun & Badge", description: "Gordon's gun is a gun used by the police commissioner Gordon.", price: '0.0004', img: image.JGBadge},
  { id: 5, title: 'Batman keychain', description: 'The Batman keychain is a keychain with the Batman logo.', price: '0.0005', img: image.batChain},
  { id: 6, title: 'Batman blade', description: 'The Batman blade is a blade used by the superhero Batman.', price: '0.0006', img: image.batblade},
    { id: 7, title: 'Bat Mobile', description: 'The Bat Mobile is a car driven by the superhero Batman.', price: '0.0003',  img: image.batMobile},
    { id: 8, title: 'Joker Mask', description: 'The Joker Mask is a mask worn by the villain Joker.', price: '0.0002',  img: image.jokerMask},
    { id: 9, title: 'Bat cape', description: 'The Bat cape is a cape worn by the superhero Batman.', price: '0.0001',  img: image.batcape},
    { id: 10, title: "Gordon's gun & Badge", description: "Gordon's gun is a gun used by the police commissioner Gordon.", price: '0.0004',  img: image.JGBadge},
    { id: 11, title: 'Batman keychain', description: 'The Batman keychain is a keychain with the Batman logo.', price: '0.0005',  img: image.batChain},
    { id: 12, title: 'Batman blade', description: 'The Batman blade is a blade used by the superhero Batman.', price: '0.0006',  img: image.batblade},

  // Add more cards as needed
];

const Carousel = () => {

  const [items, setItems] = useState([...cards]);
  const carouselRef = useRef(null);


  useEffect(() => {
    const interval = setInterval(() => {
      carouselRef.current.scrollLeft += 1;
    }, 10); 

    return () => clearInterval(interval);
  }, []);

  const handleScroll = () => {
    const scrollLeft = carouselRef.current.scrollLeft;
    const scrollWidth = carouselRef.current.scrollWidth;
    const clientWidth = carouselRef.current.clientWidth;
    if (scrollLeft === scrollWidth - clientWidth) {
      // Reached the end, reset scroll position
      carouselRef.current.scrollLeft = 0;
    }
  };



  return (

    <div className={Style.carousel_container}>
    <div className={Style.carousel} ref={carouselRef} onScroll={handleScroll}>
      {items.map((card) => (
        <CarouselCard key={card.id} id={card.id} title={card.title} description={card.description} price={card.price} img={card.img}  />
      ))}
    </div>

    </div>
  );
};

export default Carousel;