import React from 'react';
import PropTypes from 'prop-types';
import './Cards.css';

import { Candidate } from './Vote';

import MultipleInteractionCard from './MultipleInteractionCard';

type CandidateCardProps = {
    candidate: Candidate,
    handleCardPick: (candidate: Candidate) => void
};

const CandidateCard: React.FunctionComponent<CandidateCardProps> = ({ candidate, handleCardPick }) => {
    const handleClick = () => {
        handleCardPick(candidate);
    };

    return (
        // <a className='card text-center bg-dark animate__animated animate__fadeInUp' onClick={handleClick}>
        //     <div className='overflow'>
        //         <img src={candidate.image} alt='' className='card-img-top' />
        //     </div>
        //     <div className='card-body text-light'>
        //         <h1 className='card-title'>{candidate.candidato}</h1>
        //         <p className='card-text text-secondary'>{candidate.partido}</p>
        //     </div>
        // </a>
        <MultipleInteractionCard candidate={candidate} />
    );
}

export default CandidateCard;
