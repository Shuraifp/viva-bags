import React from 'react';
import { CheckCircle, Warning, Error, Info } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Typography } from '@mui/material';

const AlertMessage = ({ type, message, onClose }) => {

  const alertTypes = {
    success: {
      backgroundColor: '#4CAF50',
      color: '#fff',
      icon: <CheckCircle />,
      title: 'Success',
    },
    warning: {
      backgroundColor: '#FF9800',
      color: '#fff',
      icon: <Warning />,
      title: 'Warning',
    },
    error: {
      backgroundColor: '#F44336',
      color: '#fff',
      icon: <Error />,
      title: 'Error',
    },
    neutral: {
      backgroundColor: '#9E9E9E',
      color: '#fff',
      icon: <Info />,
      title: 'Neutral',
    },
  };

  // Fallback to neutral if type is not provided
  const { backgroundColor, color, icon, title } = alertTypes[type] || alertTypes.neutral;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: backgroundColor,
        color: color,
        padding: '10px 20px',
        borderRadius: '8px',
        marginBottom: '10px',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ marginRight: '10px' }}>
          {icon}
        </Box>
        <Typography variant="body1">
          <strong>{title}: </strong>{message}
        </Typography>
      </Box>
      <IconButton onClick={onClose} sx={{ color: color }}>
        <CloseRoundedIcon />
      </IconButton>
    </Box>
  );
};

export default AlertMessage;
