import AddIcon from '@mui/icons-material/Add';
import BedIcon from '@mui/icons-material/Bed';
import FilterListIcon from '@mui/icons-material/FilterList';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageContainer from '@/components/layout/PageContainer';
import {
  Bed,
  bedStore,
  useBeds,
} from '@/modules/management/hooks/useBedStore';
import { Routes } from '@/routes/routes';

type ShelterSite = 'family' | 'individual' | 'all';
type MatchStatus = 'proposed' | 'in_progress' | 'pending_confirmation' | 'none';

interface CaseloadClient {
  id: string;
  name: string;
  entryDate: string;
  daysInShelter: number;
  assessmentScore: number | null;
  matchStatus: MatchStatus;
  lastAction: string;
  shelterSite: 'family' | 'individual';
}

// Placeholder data — replace with Apollo query results
const MOCK_CLIENTS: CaseloadClient[] = [
  {
    id: '1',
    name: 'Johnson, Robert',
    entryDate: '2025-01-15',
    daysInShelter: 44,
    assessmentScore: 12,
    matchStatus: 'proposed',
    lastAction: '2025-02-20',
    shelterSite: 'individual',
  },
  {
    id: '2',
    name: 'Williams, Sarah + 2 children',
    entryDate: '2024-09-01',
    daysInShelter: 180,
    assessmentScore: 8,
    matchStatus: 'in_progress',
    lastAction: '2025-02-25',
    shelterSite: 'family',
  },
  {
    id: '3',
    name: 'Davis, Marcus',
    entryDate: '2025-02-01',
    daysInShelter: 27,
    assessmentScore: null,
    matchStatus: 'none',
    lastAction: '2025-02-01',
    shelterSite: 'individual',
  },
  {
    id: '4',
    name: 'Garcia, Maria + 1 child',
    entryDate: '2024-12-10',
    daysInShelter: 80,
    assessmentScore: 10,
    matchStatus: 'pending_confirmation',
    lastAction: '2025-02-26',
    shelterSite: 'family',
  },
];

const matchStatusChip = (status: MatchStatus) => {
  switch (status) {
    case 'proposed':
      return <Chip label='Match Proposed' color='warning' size='small' />;
    case 'in_progress':
      return <Chip label='Match In Progress' color='info' size='small' />;
    case 'pending_confirmation':
      return <Chip label='Pending Confirmation' color='success' size='small' />;
    case 'none':
      return <Chip label='No Active Match' color='default' size='small' />;
  }
};

// ---- Assign Bed Dialog ----
interface AssignBedDialogProps {
  client: CaseloadClient;
  currentBed: Bed | undefined;
  open: boolean;
  onClose: () => void;
}

