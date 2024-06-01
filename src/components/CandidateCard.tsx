import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';

import { Candidate } from './Vote';

type CandidateCard = {
    candidate: Candidate,
    handleCardPick: (candidate: Candidate) => void,
    cardPicked: boolean
};

const CandidateCard: React.FunctionComponent<CandidateCard> = ({ candidate, handleCardPick, cardPicked }) => {

  const handleClick = () => {
    handleCardPick(candidate);
  };

  return (
    <Card variant="outlined" sx={{ width: 320, border: cardPicked ? '3px solid #4147fa' : '1px solid #ccc', boxShadow: cardPicked ? '0 0 5px rgba(255, 0, 0, 0.5)' : 'none', borderRadius: '10px', cursor: 'pointer' }} onClick={handleClick} >
      <CardOverflow>
        <AspectRatio ratio="2">
          <img
            src={candidate.image}
            loading="lazy"
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent >
        <Typography level="title-md">
          <Link overlay underline="none" >
            {candidate.candidato}
          </Link>
        </Typography>
        <Typography level="body-sm">
          <Link overlay underline="none">
            {candidate.partido}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CandidateCard;
