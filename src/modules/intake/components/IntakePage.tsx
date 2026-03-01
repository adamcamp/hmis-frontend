import AddIcon from '@mui/icons-material/Add';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import PersonIcon from '@mui/icons-material/Person';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import PageContainer from '@/components/layout/PageContainer';
import { Routes } from '@/routes/routes';

interface ShelterCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
  accentColor: string;
}

const ShelterCard: React.FC<ShelterCardProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onClick,
  accentColor,
}) => (
  <Card
    variant='outlined'
    sx={{
      height: '100%',
      borderTop: `4px solid ${accentColor}`,
      '&:hover': { boxShadow: 3 },
    }}
  >
    <CardActionArea onClick={onClick} sx={{ height: '100%', p: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ color: accentColor }}>{icon}</Box>
          <Typography variant='h6' fontWeight={600}>
            {title}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {description}
          </Typography>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            sx={{ alignSelf: 'flex-start', mt: 1 }}
          >
            {actionLabel}
          </Button>
        </Stack>
      </CardContent>
    </CardActionArea>
  </Card>
);

const IntakePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer title='Intake' overlineText='New Client'>
      <Stack spacing={4}>
        <Box>
          <Typography variant='body1' color='text.secondary' gutterBottom>
            Select the shelter site to begin a new client intake. The intake
            process collects client information, shelter entry details,
            assessment score, and housing release consent.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ShelterCard
              icon={<FamilyRestroomIcon sx={{ fontSize: 40 }} />}
              title='Family Shelter'
              description='Intake for households with children entering the family shelter. Client will be eligible for family housing programs.'
              actionLabel='Start Family Intake'
              onClick={() => navigate(Routes.INTAKE_FAMILY)}
              accentColor='#1976d2'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ShelterCard
              icon={<PersonIcon sx={{ fontSize: 40 }} />}
              title='Individuals Shelter'
              description='Intake for single adults entering the individuals shelter. Client will be eligible for individual housing programs.'
              actionLabel='Start Individual Intake'
              onClick={() => navigate(Routes.INTAKE_INDIVIDUAL)}
              accentColor='#388e3c'
            />
          </Grid>
        </Grid>

        <Divider />

        <Box>
          <Typography variant='subtitle1' fontWeight={600} gutterBottom>
            Bulk Import
          </Typography>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            Already have client records in a spreadsheet? Import multiple
            clients at once using the CSV template.
          </Typography>
          <Button
            variant='outlined'
            startIcon={<UploadFileIcon />}
            onClick={() => navigate(Routes.INTAKE_IMPORT)}
            sx={{ mt: 1 }}
          >
            Import from Spreadsheet
          </Button>
        </Box>
      </Stack>
    </PageContainer>
  );
};

export default IntakePage;
