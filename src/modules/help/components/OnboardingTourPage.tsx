import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ListAltIcon from '@mui/icons-material/ListAlt';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageContainer from '@/components/layout/PageContainer';
import { Routes } from '@/routes/routes';

// ---- Shared demo scenario ----
const DEMO_CLIENT = {
  name: 'Williams, Sarah',
  household: 'Sarah + 2 children',
  entryDate: '2026-02-28',
  shelterSite: 'Family Shelter',
  daysInShelter: 1,
  assessmentScore: 9,
  program: 'Family Permanent Supportive Housing',
};

// ---- Step 0: Welcome ----
const WelcomeStep: React.FC = () => (
  <Stack spacing={4}>
    <Box textAlign='center' py={2}>
      <Typography variant='h5' fontWeight={700} gutterBottom>
        Welcome to Frederick CAS
      </Typography>
      <Typography color='text.secondary' maxWidth={520} mx='auto'>
        This tour walks you through a realistic day-in-the-life scenario — a
        family arriving at the shelter, moving through the matching process, and
        being placed in permanent housing.
      </Typography>
    </Box>

    <Box
      display='grid'
      gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }}
      gap={2}
    >
      {[
        {
          icon: <PersonAddIcon color='primary' sx={{ fontSize: 36 }} />,
          title: 'Intake',
          desc: 'Register a new client and record their shelter entry.',
        },
        {
          icon: <ListAltIcon color='success' sx={{ fontSize: 36 }} />,
          title: 'Case Management',
          desc: 'Track your caseload and monitor match progress.',
        },
        {
          icon: <AssessmentIcon color='warning' sx={{ fontSize: 36 }} />,
          title: 'Management',
          desc: 'View KPIs, vouchers, and generate reports.',
        },
      ].map((section) => (
        <Paper
          key={section.title}
          variant='outlined'
          sx={{ p: 3, textAlign: 'center' }}
        >
          <Stack spacing={1} alignItems='center'>
            {section.icon}
            <Typography fontWeight={600}>{section.title}</Typography>
            <Typography variant='body2' color='text.secondary'>
              {section.desc}
            </Typography>
          </Stack>
        </Paper>
      ))}
    </Box>

    <Alert severity='info' icon={false}>
      <strong>Demo scenario:</strong> The Williams family (Sarah + 2 children)
      has just arrived at the Family Shelter and needs to be registered.
    </Alert>
  </Stack>
);

