import React from 'react';
import { Link } from 'react-router-dom';
import backpack from '../assets/used/4.avif';
import bucketbag from '../assets/used/5.avif';
import clutches from '../assets/used/6.avif';
import coolerbag from '../assets/used/7.avif';
import crossbody from '../assets/used/8.avif';
import duffle from '../assets/used/9.avif';
import laptop from '../assets/used/10.avif';
import messenger from '../assets/used/1.avif';
import slings from '../assets/used/2.avif';
import tote from '../assets/used/3.avif';

const categories = [
  {id: 1,image: backpack,name: 'Backpacks'},
  {id: 2,image: bucketbag,name: 'Bucket bag'},
  {id: 3,image: clutches,name: 'Clutches'},
  {id: 4,image: coolerbag,name: 'Cooler bag'}, 
  {id: 5,image: crossbody,name: 'Crossbody'},
  {id: 6,image: duffle,name: 'Duffles'},
  {id: 7,image: laptop,name: 'Laptop satchels'},
  {id: 8,image: messenger,name: 'Messenger'},
  {id: 9,image: slings,name: 'Slings'},
  {id: 10,image: tote,name: 'Tote bags'},
]

const CategoryGrid = () => {

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center md:text-left mb-6">CATEGORIES</h1>
      <div className="flex justify-center md:block">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link to={`/shop/${category.name}`}><div
            key={category.id}
            className="bg-white border w-60 md:w-full border-gray-300 shadow-md overflow-hidden transfor transitio duration-300 hover:scale-105 hover:bg-yellow-500 hover:text-white"
          >
            <div className="h-32 overflow-hidden hidden md:block">
              <img
                src={category.image}
                alt={category.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="md:p-6 text-center relative">
            <img
                src={category.image}
                alt={category.name} 
                className="object-cover w-full h-full md:hidden"
              />
               <div className="md:hidden absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
              <h2 className="text-xl text-white md:text-black  font-semibold">{category.name}</h2>
              {/* <p className="text-sm text-white md:text-gray-500">{category.name}</p> */}
              </div>
            </div>
          </div></Link>
        ))}
      </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
