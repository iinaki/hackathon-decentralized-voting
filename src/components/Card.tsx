import React from 'react';
import PropTypes from 'prop-types';
import './Cards.css';

type CardProps = {
    img: string,
    candidate_name: string,
    partido: string,
    handleCardPick: () => void
};

const Card: React.FunctionComponent<CardProps> = ({ img, candidate_name, partido, handleCardPick }) => {
    const handleClick = () => {
        handleCardPick();
    };

    return (
        <a href='#!' className='card text-center bg-dark animate__animated animate__fadeInUp' onClick={handleClick}>
            <div className='overflow'>
                <img src={img} alt='' className='card-img-top'/>
            </div>
            <div className='card-body text-light'>
                <h1 className='card-title'>{candidate_name}</h1>
                <p className='card-text text-secondary'>{partido}</p>
            </div>
        </a>
    );
}
