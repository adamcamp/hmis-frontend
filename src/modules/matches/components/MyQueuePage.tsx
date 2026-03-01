import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import PageContainer from '@/components/layout/PageContainer';

type MatchStep = 'coordinator_review' | 'shelter_confirmation' | 'hsa_confirmation';

interface MatchItem {
  id: string;
  clientName: string;
  shelterSite: 'family' | 'individual';
  program: string;
  step: MatchStep;
  daysWaiting: number;
  proposedDate: string;
  requiresAction: boolean;
}

// Placeholder — replace with Apollo query for matches where current user has pending decision
const MOCK_MATCHES: MatchItem[] = [
  {
    id: 'm1',
    clientName: 'Williams, Sarah + 2 children',
    shelterSite: 'family',
    program: 'Family Permanent Supportive Housing',
    step: 'shelter_confirmation',
    daysWaiting: 3,
    proposedDate: '2025-02-25',
    requiresAction: true,
  },
  {
    id: 'm2',
    clientName: 'Johnson, Robert',
    shelterSite: 'individual',
    program: 'Individual Rapid Re-Housing',
    step: 'coordinator_review',
    daysWaiting: 1,
    proposedDate: '2025-02-27',
    requiresAction: true,
  },
  {
    id: 'm3',
    clientName: 'Garcia, Maria + 1 child',
    shelterSite: 'family',
    program: 'Family Rapid Re-Housing',
    step: 'hsa_confirmation',
    daysWaiting: 0,
    proposedDate: '2025-02-28',
    requiresAction: false,
  },
];

const stepLabel = (step: MatchStep) => {
  switch (step) {
    case 'coordinator_review':
      return 'Waiting for coordinator review';
    case 'shelter_confirmation':
      return 'Waiting for shelter confirmation';
    case 'hsa_confirmation':
      return 'Waiting for housing admin';
  }
};

const MatchCard: React.FC<{ match: MatchItem }> = ({ match }) => (
  <Paper
    variant='outlined'
    sx={{
      p: 2,
      borderLeft: '4px solid',
      borderLeftColor: match.requiresAction ? 'warning.main' : 'grey.300',
    }}
  >
    <Stack spacing={1.5}>
      <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
        <Box>
          <Typography variant='subtitle1' fontWeight={600}>
            {match.clientName}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {match.program}
          </Typography>
        </Box>
        <Chip
          label={match.shelterSite === 'family' ? 'Family' : 'Individual'}
          size='small'
          color={match.shelterSite === 'family' ? 'primary' : 'success'}
          variant='outlined'
        />
      </Box>

      <Box display='flex' alignItems='center' gap={1}>
        <HourglassEmptyIcon fontSize='small' color='action' />
        <Typography variant='body2' color='text.secondary'>
          {stepLabel(match.step)}
        </Typography>
        {match.daysWaiting > 0 && (
          <Chip
            label={`${match.daysWaiting}d waiting`}
            size='small'
            color={match.daysWaiting > 2 ? 'error' : 'warning'}
          />
        )}
      </Box>

      <Divider />

      <Box display='flex' gap={1} justifyContent='flex-end'>
        <Button
          size='small'
          variant='outlined'
          startIcon={<OpenInNewIcon />}
        >
          View Match
        </Button>
        {match.requiresAction && (
          <>
            <Button
              size='small'
              variant='outlined'
              color='error'
              startIcon={<CloseIcon />}
            >
              Decline
            </Button>
            <Button
              size='small'
              variant='contained'
              startIcon={<CheckIcon />}
            >
              Approve
            </Button>
          </>
        )}
      </Box>
    </Stack>
  </Paper>
);

const MyQueuePage: React.FC = () => {
  const [tab, setTab] = useState(0);

  const myQueue = MOCK_MATCHES.filter((m) => m.requiresAction);
  const allActive = MOCK_MATCHES;

  const displayed = tab === 0 ? myQueue : allActive;

  return (
    <PageContainer title='Matches'>
      <Stack spacing={3}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab
            label={
              <Box display='flex' alignItems='center' gap={1}>
                My Queue
                {myQueue.length > 0 && (
                  <Chip
                    label={myQueue.length}
                    size='small'
                    color='warning'
                    sx={{ height: 18, '& .MuiChip-label': { px: 0.75, fontSize: 11 } }}
                  />
                )}
              </Box>
            }
          />
          <Tab label='All Active Matches' />
        </Tabs>

        {tab === 0 && myQueue.length === 0 && (
          <Alert severity='success'>
            Your queue is clear — no matches are waiting for your action.
          </Alert>
        )}

        <Stack spacing={2}>
          {displayed.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </Stack>
      </Stack>
    </PageContainer>
  );
};

export default MyQueuePage;
