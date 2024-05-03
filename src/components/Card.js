import React from 'react';
import PropTypes from 'prop-types';
import './Cards.css';

function Card({img, candidate_name, partido}) {
    return (
        <div className='card text-center bg-dark animate__animated animate__fadeInUp'>
            <div className='overflow'>
                <img src={img} alt='' className='card-img-top'/>
            </div>
            <div className='card-body text-light'>
                <h1 className='card-title'>{candidate_name}</h1>
                <p className='card-text text-secondary'>{partido}</p>
                <a href='#!' className='btn btn-outline-secondary rounded-0'>
                    Elegir
                </a>
            </div>
        </div>
    );
}

Card.propTypes = {
    img: PropTypes.string,
    candidate_name: PropTypes.string.isRequired,
    partido: PropTypes.string.isRequired
}

export default Card;