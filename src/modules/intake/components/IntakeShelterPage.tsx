import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BedIcon from '@mui/icons-material/Bed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageContainer from '@/components/layout/PageContainer';
import {
  bedStore,
  useBeds,
} from '@/modules/management/hooks/useBedStore';
import { Routes } from '@/routes/routes';

const STEPS = [
  'Client Search / Create',
  'Shelter Entry Details',
  'Housing Assessment',
  'Consent Form',
  'Review & Submit',
];

// ---- Bed picker shown in step 2 ----
interface BedPickerProps {
  shelterType: 'family' | 'individual';
  selectedBedId: string | null;
  onSelect: (bedId: string | null) => void;
}

const BedPicker: React.FC<BedPickerProps> = ({
  shelterType,
  selectedBedId,
  onSelect,
}) => {
  const beds = useBeds(shelterType);
  const available = beds.filter((b) => b.occupantId === null);

  if (available.length === 0) {
    return (
      <Alert severity='warning'>
        No available beds in this shelter. Add more beds in{' '}
        <strong>Management → Beds &amp; Occupancy</strong>.
      </Alert>
    );
  }

  return (
    <Grid container spacing={1.5}>
      {available.map((bed) => {
        const isSelected = selectedBedId === bed.id;
        return (
          <Grid item xs={6} sm={4} md={3} key={bed.id}>
            <Card
              variant='outlined'
              sx={{
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? 'primary.50' : undefined,
                transition: 'all 0.15s',
              }}
            >
              <CardActionArea
                onClick={() => onSelect(isSelected ? null : bed.id)}
                sx={{ p: 1.5 }}
              >
                <Box display='flex' alignItems='center' gap={1}>
                  <BedIcon
                    fontSize='small'
                    color={isSelected ? 'primary' : 'action'}
                  />
                  <Typography
                    variant='body2'
                    fontWeight={isSelected ? 700 : 400}
                  >
                    Bed {bed.name}
                  </Typography>
                  {isSelected && (
                    <CheckCircleIcon
                      color='primary'
                      sx={{ fontSize: 16, ml: 'auto' }}
                    />
                  )}
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

interface IntakeShelterPageProps {
  shelterType: 'family' | 'individual';
}

const IntakeShelterPage: React.FC<IntakeShelterPageProps> = ({
  shelterType,
}) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);

  const isFamily = shelterType === 'family';
  const title = isFamily ? 'Family Shelter Intake' : 'Individuals Shelter Intake';
  const accentColor = isFamily ? 'primary.main' : 'success.main';

  const handleNext = () =>
    setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  const isLastStep = activeStep === STEPS.length - 1;
  const isComplete = activeStep === STEPS.length;

  const handleSubmit = () => {
    // Assign selected bed when intake is submitted
    if (selectedBedId) {
      bedStore.assign(selectedBedId, `new-${Date.now()}`, 'New Client');
    }
    setActiveStep(STEPS.length);
  };

  if (isComplete) {
    return (
      <PageContainer title={title}>
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          gap={3}
          py={6}
        >
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main' }} />
          <Typography variant='h5' fontWeight={600}>
            Intake Complete
          </Typography>
          <Typography color='text.secondary' textAlign='center'>
            The client has been added to the system and is available for housing
            matching.
            {selectedBedId && (
              <>
                {' '}
                They have been assigned to bed{' '}
                <strong>
                  {bedStore.getAll().find((b) => b.id === selectedBedId)?.name}
                </strong>
                .
              </>
            )}
          </Typography>
          <Box display='flex' gap={2}>
            <Button variant='outlined' onClick={() => navigate(Routes.INTAKE)}>
              Back to Intake
            </Button>
            <Button
              variant='contained'
              onClick={() =>
                navigate(
                  isFamily ? Routes.CASELOAD_FAMILY : Routes.CASELOAD_INDIVIDUAL,
                )
              }
            >
              View Caseload
            </Button>
          </Box>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={title}
      leftAlignedToolbar={
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(Routes.INTAKE)}
          size='small'
        >
          All Intake Options
        </Button>
      }
    >
      <Box>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderTop: '3px solid',
            borderTopColor: accentColor,
            borderRadius: 1,
            p: 3,
            minHeight: 300,
          }}
        >
          <Typography variant='h6' gutterBottom>
            Step {activeStep + 1}: {STEPS[activeStep]}
          </Typography>

          {activeStep === 0 && (
            <Typography color='text.secondary'>
              Search for an existing client or create a new record.
            </Typography>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography color='text.secondary' gutterBottom>
                Record the shelter entry date, referring agency, and assign a
                bed.
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box mb={2}>
                <Typography variant='subtitle2' gutterBottom>
                  Bed / Room Assignment
                </Typography>
                {selectedBedId ? (
                  <Box display='flex' alignItems='center' gap={1} mb={1.5}>
                    <Chip
                      icon={<BedIcon />}
                      label={`Bed ${bedStore.getAll().find((b) => b.id === selectedBedId)?.name} selected`}
                      color='primary'
                      onDelete={() => setSelectedBedId(null)}
                    />
                  </Box>
                ) : (
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 1.5 }}
                  >
                    Select an available bed below, or skip to assign later.
                  </Typography>
                )}
                <BedPicker
                  shelterType={shelterType}
                  selectedBedId={selectedBedId}
                  onSelect={setSelectedBedId}
                />
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Typography color='text.secondary'>
              Complete a VI-SPDAT or housing assessment for this client.
            </Typography>
          )}

          {activeStep === 3 && (
            <Typography color='text.secondary'>
              Upload and tag the signed housing release consent form.
            </Typography>
          )}

          {activeStep === 4 && (
            <Box>
              <Typography color='text.secondary' gutterBottom>
                Review all information before submitting.
              </Typography>
              {selectedBedId && (
                <Alert severity='success' icon={<BedIcon />} sx={{ mt: 2 }}>
                  Bed{' '}
                  <strong>
                    {
                      bedStore
                        .getAll()
                        .find((b) => b.id === selectedBedId)?.name
                    }
                  </strong>{' '}
                  will be assigned on submission.
                </Alert>
              )}
              {!selectedBedId && (
                <Alert severity='info' sx={{ mt: 2 }}>
                  No bed selected — you can assign one from the caseload later.
                </Alert>
              )}
            </Box>
          )}
        </Box>

        <Box display='flex' justifyContent='space-between' mt={3}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant='outlined'
          >
            Back
          </Button>
          <Button
            variant='contained'
            onClick={isLastStep ? handleSubmit : handleNext}
          >
            {isLastStep ? 'Submit Intake' : 'Next'}
          </Button>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default IntakeShelterPage;
