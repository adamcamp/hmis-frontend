import AddIcon from '@mui/icons-material/Add';
import BedIcon from '@mui/icons-material/Bed';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import PageContainer from '@/components/layout/PageContainer';
import {
  Bed,
  bedStore,
  useBeds,
} from '@/modules/management/hooks/useBedStore';

// ---- Bed card ----
const BedCard: React.FC<{ bed: Bed }> = ({ bed }) => {
  const occupied = bed.occupantId !== null;

  return (
    <Card
      variant='outlined'
      sx={{
        borderColor: occupied ? 'warning.main' : 'success.main',
        bgcolor: occupied ? 'warning.50' : 'success.50',
        position: 'relative',
      }}
    >
      <CardContent sx={{ pb: '12px !important' }}>
        <Stack spacing={0.5}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Box display='flex' alignItems='center' gap={0.5}>
              <BedIcon fontSize='small' color={occupied ? 'warning' : 'success'} />
              <Typography variant='subtitle2' fontWeight={700}>
                Bed {bed.name}
              </Typography>
            </Box>
            <Chip
              label={occupied ? 'Occupied' : 'Available'}
              size='small'
              color={occupied ? 'warning' : 'success'}
              variant='filled'
              sx={{ height: 20, fontSize: 11 }}
            />
          </Box>

          {occupied ? (
            <Box display='flex' alignItems='center' justifyContent='space-between'>
              <Box display='flex' alignItems='center' gap={0.5}>
                <PersonIcon fontSize='small' color='action' />
                <Typography variant='body2' color='text.secondary'>
                  {bed.occupantName}
                </Typography>
              </Box>
              <Tooltip title='Remove from bed'>
                <IconButton
                  size='small'
                  onClick={() => bedStore.unassign(bed.id)}
                  sx={{ ml: 1 }}
                >
                  <CloseIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Typography variant='body2' color='text.disabled' fontStyle='italic'>
              Unoccupied
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

// ---- Add Beds Dialog ----
interface AddBedsDialogProps {
  site: 'family' | 'individual';
  open: boolean;
  onClose: () => void;
}

const AddBedsDialog: React.FC<AddBedsDialogProps> = ({ site, open, onClose }) => {
  const [count, setCount] = useState('');
  const existing = useBeds(site);
  const nextNum = existing.length + 1;
  const parsedCount = Math.max(0, Math.min(50, parseInt(count) || 0));

  const handleAdd = () => {
    if (parsedCount > 0) {
      bedStore.addBeds(site, parsedCount);
      setCount('');
      onClose();
    }
  };

  const siteLabel = site === 'family' ? 'Family Shelter' : 'Individuals Shelter';
  const preview = parsedCount > 0
    ? `Will add beds ${String(nextNum).padStart(3, '0')} – ${String(nextNum + parsedCount - 1).padStart(3, '0')}`
    : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle>Add Beds — {siteLabel}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} pt={1}>
          <TextField
            label='Number of beds to add'
            type='number'
            value={count}
            onChange={(e) => setCount(e.target.value)}
            inputProps={{ min: 1, max: 50 }}
            InputProps={{
              endAdornment: <InputAdornment position='end'>beds</InputAdornment>,
            }}
            autoFocus
            fullWidth
          />
          {preview && (
            <Alert severity='info' icon={false}>
              {preview}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant='contained'
          onClick={handleAdd}
          disabled={parsedCount === 0}
        >
          Add {parsedCount > 0 ? parsedCount : ''} Beds
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ---- Shelter panel ----
const ShelterPanel: React.FC<{ site: 'family' | 'individual' }> = ({ site }) => {
  const beds = useBeds(site);
  const [addOpen, setAddOpen] = useState(false);
  const occupied = beds.filter((b) => b.occupantId !== null).length;
  const available = beds.length - occupied;

  return (
    <Stack spacing={3}>
      {/* Summary */}
      <Box display='flex' alignItems='center' gap={2} flexWrap='wrap'>
        <Chip label={`${beds.length} total`} variant='outlined' />
        <Chip label={`${occupied} occupied`} color='warning' variant='outlined' />
        <Chip label={`${available} available`} color='success' variant='outlined' />
        <Box sx={{ flex: 1 }} />
        <Button
          variant='outlined'
          startIcon={<AddIcon />}
          size='small'
          onClick={() => setAddOpen(true)}
        >
          Add Beds
        </Button>
      </Box>

      {/* Bed grid */}
      {beds.length === 0 ? (
        <Alert severity='info'>
          No beds configured yet. Click <strong>Add Beds</strong> to get started.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {beds.map((bed) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={bed.id}>
              <BedCard bed={bed} />
            </Grid>
          ))}
        </Grid>
      )}

      <AddBedsDialog
        site={site}
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </Stack>
  );
};

// ---- Page ----
const BedsPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const site: 'family' | 'individual' = tab === 0 ? 'family' : 'individual';

  return (
    <PageContainer title='Beds & Occupancy'>
      <Stack spacing={3}>
        <Typography variant='body2' color='text.secondary'>
          Configure beds for each shelter site and track occupancy. Use{' '}
          <strong>Add Beds</strong> to set up new rooms, and click the ✕ on an
          occupied bed to check a client out.
        </Typography>

        <Box>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label='Family Shelter' />
            <Tab label='Individuals Shelter' />
          </Tabs>
        </Box>

        <ShelterPanel site={site} />
      </Stack>
    </PageContainer>
  );
};

export default BedsPage;
