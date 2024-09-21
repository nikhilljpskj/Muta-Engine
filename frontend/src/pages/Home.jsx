// src/pages/Home.jsx
import React from 'react';
import './Home.scss';
import HomeBannerScroll from './HomeBannerScroll';
import ProductScroll from './ProductScroll';
import CategoryScroll from './CategoryScroll';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <>
        <Header />
        <div className="home">
            <section className="home__banner">
                <HomeBannerScroll />
            </section>
            
            <section className="home__products">
                <h2>Products</h2>
                <ProductScroll />
            </section>

            <section className="home__categories">
                <h2>Categories</h2>
                <CategoryScroll />
            </section>
        </div>
        <Footer />
        </>
    );
};

export default Home;
