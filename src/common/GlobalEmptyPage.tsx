import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface GlobalEmptyPageProps {
  message?: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

const GlobalEmptyPage = ({
  message = 'No data available.',
  showAddButton = false,
  onAddClick,
}: GlobalEmptyPageProps) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height="100%"
    textAlign="center"
    py={6}
  >
    <Box
      component="img"
      src="https://i.ibb.co/Q35dCxR4/2953962.jpg"
      alt="Empty State"
      sx={{
        width: 500,
        height: 300,
        objectFit: 'cover',
        mb: 3,
      }}
    />
    <Typography variant="h6" color="text.secondary" mb={2}>
      {message}
    </Typography>

    {showAddButton ? (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddClick}
        sx={{ textTransform: 'none' }}
      >
        Add
      </Button>
    ) : null}
  </Box>
);

export default GlobalEmptyPage;
