import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
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
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@/routes/routes';

import PageContainer from '@/components/layout/PageContainer';

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
  color?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, label, value, sub, color = 'primary.main' }) => (
  <Card variant='outlined' sx={{ height: '100%' }}>
    <CardContent>
      <Stack spacing={1}>
        <Box display='flex' alignItems='center' gap={1} color={color}>
          {icon}
          <Typography variant='caption' color='text.secondary' fontWeight={600} textTransform='uppercase' letterSpacing={0.5}>
            {label}
          </Typography>
        </Box>
        <Typography variant='h3' fontWeight={700}>
          {value}
        </Typography>
        {sub && (
          <Typography variant='body2' color='text.secondary'>
            {sub}
          </Typography>
        )}
      </Stack>
    </CardContent>
  </Card>
);

// Placeholder program data — replace with Apollo queries
const PROGRAMS = [
  { name: 'Family PSH', type: 'family', openVouchers: 2, activeMatches: 3, placedThisMonth: 1 },
  { name: 'Individual RRH', type: 'individual', openVouchers: 5, activeMatches: 4, placedThisMonth: 3 },
  { name: 'Family RRH', type: 'family', openVouchers: 1, activeMatches: 2, placedThisMonth: 0 },
  { name: 'Emergency Housing Vouchers', type: 'individual', openVouchers: 0, activeMatches: 1, placedThisMonth: 2 },
];

const ManagementDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const totalOpenVouchers = PROGRAMS.reduce((a, p) => a + p.openVouchers, 0);
  const totalActiveMatches = PROGRAMS.reduce((a, p) => a + p.activeMatches, 0);
  const totalPlacedMonth = PROGRAMS.reduce((a, p) => a + p.placedThisMonth, 0);

  return (
    <PageContainer title='Management & Analysis'>
      <Stack spacing={4}>
        <Box>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label='Dashboard' />
            <Tab label='Housing Programs' />
            <Tab label='Reports' />
            <Tab label='Beds & Occupancy' />
          </Tabs>
          <Divider />
        </Box>

        {tab === 0 && (
          <Stack spacing={4}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <KpiCard
                  icon={<HomeWorkIcon />}
                  label='Open Vouchers'
                  value={totalOpenVouchers}
                  sub='Available for matching'
                  color='primary.main'
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <KpiCard
                  icon={<PendingActionsIcon />}
                  label='Active Matches'
                  value={totalActiveMatches}
                  sub='Matches in progress'
                  color='warning.main'
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <KpiCard
                  icon={<CheckCircleIcon />}
                  label='Placed This Month'
                  value={totalPlacedMonth}
                  sub='Successful move-ins'
                  color='success.main'
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <KpiCard
                  icon={<PauseCircleOutlineIcon />}
                  label='Parked Clients'
                  value={7}
                  sub='Temporarily unavailable'
                  color='text.secondary'
                />
              </Grid>
            </Grid>

            <Box>
              <Typography variant='h6' fontWeight={600} gutterBottom>
                By Program
              </Typography>
              <TableContainer component={Paper} variant='outlined'>
                <Table size='small'>
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 600, bgcolor: 'grey.50' } }}>
                      <TableCell>Program</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align='right'>Open Vouchers</TableCell>
                      <TableCell align='right'>Active Matches</TableCell>
                      <TableCell align='right'>Placed This Month</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {PROGRAMS.map((p) => (
                      <TableRow key={p.name} hover>
                        <TableCell>{p.name}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{p.type}</TableCell>
                        <TableCell align='right'>
                          <Typography
                            variant='body2'
                            color={p.openVouchers > 0 ? 'primary.main' : 'text.disabled'}
                            fontWeight={p.openVouchers > 0 ? 600 : 400}
                          >
                            {p.openVouchers}
                          </Typography>
                        </TableCell>
                        <TableCell align='right'>{p.activeMatches}</TableCell>
                        <TableCell align='right'>{p.placedThisMonth}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Stack>
        )}

        {tab === 1 && (
          <Stack spacing={2}>
            <Typography variant='body2' color='text.secondary'>
              Manage your housing programs, sub-programs, and voucher inventory.
            </Typography>
            <Box
              sx={{ p: 4, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}
            >
              <AssignmentIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography color='text.secondary'>
                Program management — connect to CAS Programs API
              </Typography>
            </Box>
          </Stack>
        )}

        {tab === 2 && (
          <Stack spacing={2}>
            <Typography variant='body2' color='text.secondary'>
              Download reports for match progress, housed clients, agency interactions, and parked clients.
            </Typography>
            <Box display='flex' gap={2}>
              <Button
                variant='contained'
                startIcon={<DownloadIcon />}
                onClick={() => navigate(Routes.MANAGEMENT_EXPORT)}
              >
                Custom CSV Export
              </Button>
            </Box>
            <Box
              sx={{ p: 4, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}
            >
              <AssignmentIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography color='text.secondary'>
                Canned reports — connect to CAS reporting API
              </Typography>
            </Box>
          </Stack>
        )}

        {tab === 3 && (
          <Stack spacing={2}>
            <Typography variant='body2' color='text.secondary'>
              Configure beds for each shelter site and track occupancy in real time.
            </Typography>
            <Box>
              <Button
                variant='contained'
                onClick={() => navigate(Routes.MANAGEMENT_BEDS)}
              >
                Open Beds &amp; Occupancy
              </Button>
            </Box>
          </Stack>
        )}
      </Stack>
    </PageContainer>
  );
};

export default ManagementDashboardPage;
