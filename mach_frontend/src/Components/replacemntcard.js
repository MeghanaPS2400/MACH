/*replacement card*/ 
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { Tooltip } from 'react-tooltip';
import '../styles/replacement.css';
import SkillComparisonChart from './replacemntcomparision';
 
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
 
const ReplacementCard = ({ employee, skillAvgRatings }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
 
  return (
    <div>
      <div className="replacement-card" onClick={handleOpen}>
        <div>
          <p className="service">{employee.designation}</p>
        </div>
        <FontAwesomeIcon icon={faUserCircle} className="person-icon" />
        <h3 className="Name">{employee.name}</h3>
        <p className='account'>{employee.account}</p>
        <div className="skill-rating-container">
          <div className="skill-rating-box" data-tooltip-id={`matchingSkills-${employee.name}`}>
            <p className="skill-rating">{employee.matching_skills}</p>
            <Tooltip id={`matchingSkills-${employee.name}`} place="top" effect="solid">
              Matching Skills
            </Tooltip>
          </div>
          <div className="skill-rating-box" data-tooltip-id={`averageRating-${employee.name}`}>
            <p className="skill-rating">{employee.average_rating.toFixed(2)}</p>
            <Tooltip id={`averageRating-${employee.name}`} place="top" effect="solid">
              Average Rating
            </Tooltip>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {employee.name}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Account: {employee.account}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Matching Skills: {employee.matching_skills}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Average Rating: {employee.average_rating.toFixed(2)}
            </Typography>
            <SkillComparisonChart matchedSkills={employee.matched_skills} skillAvgRatings={skillAvgRatings} />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
 
export default ReplacementCard;