// ---- Step 1: Intake ----
const IntakeStep: React.FC = () => (
  <Stack spacing={3}>
    <Box>
      <Typography variant='h6' fontWeight={600} gutterBottom>
        Step 1 — Intake
      </Typography>
      <Typography color='text.secondary'>
        A new family has arrived. The shelter coordinator opens Intake and
        selects <strong>New Family Client</strong> to begin the 5-step wizard.
      </Typography>
    </Box>

    {/* Mini stepper preview */}
    <Paper variant='outlined' sx={{ p: 3 }}>
      <Stepper activeStep={0} sx={{ mb: 3 }}>
        {[
          'Client Search / Create',
          'Shelter Entry Details',
          'Housing Assessment',
          'Consent Form',
          'Review & Submit',
        ].map((label) => (
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
          borderTopColor: 'primary.main',
          borderRadius: 1,
          p: 3,
        }}
      >
        <Typography variant='h6' gutterBottom>
          Step 1: Client Search / Create
        </Typography>

        {/* Simulated filled-in client card */}
        <Card variant='outlined' sx={{ mt: 2, bgcolor: 'primary.50' }}>
          <CardContent>
            <Stack spacing={1}>
              <Box display='flex' alignItems='center' gap={1}>
                <FamilyRestroomIcon color='primary' />
                <Typography fontWeight={600}>{DEMO_CLIENT.name}</Typography>
                <Chip
                  label='Family'
                  color='primary'
                  size='small'
                  variant='outlined'
                />
              </Box>
              <Typography variant='body2' color='text.secondary'>
                Household: {DEMO_CLIENT.household}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Shelter site: {DEMO_CLIENT.shelterSite}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Entry date: {DEMO_CLIENT.entryDate}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Paper>

    <Box display='flex' justifyContent='flex-end'>
      <Button
        variant='outlined'
        size='small'
        endIcon={<OpenInNewIcon />}
        href={Routes.INTAKE_FAMILY}
      >
        Open Intake in app
      </Button>
    </Box>
  </Stack>
);

// ---- Step 2: Caseload ----
const CaseloadStep: React.FC = () => (
  <Stack spacing={3}>
    <Box>
      <Typography variant='h6' fontWeight={600} gutterBottom>
        Step 2 — Case Management
      </Typography>
      <Typography color='text.secondary'>
        After intake is submitted, Sarah Williams appears in the Family Shelter
        caseload. The coordinator can track her days in shelter, assessment
        score, and match status.
      </Typography>
    </Box>

    <TableContainer component={Paper} variant='outlined'>
      <Table size='small'>
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 600, bgcolor: 'grey.50' } }}>
            <TableCell>Name</TableCell>
            <TableCell>Shelter Site</TableCell>
            <TableCell>Days in Shelter</TableCell>
            <TableCell>Assessment Score</TableCell>
            <TableCell>Match Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Highlighted demo row */}
          <TableRow
            sx={{ bgcolor: 'primary.50', outline: '2px solid', outlineColor: 'primary.main' }}
          >
            <TableCell>
              <Typography variant='body2' fontWeight={600}>
                {DEMO_CLIENT.name}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {DEMO_CLIENT.household}
              </Typography>
            </TableCell>
            <TableCell>
              <Chip
                label='Family'
                size='small'
                color='primary'
                variant='outlined'
              />
            </TableCell>
            <TableCell>{DEMO_CLIENT.daysInShelter}</TableCell>
            <TableCell>{DEMO_CLIENT.assessmentScore}</TableCell>
            <TableCell>
              <Chip label='No Active Match' color='default' size='small' />
            </TableCell>
          </TableRow>
          {/* Other rows (greyed out context) */}
          {[
            { name: 'Johnson, Robert', site: 'Individual', days: 44, score: 12, status: 'Match Proposed', color: 'warning' as const },
            { name: 'Davis, Marcus', site: 'Individual', days: 27, score: null, status: 'No Active Match', color: 'default' as const },
          ].map((row) => (
            <TableRow key={row.name} sx={{ opacity: 0.5 }}>
              <TableCell>
                <Typography variant='body2'>{row.name}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={row.site}
                  size='small'
                  color={row.site === 'Family' ? 'primary' : 'success'}
                  variant='outlined'
                />
              </TableCell>
              <TableCell>{row.days}</TableCell>
              <TableCell>{row.score ?? '—'}</TableCell>
              <TableCell>
                <Chip label={row.status} color={row.color} size='small' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Alert severity='success' icon={<CheckCircleIcon />}>
      Sarah Williams is now in the system. Her assessment score of{' '}
      <strong>9</strong> places her in the priority queue for family housing.
    </Alert>

    <Box display='flex' justifyContent='flex-end'>
      <Button
        variant='outlined'
        size='small'
        endIcon={<OpenInNewIcon />}
        href={Routes.CASELOAD_FAMILY}
      >
        Open Caseload in app
      </Button>
    </Box>
  </Stack>
);

// ---- Step 3: Matches ----
const MatchesStep: React.FC = () => (
  <Stack spacing={3}>
    <Box>
      <Typography variant='h6' fontWeight={600} gutterBottom>
        Step 3 — Matches
      </Typography>
      <Typography color='text.secondary'>
        A voucher becomes available in the Family PSH program. CAS automatically
        proposes a match for the Williams family based on their assessment score
        and days homeless. The coordinator reviews and approves it.
      </Typography>
    </Box>

    {/* Match card */}
    <Paper
      variant='outlined'
      sx={{
        p: 2,
        borderLeft: '4px solid',
        borderLeftColor: 'warning.main',
      }}
    >
      <Stack spacing={1.5}>
        <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
          <Box>
            <Typography variant='subtitle1' fontWeight={600}>
              {DEMO_CLIENT.name}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {DEMO_CLIENT.program}
            </Typography>
          </Box>
          <Chip label='Family' size='small' color='primary' variant='outlined' />
        </Box>

        <Box display='flex' alignItems='center' gap={1}>
          <HourglassEmptyIcon fontSize='small' color='action' />
          <Typography variant='body2' color='text.secondary'>
            Waiting for coordinator review
          </Typography>
          <Chip
            label='1d waiting'
            size='small'
            color='warning'
          />
        </Box>

        <Divider />

        <Box display='flex' gap={1} justifyContent='flex-end'>
          <Button size='small' variant='outlined' startIcon={<OpenInNewIcon />}>
            View Match
          </Button>
          <Button
            size='small'
            variant='outlined'
            color='error'
          >
            Decline
          </Button>
          <Button
            size='small'
            variant='contained'
            startIcon={<CheckCircleIcon />}
            color='success'
          >
            Approve
          </Button>
        </Box>
      </Stack>
    </Paper>

    <Alert severity='warning' icon={<PendingActionsIcon />}>
      This match is <strong>waiting for your action</strong>. Approving moves it
      to the next step — shelter confirmation, then housing authority sign-off.
    </Alert>

    <Box display='flex' justifyContent='flex-end'>
      <Button
        variant='outlined'
        size='small'
        endIcon={<OpenInNewIcon />}
        href={Routes.MY_QUEUE}
      >
        Open My Queue in app
      </Button>
    </Box>
  </Stack>
);

// ---- Step 4: Management Dashboard ----
const ManagementStep: React.FC = () => (
  <Stack spacing={3}>
    <Box>
      <Typography variant='h6' fontWeight={600} gutterBottom>
        Step 4 — Management Dashboard
      </Typography>
      <Typography color='text.secondary'>
        Supervisors and coordinators use the Management dashboard to track
        voucher availability, matches in progress, and placements over time.
      </Typography>
    </Box>

    <Box
      display='grid'
      gridTemplateColumns={{ xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
      gap={2}
    >
      {[
        { icon: <HomeWorkIcon color='primary' />, label: 'Open Vouchers', value: 8, sub: 'Available for matching' },
        { icon: <PendingActionsIcon color='warning' />, label: 'Active Matches', value: 10, sub: 'Matches in progress', highlight: true },
        { icon: <CheckCircleIcon color='success' />, label: 'Placed This Month', value: 6, sub: 'Successful move-ins' },
        { icon: <AssessmentIcon />, label: 'Parked Clients', value: 3, sub: 'Temporarily unavailable' },
      ].map((kpi) => (
        <Card
          key={kpi.label}
          variant='outlined'
          sx={kpi.highlight ? { outline: '2px solid', outlineColor: 'warning.main' } : undefined}
        >
          <CardContent>
            <Stack spacing={0.5}>
              <Box display='flex' alignItems='center' gap={1}>
                {kpi.icon}
                <Typography variant='caption' color='text.secondary' fontWeight={600} textTransform='uppercase'>
                  {kpi.label}
                </Typography>
              </Box>
              <Typography variant='h4' fontWeight={700}>
                {kpi.value}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {kpi.sub}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>

    <Alert severity='info'>
      The <strong>Active Matches</strong> count increased by 1 — your approval
      of the Williams match is now reflected in the dashboard.
    </Alert>

    <Box display='flex' justifyContent='flex-end'>
      <Button
        variant='outlined'
        size='small'
        endIcon={<OpenInNewIcon />}
        href={Routes.MANAGEMENT_DASHBOARD}
      >
        Open Dashboard in app
      </Button>
    </Box>
  </Stack>
);

// ---- Step 5: Complete ----
const CompleteStep: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Stack spacing={4} alignItems='center' py={2}>
      <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main' }} />
      <Box textAlign='center'>
        <Typography variant='h5' fontWeight={700} gutterBottom>
          You're ready to use Frederick CAS!
        </Typography>
        <Typography color='text.secondary' maxWidth={480} mx='auto'>
          You've completed the tour. Here's a quick reference to the three core
          workflows you'll use every day.
        </Typography>
      </Box>

      <Box
        display='grid'
        gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }}
        gap={2}
        width='100%'
      >
        {[
          { label: 'New Family Intake', path: Routes.INTAKE_FAMILY, color: 'primary' as const },
          { label: 'New Individual Intake', path: Routes.INTAKE_INDIVIDUAL, color: 'success' as const },
          { label: 'My Match Queue', path: Routes.MY_QUEUE, color: 'warning' as const },
        ].map((link) => (
          <Button
            key={link.label}
            variant='outlined'
            color={link.color}
            fullWidth
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </Button>
        ))}
      </Box>

      <Button
        variant='contained'
        size='large'
        onClick={() => navigate(Routes.CASELOAD)}
      >
        Go to Case Management
      </Button>
    </Stack>
  );
};

// ---- Tour shell ----
const STEPS = [
  { label: 'Welcome', component: <WelcomeStep /> },
  { label: 'Intake', component: <IntakeStep /> },
  { label: 'Caseload', component: <CaseloadStep /> },
  { label: 'Matches', component: <MatchesStep /> },
  { label: 'Dashboard', component: <ManagementStep /> },
  { label: 'Done', component: null }, // rendered by CompleteStep inline
];

const OnboardingTourPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const totalSteps = STEPS.length;
  const progress = (step / (totalSteps - 1)) * 100;
  const isLast = step === totalSteps - 1;

  return (
    <PageContainer title='Getting Started Tour'>
      <Stack spacing={4}>
        {/* Progress bar */}
        <Box>
          <Box display='flex' justifyContent='space-between' mb={0.5}>
            <Typography variant='caption' color='text.secondary'>
              Step {step + 1} of {totalSteps}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {STEPS[step].label}
            </Typography>
          </Box>
          <LinearProgress variant='determinate' value={progress} sx={{ borderRadius: 1, height: 6 }} />
        </Box>

        {/* Step content */}
        <Paper variant='outlined' sx={{ p: { xs: 2, md: 4 }, minHeight: 420 }}>
          {isLast ? <CompleteStep /> : STEPS[step].component}
        </Paper>

        {/* Navigation */}
        {!isLast && (
          <Box display='flex' justifyContent='space-between'>
            <Button
              variant='outlined'
              startIcon={<ArrowBackIcon />}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            <Button
              variant='contained'
              endIcon={<ArrowForwardIcon />}
              onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
            >
              {step === totalSteps - 2 ? 'Finish Tour' : 'Next'}
            </Button>
          </Box>
        )}
      </Stack>
    </PageContainer>
  );
};

export default OnboardingTourPage;