const AssignBedDialog: React.FC<AssignBedDialogProps> = ({
  client,
  currentBed,
  open,
  onClose,
}) => {
  const beds = useBeds(client.shelterSite);
  const available = beds.filter(
    (b) => b.occupantId === null || b.id === currentBed?.id,
  );
  const [selectedBedId, setSelectedBedId] = useState<string | null>(
    currentBed?.id ?? null,
  );

  const handleConfirm = () => {
    if (selectedBedId) {
      bedStore.assign(selectedBedId, client.id, client.name);
    } else if (currentBed) {
      bedStore.unassign(currentBed.id);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        {currentBed ? 'Reassign Bed' : 'Assign Bed'} — {client.name}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} pt={1}>
          {currentBed && (
            <Typography variant='body2' color='text.secondary'>
              Currently in bed <strong>{currentBed.name}</strong>. Select a
              different bed or click <em>Remove Assignment</em> to unassign.
            </Typography>
          )}
          {available.length === 0 ? (
            <Typography color='text.secondary'>
              No available beds. Add more in Management → Beds &amp; Occupancy.
            </Typography>
          ) : (
            <Grid container spacing={1.5}>
              {available.map((bed) => {
                const isSelected = selectedBedId === bed.id;
                return (
                  <Grid item xs={6} sm={4} key={bed.id}>
                    <Card
                      variant='outlined'
                      sx={{
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        bgcolor: isSelected ? 'primary.50' : undefined,
                      }}
                    >
                      <CardActionArea
                        onClick={() =>
                          setSelectedBedId(isSelected ? null : bed.id)
                        }
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
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        {currentBed && (
          <Button
            color='error'
            onClick={() => {
              bedStore.unassign(currentBed.id);
              onClose();
            }}
            sx={{ mr: 'auto' }}
          >
            Remove Assignment
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant='contained'
          onClick={handleConfirm}
          disabled={available.length === 0}
        >
          Confirm Assignment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ---- Main page ----
interface CaseloadPageProps {
  defaultSite?: ShelterSite;
}

const CaseloadPage: React.FC<CaseloadPageProps> = ({ defaultSite = 'all' }) => {
  const navigate = useNavigate();
  const [site, setSite] = useState<ShelterSite>(defaultSite);
  const [search, setSearch] = useState('');
  const [assignTarget, setAssignTarget] = useState<CaseloadClient | null>(null);

  const allBeds = useBeds();

  const filtered = MOCK_CLIENTS.filter((c) => {
    const matchesSite = site === 'all' || c.shelterSite === site;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchesSite && matchesSearch;
  });

  const tabValue = site === 'family' ? 0 : site === 'individual' ? 1 : 2;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const siteMap: ShelterSite[] = ['family', 'individual', 'all'];
    setSite(siteMap[newValue]);
  };

  return (
    <PageContainer
      title='Case Management'
      actions={
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => navigate(Routes.INTAKE)}
          size='small'
        >
          New Intake
        </Button>
      }
    >
      <Stack spacing={3}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label='Family Shelter' />
          <Tab label='Individuals Shelter' />
          <Tab label='All Clients' />
        </Tabs>

        <Box display='flex' gap={2} alignItems='center'>
          <TextField
            placeholder='Search clients…'
            size='small'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 280 }}
          />
          <Button
            startIcon={<FilterListIcon />}
            variant='outlined'
            size='small'
          >
            Filters
          </Button>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ ml: 'auto' }}
          >
            {filtered.length} client{filtered.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        <TableContainer component={Paper} variant='outlined'>
          <Table size='small'>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 600, bgcolor: 'grey.50' } }}>
                <TableCell>Name</TableCell>
                <TableCell>Shelter Site</TableCell>
                <TableCell>Entry Date</TableCell>
                <TableCell>Days in Shelter</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Bed</TableCell>
                <TableCell>Match Status</TableCell>
                <TableCell>Last Action</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align='center' sx={{ py: 4 }}>
                    <Typography color='text.secondary'>
                      No clients found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((client) => {
                const clientBed = allBeds.find(
                  (b) => b.occupantId === client.id,
                );
                return (
                  <TableRow
                    key={client.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() =>
                      navigate(
                        Routes.CLIENT_DASHBOARD.replace(':clientId', client.id),
                      )
                    }
                  >
                    <TableCell>
                      <Typography variant='body2' fontWeight={500}>
                        {client.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          client.shelterSite === 'family'
                            ? 'Family'
                            : 'Individual'
                        }
                        size='small'
                        color={
                          client.shelterSite === 'family' ? 'primary' : 'success'
                        }
                        variant='outlined'
                      />
                    </TableCell>
                    <TableCell>{client.entryDate}</TableCell>
                    <TableCell>{client.daysInShelter}</TableCell>
                    <TableCell>
                      {client.assessmentScore !== null ? (
                        client.assessmentScore
                      ) : (
                        <Typography variant='body2' color='error.main'>
                          Missing
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {clientBed ? (
                        <Chip
                          icon={<BedIcon sx={{ fontSize: '14px !important' }} />}
                          label={`Bed ${clientBed.name}`}
                          size='small'
                          onClick={() => setAssignTarget(client)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ) : (
                        <Button
                          size='small'
                          variant='text'
                          startIcon={<BedIcon />}
                          onClick={() => setAssignTarget(client)}
                          sx={{ px: 0.5, minWidth: 0, color: 'text.secondary' }}
                        >
                          Assign
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>{matchStatusChip(client.matchStatus)}</TableCell>
                    <TableCell>{client.lastAction}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Tooltip title='Park client (temporarily unavailable)'>
                        <Button
                          size='small'
                          startIcon={<PauseCircleOutlineIcon />}
                          color='warning'
                          variant='text'
                        >
                          Park
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      {assignTarget && (
        <AssignBedDialog
          client={assignTarget}
          currentBed={allBeds.find((b) => b.occupantId === assignTarget.id)}
          open={!!assignTarget}
          onClose={() => setAssignTarget(null)}
        />
      )}
    </PageContainer>
  );
};

export default CaseloadPage;
